import { Controller, Post, Body, HttpCode, HttpStatus, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryService, DeliveryPromiseResult } from './delivery.service';
import { ServiceabilityQueryDto } from './dto/serviceability-query.dto';
import { Public } from '../auth/guards';
import { Address } from '../database/entities';

@Controller('delivery')
export class DeliveryController {
  constructor(
    private readonly deliveryService: DeliveryService,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  @Public()
  @Post('serviceability')
  @HttpCode(HttpStatus.OK)
  async evaluateServiceability(
    @Request() req: any,
    @Body() dto: ServiceabilityQueryDto,
  ): Promise<{ success: boolean; data: DeliveryPromiseResult }> {
    // Address ID IDOR Security Check
    if (dto.addressId) {
      const address = await this.addressRepository.findOne({ where: { id: dto.addressId } });
      if (!address) {
        throw new NotFoundException(`Address ${dto.addressId} not found`);
      }
      // If user is authenticated, enforce ownership
      if (req.user?.userId && address.userId !== req.user.userId) {
        throw new ForbiddenException('Unauthorized access to address entity');
      }
      // Populate DTO fields from verified address
      if (address.pincode && !dto.pincode) dto.pincode = address.pincode;
      if (address.lat != null && dto.latitude == null) dto.latitude = address.lat;
      if (address.lng != null && dto.longitude == null) dto.longitude = address.lng;
    }

    const result = await this.deliveryService.evaluateServiceability(dto);
    return {
      success: true,
      data: result,
    };
  }
}

