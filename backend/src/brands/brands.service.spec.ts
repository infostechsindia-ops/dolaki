import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Brand, Product } from '../database/entities';

describe('BrandsService — FEAT-003 Dynamic Brand Catalog & Filter Engine', () => {
  let service: BrandsService;

  const mockBrandRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn((dto) => dto),
    save: jest.fn((entity) => Promise.resolve({ id: 'brand-uuid', updatedAt: new Date(), createdAt: new Date(), ...entity })),
    count: jest.fn(),
  };

  const mockProductRepo = {
    count: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandsService,
        { provide: getRepositoryToken(Brand), useValue: mockBrandRepo },
        { provide: getRepositoryToken(Product), useValue: mockProductRepo },
      ],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
  });

  // ─── findAll ──────────────────────────────────────────────────────────────

  describe('findAll()', () => {
    it('returns only active brands by default', async () => {
      const activeBrand = { id: 'b1', name: 'AuraTech', slug: 'auratech', isActive: true, logoUrl: null, description: null, createdAt: new Date(), updatedAt: new Date() };
      mockBrandRepo.findAndCount.mockResolvedValue([[activeBrand], 1]);
      mockProductRepo.count.mockResolvedValue(5);

      const result = await service.findAll();

      // Should filter by isActive: true
      expect(mockBrandRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: { isActive: true } }),
      );
      expect(result.data).toHaveLength(1);
      expect(result.data[0].productCount).toBe(5);
      expect(result.meta.total).toBe(1);
    });

    it('returns all brands (including inactive) when includeInactive=true', async () => {
      const brands = [
        { id: 'b1', name: 'Active Brand', slug: 'active', isActive: true, logoUrl: null, description: null, createdAt: new Date(), updatedAt: new Date() },
        { id: 'b2', name: 'Inactive Brand', slug: 'inactive', isActive: false, logoUrl: null, description: null, createdAt: new Date(), updatedAt: new Date() },
      ];
      mockBrandRepo.findAndCount.mockResolvedValue([brands, 2]);
      mockProductRepo.count.mockResolvedValue(0);

      const result = await service.findAll({ includeInactive: true });

      // Should NOT filter by isActive when includeInactive=true
      expect(mockBrandRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: {} }),
      );
      expect(result.data).toHaveLength(2);
    });

    it('paginates results correctly', async () => {
      mockBrandRepo.findAndCount.mockResolvedValue([[], 100]);
      mockProductRepo.count.mockResolvedValue(0);

      const result = await service.findAll({ page: 3, pageSize: 10 });

      expect(mockBrandRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 }),
      );
      expect(result.meta.page).toBe(3);
      expect(result.meta.pageSize).toBe(10);
      expect(result.meta.hasNextPage).toBe(true);
    });

    it('enforces max pageSize of 100', async () => {
      mockBrandRepo.findAndCount.mockResolvedValue([[], 0]);

      await service.findAll({ pageSize: 999 });

      expect(mockBrandRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ take: 100 }),
      );
    });
  });

  // ─── findBySlug ───────────────────────────────────────────────────────────

  describe('findBySlug()', () => {
    it('returns brand detail when found and active', async () => {
      const brand = { id: 'b1', name: 'AuraTech', slug: 'auratech', isActive: true, logoUrl: 'https://example.com/logo.png', description: 'Tech brand', createdAt: new Date(), updatedAt: new Date() };
      mockBrandRepo.findOne.mockResolvedValue(brand);
      mockProductRepo.count.mockResolvedValue(12);

      const result = await service.findBySlug('auratech');

      expect(result.slug).toBe('auratech');
      expect(result.productCount).toBe(12);
    });

    it('throws NotFoundException for nonexistent brand slug', async () => {
      mockBrandRepo.findOne.mockResolvedValue(null);

      await expect(service.findBySlug('nonexistent-brand')).rejects.toThrow(NotFoundException);
      await expect(service.findBySlug('nonexistent-brand')).rejects.toMatchObject({
        response: { code: 'BRAND_NOT_FOUND' },
      });
    });

    it('throws NotFoundException for inactive brand (public access)', async () => {
      const inactiveBrand = { id: 'b1', name: 'Old Brand', slug: 'old-brand', isActive: false, logoUrl: null, description: null, createdAt: new Date(), updatedAt: new Date() };
      mockBrandRepo.findOne.mockResolvedValue(inactiveBrand);

      await expect(service.findBySlug('old-brand')).rejects.toThrow(NotFoundException);
      await expect(service.findBySlug('old-brand')).rejects.toMatchObject({
        response: { code: 'BRAND_INACTIVE' },
      });
    });

    it('allows inactive brand when allowInactive=true (admin path)', async () => {
      const inactiveBrand = { id: 'b1', name: 'Old Brand', slug: 'old-brand', isActive: false, logoUrl: null, description: null, createdAt: new Date(), updatedAt: new Date() };
      mockBrandRepo.findOne.mockResolvedValue(inactiveBrand);
      mockProductRepo.count.mockResolvedValue(0);

      const result = await service.findBySlug('old-brand', true);
      expect(result.slug).toBe('old-brand');
      expect(result.isActive).toBe(false);
    });
  });

  // ─── validateBrandId ──────────────────────────────────────────────────────

  describe('validateBrandId()', () => {
    it('passes silently when brandId is null (product without brand)', async () => {
      await expect(service.validateBrandId(null)).resolves.toBeUndefined();
      await expect(service.validateBrandId(undefined)).resolves.toBeUndefined();
      expect(mockBrandRepo.findOne).not.toHaveBeenCalled();
    });

    it('passes silently when brandId belongs to an active brand', async () => {
      mockBrandRepo.findOne.mockResolvedValue({ id: 'b1', isActive: true });

      await expect(service.validateBrandId('b1')).resolves.toBeUndefined();
    });

    it('throws BadRequestException for a nonexistent brandId', async () => {
      mockBrandRepo.findOne.mockResolvedValue(null);

      await expect(service.validateBrandId('nonexistent-id')).rejects.toThrow(BadRequestException);
      await expect(service.validateBrandId('nonexistent-id')).rejects.toMatchObject({
        response: { code: 'INVALID_BRAND_ID' },
      });
    });

    it('throws BadRequestException when brandId belongs to an inactive brand', async () => {
      mockBrandRepo.findOne.mockResolvedValue({ id: 'b1', isActive: false });

      await expect(service.validateBrandId('b1')).rejects.toThrow(BadRequestException);
      await expect(service.validateBrandId('b1')).rejects.toMatchObject({
        response: { code: 'BRAND_INACTIVE' },
      });
    });
  });

  // ─── create ───────────────────────────────────────────────────────────────

  describe('create()', () => {
    it('creates a brand with required fields', async () => {
      mockBrandRepo.findOne.mockResolvedValue(null); // no slug conflict
      mockProductRepo.count.mockResolvedValue(0);

      const result = await service.create({
        name: 'AuraTech',
        slug: 'auratech',
        logoUrl: 'https://example.com/logo.png',
        description: 'Premium tech brand',
      });

      expect(mockBrandRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'AuraTech', slug: 'auratech', isActive: true }),
      );
      expect(mockBrandRepo.save).toHaveBeenCalled();
    });

    it('throws BadRequestException when name or slug is missing', async () => {
      await expect(service.create({ name: '', slug: 'auratech' })).rejects.toThrow(BadRequestException);
      await expect(service.create({ name: 'AuraTech', slug: '' })).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException for invalid slug format (uppercase, spaces)', async () => {
      await expect(service.create({ name: 'AuraTech', slug: 'Aura Tech!' })).rejects.toThrow(BadRequestException);
      await expect(service.create({ name: 'AuraTech', slug: 'Aura_Tech' })).rejects.toThrow(BadRequestException);
    });

    it('throws ConflictException when slug already exists', async () => {
      mockBrandRepo.findOne.mockResolvedValue({ id: 'existing', slug: 'auratech' });

      await expect(service.create({ name: 'AuraTech', slug: 'auratech' })).rejects.toThrow(ConflictException);
      await expect(service.create({ name: 'AuraTech', slug: 'auratech' })).rejects.toMatchObject({
        response: { code: 'BRAND_SLUG_CONFLICT' },
      });
    });
  });

  // ─── update ───────────────────────────────────────────────────────────────

  describe('update()', () => {
    it('updates brand fields and returns updated DTO', async () => {
      const existingBrand = { id: 'b1', name: 'Old Name', slug: 'old-name', isActive: true, logoUrl: null, description: null, createdAt: new Date(), updatedAt: new Date() };
      mockBrandRepo.findOne.mockResolvedValue(existingBrand);
      mockProductRepo.count.mockResolvedValue(3);

      const result = await service.update('old-name', { name: 'New Name', isActive: false });

      expect(mockBrandRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'New Name', isActive: false }),
      );
    });

    it('throws NotFoundException for unknown brand slug on update', async () => {
      mockBrandRepo.findOne.mockResolvedValue(null);

      await expect(service.update('ghost', { name: 'Ghost Brand' })).rejects.toThrow(NotFoundException);
    });
  });

  // ─── deactivate ───────────────────────────────────────────────────────────

  describe('deactivate()', () => {
    it('sets isActive=false on the brand (soft delete)', async () => {
      const brand = { id: 'b1', name: 'AuraTech', slug: 'auratech', isActive: true, logoUrl: null, description: null, createdAt: new Date(), updatedAt: new Date() };
      mockBrandRepo.findOne.mockResolvedValue(brand);

      const result = await service.deactivate('auratech');

      expect(mockBrandRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: false }),
      );
      expect(result.message).toContain('deactivated');
    });

    it('throws NotFoundException when deactivating a nonexistent brand', async () => {
      mockBrandRepo.findOne.mockResolvedValue(null);

      await expect(service.deactivate('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
