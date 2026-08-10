import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductReview, Order } from '../database/entities';
import {
  RecommendationService,
  PersonalizationService,
  RuleBasedRecommendationProvider,
} from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductReview, Order])],
  providers: [
    RecommendationService,
    PersonalizationService,
    RuleBasedRecommendationProvider,
  ],
  controllers: [RecommendationsController],
  exports: [RecommendationService, PersonalizationService],
})
export class RecommendationsModule {}
