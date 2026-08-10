import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SduiController } from './sdui.controller';
import { SduiService } from './sdui.service';
import { CmsAssetsController } from './cms-assets.controller';
import { CmsAssetsService } from './cms-assets.service';
import { CmsMediaAsset, Banner } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([CmsMediaAsset, Banner])],
  controllers: [SduiController, CmsAssetsController],
  providers: [SduiService, CmsAssetsService],
  exports: [SduiService, CmsAssetsService],
})
export class SduiModule {}
