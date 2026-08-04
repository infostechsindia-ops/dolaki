import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SduiService } from './sdui.service';

@Controller('sdui')
export class SduiController {
  constructor(private readonly sduiService: SduiService) {}

  @Get('homepage')
  getHomepage() {
    return this.sduiService.getHomepageLayout();
  }

  @Post('homepage')
  saveHomepage(@Body() config: any) {
    return this.sduiService.saveHomepageLayout(config);
  }

  @Get('flado')
  getFlado() {
    return this.sduiService.getFladoLayout();
  }

  @Post('flado')
  saveFlado(@Body() config: any) {
    return this.sduiService.saveFladoLayout(config);
  }

  @Get('category/:slug')
  getCategory(@Param('slug') slug: string) {
    return this.sduiService.getCategoryLayout(slug);
  }
}
