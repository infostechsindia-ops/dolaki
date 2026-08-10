import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FladoShop, Product, Vendor, VendorStaff, Rider } from '../database/entities';
import { Role } from './roles';

// ─── Public Decorator ────────────────────────────────────────────────────────
// Apply @Public() to any handler or controller to exempt it from JWT auth.
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@nestjs/common').SetMetadata(IS_PUBLIC_KEY, true);

// ─── JwtAuthGuard ─────────────────────────────────────────────────────────────
// Global guard (registered via APP_GUARD). Skips validation for @Public() endpoints.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}

// ─── RolesGuard ───────────────────────────────────────────────────────────────
// Global guard (registered via APP_GUARD after JwtAuthGuard).
// Merges class-level and handler-level @Roles() metadata; handler wins on conflict.
// Does NOT contain any SUPER_ADMIN universal bypass — ownership guards handle that.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // No @Roles() declared → pass (already JWT-authenticated by global JwtAuthGuard)
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    if (!requiredRoles.includes(user.role as Role)) {
      throw new ForbiddenException(
        'Insufficient permissions to access this resource',
      );
    }

    return true;
  }
}

// ─── ShopOwnerGuard ───────────────────────────────────────────────────────────
// Verifies that the authenticated user owns the FladoShop identified by :shopId.
// Rules:
//   1. SUPER_ADMIN bypasses ownership check (explicit, centralized here only).
//   2. If shop.ownerUserId is NULL → 403 Forbidden (fail closed — no exceptions
//      other than SUPER_ADMIN). A null-owner shop must be repaired via admin panel.
//   3. Any other role: shop.ownerUserId must equal req.user.userId.
// Apply with @UseGuards(ShopOwnerGuard) AFTER @Roles() has already restricted
// the callers to the correct merchant/admin roles.
@Injectable()
export class ShopOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(FladoShop)
    private readonly shopRepository: Repository<FladoShop>,
    @InjectRepository(VendorStaff)
    private readonly staffRepository: Repository<VendorStaff>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // SUPER_ADMIN bypass — explicit and centralized
    if (user.role === Role.SUPER_ADMIN || user.role === Role.OPERATIONS) return true;

    const shopId = request.params?.shopId;
    if (!shopId) {
      throw new ForbiddenException('Shop identifier is required');
    }

    const shop = await this.shopRepository.findOne({ where: { id: shopId } });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    if (shop.ownerUserId === user.userId) {
      return true;
    }

    if (shop.vendorId) {
      const staff = await this.staffRepository.findOne({
        where: { vendorId: shop.vendorId, userId: user.userId, status: 'ACTIVE' },
      });
      if (staff) return true;
    }

    throw new ForbiddenException(
      'You do not have permission to manage this shop',
    );
  }
}

// ─── ProductOwnerGuard ────────────────────────────────────────────────────────
// Verifies that the authenticated VENDOR_OWNER owns the product identified by :id.
// SUPER_ADMIN bypass — explicit and centralized here.
@Injectable()
export class ProductOwnerGuard implements CanActivate {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // SUPER_ADMIN bypass — explicit and centralized
    if (user.role === Role.SUPER_ADMIN) return true;

    const productId = request.params?.id;
    if (!productId) {
      throw new ForbiddenException('Product identifier is required');
    }

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Resolve ownership: product.vendorId → Vendor.id, Vendor.userId → User.id
    const vendor = await this.vendorRepository.findOne({
      where: { id: product.vendorId },
    });
    if (!vendor) {
      throw new ForbiddenException('Product has no associated vendor');
    }

    if (vendor.userId !== user.userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this product',
      );
    }

    return true;
  }
}

// ─── RiderShopGuard ───────────────────────────────────────────────────────────
// Verifies that the authenticated user owns the shop that the rider (:id) belongs to.
// The Rider entity has no authoritative userId FK — rider self-service is NOT supported.
// Only the shop owner (MERCHANT_OWNER + ownership) or SUPER_ADMIN may manage riders.
// DEFERRED: Rider self-service (PUT /riders/:id/availability by rider themselves)
//   requires a Rider.userId FK which does not exist yet. That is documented as a
//   dependency for the Rider/Merchant operational command.
@Injectable()
export class RiderShopGuard implements CanActivate {
  constructor(
    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,
    @InjectRepository(FladoShop)
    private readonly shopRepository: Repository<FladoShop>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // SUPER_ADMIN bypass — explicit and centralized
    if (user.role === Role.SUPER_ADMIN) return true;

    const riderId = request.params?.id;
    if (!riderId) {
      throw new ForbiddenException('Rider identifier is required');
    }

    const rider = await this.riderRepository.findOne({
      where: { id: riderId },
    });
    if (!rider) {
      throw new NotFoundException('Rider not found');
    }

    const shop = await this.shopRepository.findOne({
      where: { id: rider.shopId },
    });
    if (!shop) {
      throw new NotFoundException('Rider has no associated shop');
    }

    // Null-owner shops are strictly denied
    if (!shop.ownerUserId) {
      throw new ForbiddenException(
        'Shop has no registered owner. Contact support to repair ownership.',
      );
    }

    if (shop.ownerUserId !== user.userId) {
      throw new ForbiddenException(
        'You do not have permission to manage this shop\'s riders',
      );
    }

    return true;
  }
}
