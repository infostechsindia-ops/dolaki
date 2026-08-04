import { Controller, Post, Body, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.authService.register({
      email: body.email,
      pass: body.password,
      fullName: body.fullName,
      phone: body.phone,
    });
  }

  @Post('register-vendor')
  async registerVendor(@Body() body: any) {
    return this.authService.registerVendor({
      email: body.email,
      pass: body.password,
      fullName: body.fullName,
      phone: body.phone,
    });
  }

  @Post('send-otp')
  async sendOtp(@Body('phone') phone: string) {
    return this.authService.sendOtp(phone);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: any) {
    return this.authService.verifyOtp(body.phone, body.otp);
  }

  @Post('refresh')
  async refreshToken(@Body('token') token: string) {
    return this.authService.refreshToken(token);
  }
}
