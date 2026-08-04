import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { FlashSale, Banner } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([FlashSale, Banner])],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
