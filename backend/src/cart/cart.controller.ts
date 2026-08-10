import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService, CartResponseDto } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto, MergeGuestCartDto } from './dto/cart-mutation.dto';
import { UpdateSubstitutionDto } from './dto/update-substitution.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';

@Controller('api/v1/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @Roles(Role.CUSTOMER)
  async getCart(@Req() req: any): Promise<CartResponseDto> {
    const customerId = req.user.userId;
    return this.cartService.getCart(customerId);
  }

  @Post('items')
  @Roles(Role.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  async addItem(
    @Req() req: any,
    @Body() dto: AddCartItemDto
  ): Promise<CartResponseDto> {
    const customerId = req.user.userId;
    return this.cartService.addItem(customerId, dto);
  }

  @Patch('items/:id')
  @Roles(Role.CUSTOMER)
  async updateItem(
    @Req() req: any,
    @Param('id') itemId: string,
    @Body() dto: UpdateCartItemDto
  ): Promise<CartResponseDto> {
    const customerId = req.user.userId;
    return this.cartService.updateItem(customerId, itemId, dto.quantity);
  }

  @Patch('items/:id/substitution')
  @Roles(Role.CUSTOMER)
  async updateSubstitution(
    @Req() req: any,
    @Param('id') itemId: string,
    @Body() dto: UpdateSubstitutionDto
  ): Promise<CartResponseDto> {
    const customerId = req.user.userId;
    return this.cartService.updateSubstitution(customerId, itemId, dto.preference);
  }

  @Delete('items/:id')
  @Roles(Role.CUSTOMER)
  async removeItem(
    @Req() req: any,
    @Param('id') itemId: string
  ): Promise<CartResponseDto> {
    const customerId = req.user.userId;
    return this.cartService.removeItem(customerId, itemId);
  }

  @Delete()
  @Roles(Role.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  async clearCart(@Req() req: any): Promise<CartResponseDto> {
    const customerId = req.user.userId;
    return this.cartService.clearCart(customerId);
  }

  @Post('merge')
  @Roles(Role.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  async mergeGuestCart(
    @Req() req: any,
    @Body() dto: MergeGuestCartDto
  ): Promise<CartResponseDto> {
    const customerId = req.user.userId;
    return this.cartService.mergeGuestCart(customerId, dto);
  }
}
