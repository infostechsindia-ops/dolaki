import { Controller, Get, Post, Param, Request, Body } from '@nestjs/common';
import { RecommendationService } from './recommendations.service';
import { Public } from '../auth/guards';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Public()
  @Get('home')
  getHomeRecommendations(@Request() req: any) {
    return this.recommendationService.getHomeRecommendations(req.user?.userId);
  }

  @Public()
  @Get('product/:id')
  getProductRecommendations(@Param('id') id: string) {
    return this.recommendationService.getProductRecommendations(id);
  }

  @Public()
  @Get('cart')
  getCartRecommendations(@Request() req: any) {
    return this.recommendationService.getCartRecommendations(req.user?.userId);
  }

  @Public()
  @Get('account')
  getAccountInsights(@Request() req: any) {
    return this.recommendationService.getAccountInsights(req.user?.userId);
  }

  @Public()
  @Post('track')
  trackEvent(@Request() req: any, @Body() body: any) {
    return this.recommendationService.trackEvent(req.user?.userId, body);
  }
}
