import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category, Product, CategoryAttributeKey } from '../database/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product, CategoryAttributeKey]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
