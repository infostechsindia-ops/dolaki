import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import {
  Product,
  ProductVariant,
  Brand,
  Category,
  AttributeKey,
  AttributeValue,
  ProductVariantAttribute,
  ProductImage,
  VariantImage,
  SellerListing,
  Inventory,
  Vendor,
  ProductReview,
  AuditLog,
  Order,
  OrderItem,
} from '../database/entities';

describe('ProductsService — CMD-037 Reviews Domain', () => {
  let service: ProductsService;

  const mockRepo = () => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn((dto) => dto),
    save: jest.fn((entity) => Promise.resolve({ id: 'mock-id', ...entity })),
  });

  const mockProductRepo = mockRepo();
  const mockReviewRepo = mockRepo();
  const mockOrderRepo = mockRepo();
  const mockOrderItemRepo = mockRepo();

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: mockProductRepo },
        { provide: getRepositoryToken(ProductVariant), useValue: mockRepo() },
        { provide: getRepositoryToken(Brand), useValue: mockRepo() },
        { provide: getRepositoryToken(Category), useValue: mockRepo() },
        { provide: getRepositoryToken(AttributeKey), useValue: mockRepo() },
        { provide: getRepositoryToken(AttributeValue), useValue: mockRepo() },
        { provide: getRepositoryToken(ProductVariantAttribute), useValue: mockRepo() },
        { provide: getRepositoryToken(ProductImage), useValue: mockRepo() },
        { provide: getRepositoryToken(VariantImage), useValue: mockRepo() },
        { provide: getRepositoryToken(SellerListing), useValue: mockRepo() },
        { provide: getRepositoryToken(Inventory), useValue: mockRepo() },
        { provide: getRepositoryToken(Vendor), useValue: mockRepo() },
        { provide: getRepositoryToken(ProductReview), useValue: mockReviewRepo },
        { provide: getRepositoryToken(AuditLog), useValue: mockRepo() },
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
        { provide: getRepositoryToken(OrderItem), useValue: mockOrderItemRepo },
        { provide: (require('../audit/audit.service').AuditService), useValue: { log: jest.fn() } },
        { provide: (require('../brands/brands.service').BrandsService), useValue: { validateBrandId: jest.fn().mockResolvedValue(undefined) } },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('Rating Aggregation & Summary', () => {
    it('calculates average rating and distribution breakdown correctly from approved reviews', async () => {
      mockReviewRepo.find.mockResolvedValue([
        { rating: 5, isApproved: true },
        { rating: 5, isApproved: true },
        { rating: 4, isApproved: true },
        { rating: 2, isApproved: true },
      ]);

      const summary = await service.getRatingSummary('prod-1');

      expect(summary.totalReviews).toBe(4);
      expect(summary.averageRating).toBe(4.0); // (5+5+4+2)/4 = 16/4 = 4.0
      expect(summary.distribution).toEqual([
        { stars: 5, count: 2, percentage: 50 },
        { stars: 4, count: 1, percentage: 25 },
        { stars: 3, count: 0, percentage: 0 },
        { stars: 2, count: 1, percentage: 25 },
        { stars: 1, count: 0, percentage: 0 },
      ]);
    });
  });

  describe('Verified Purchase Detection', () => {
    it('sets isVerifiedPurchase to true when customer has a DELIVERED order for the product', async () => {
      mockProductRepo.findOne.mockResolvedValue({ id: 'prod-1', rating: 0, reviewCount: 0 });
      mockOrderRepo.find.mockResolvedValue([{ id: 'order-1', customerId: 'cust-1', status: 'DELIVERED' }]);
      mockOrderItemRepo.findOne.mockResolvedValue({ id: 'item-1', orderId: 'order-1', productId: 'prod-1' });
      mockReviewRepo.find.mockResolvedValue([{ rating: 5, isApproved: true }]);

      const review = await service.addReview('prod-1', 'cust-1', 'Jane Doe', {
        rating: 5,
        title: 'Great product!',
        comment: 'High quality item.',
      });

      expect(review.isVerifiedPurchase).toBe(true);
      expect(review.rating).toBe(5);
    });

    it('sets isVerifiedPurchase to false when customer has no order for the product', async () => {
      mockProductRepo.findOne.mockResolvedValue({ id: 'prod-1', rating: 0, reviewCount: 0 });
      mockOrderRepo.find.mockResolvedValue([]);
      mockReviewRepo.find.mockResolvedValue([{ rating: 4, isApproved: true }]);

      const review = await service.addReview('prod-1', 'cust-2', 'John Smith', {
        rating: 4,
        comment: 'Decent product.',
      });

      expect(review.isVerifiedPurchase).toBe(false);
    });
  });

  describe('Helpful Voting & Reporting & Vendor Response', () => {
    it('increments helpfulCount upon voteHelpful', async () => {
      mockReviewRepo.findOne.mockResolvedValue({ id: 'rev-1', helpfulCount: 3 });

      await service.voteHelpful('rev-1');

      expect(mockReviewRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'rev-1', helpfulCount: 4 }),
      );
    });

    it('flags review when reportCount reaches 3 or more', async () => {
      mockReviewRepo.findOne.mockResolvedValue({ id: 'rev-1', reportCount: 2, status: 'APPROVED' });

      await service.reportReview('rev-1', 'Inappropriate language');

      expect(mockReviewRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'rev-1', reportCount: 3, status: 'FLAGGED' }),
      );
    });

    it('records vendor response on review', async () => {
      mockReviewRepo.findOne.mockResolvedValue({ id: 'rev-1' });

      await service.addVendorResponse('rev-1', 'vendor-1', 'Thank you for your feedback!');

      expect(mockReviewRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'rev-1',
          vendorId: 'vendor-1',
          vendorResponseText: 'Thank you for your feedback!',
        }),
      );
    });
  });
});
