import {
  Controller,
  Post,
  Get,
  Body,
  UnauthorizedException,
  HttpCode,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as express from 'express';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { JwtAuthGuard, Public } from './guards';
import { LoginDto, RegisterDto, SendOtpDto, VerifyOtpDto } from './dto/auth.dto';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshCookie(res: express.Response, token: string) {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: isProd, // environment-aware secure cookie
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // explicit 7 days lifetime
      path: '/api/auth',
    });
  }

  private clearRefreshCookie(res: express.Response) {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/api/auth',
    });
  }

  private getIpAndUserAgent(req: express.Request) {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip || '';
    const userAgent = req.headers['user-agent'] || '';
    return { ipAddress, userAgent };
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async login(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
    @Body() body: LoginDto,
  ) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const { ipAddress, userAgent } = this.getIpAndUserAgent(req);
    const result = await this.authService.login(user, ipAddress, userAgent);
    this.setRefreshCookie(res, result.refresh_token);
    return result;
  }

  @Public()
  @Post('register')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async register(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
    @Body() body: RegisterDto,
  ) {
    const { ipAddress, userAgent } = this.getIpAndUserAgent(req);
    const result = await this.authService.register(
      {
        email: body.email,
        pass: body.password,
        fullName: body.fullName,
        phone: body.phone,
      },
      ipAddress,
      userAgent,
    );
    this.setRefreshCookie(res, result.refresh_token);
    return result;
  }

  @Public()
  @Post('register-vendor')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async registerVendor(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
    @Body() body: RegisterDto,
  ) {
    const { ipAddress, userAgent } = this.getIpAndUserAgent(req);
    const result = await this.authService.registerVendor(
      {
        email: body.email,
        pass: body.password,
        fullName: body.fullName,
        phone: body.phone,
      },
      ipAddress,
      userAgent,
    );
    this.setRefreshCookie(res, result.refresh_token);
    return result;
  }

  @Public()
  @Post('send-otp')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async sendOtp(@Body() body: SendOtpDto) {
    return this.authService.sendOtp(body.phone);
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async verifyOtp(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
    @Body() body: VerifyOtpDto,
  ) {
    const { ipAddress, userAgent } = this.getIpAndUserAgent(req);
    const result = await this.authService.verifyOtp(
      body.phone,
      body.otp,
      ipAddress,
      userAgent,
    );
    this.setRefreshCookie(res, result.refresh_token);
    return result;
  }

  // Refresh token: @Public() because the caller has no valid access-token by definition.
  // The token itself is validated inside AuthService.refreshToken().
  @Public()
  @Post('refresh')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async refreshToken(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
    @Body('refresh_token') bodyRefreshToken?: string,
    @Body('token') bodyToken?: string,
  ) {
    // Read from HttpOnly cookie first, fall back to request body parameters
    const incomingToken = req.cookies['refresh_token'] || bodyRefreshToken || bodyToken;
    if (!incomingToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const { ipAddress, userAgent } = this.getIpAndUserAgent(req);
    const result = await this.authService.refreshToken(
      incomingToken,
      ipAddress,
      userAgent,
    );

    // If new refresh token is issued (not in concurrency grace mode), update cookie
    if (result.refresh_token) {
      this.setRefreshCookie(res, result.refresh_token);
    }
    return result;
  }

  // Logout: @Public() — caller may have an expired access token but valid refresh cookie.
  // The refresh token is validated inside AuthService.logout().
  @Public()
  @Post('logout')
  @HttpCode(200)
  async logout(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
    @Body('refresh_token') bodyRefreshToken?: string,
    @Body('token') bodyToken?: string,
  ) {
    const incomingToken = req.cookies['refresh_token'] || bodyRefreshToken || bodyToken;
    if (incomingToken) {
      await this.authService.logout(incomingToken);
    }
    this.clearRefreshCookie(res);
    return { success: true };
  }

  @Post('logout-all')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async logoutAll(
    @Req() req: any,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const userId = req.user.userId;
    await this.authService.logoutAll(userId);
    this.clearRefreshCookie(res);
    return { success: true };
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getSessions(@Req() req: any) {
    const userId = req.user.userId;
    return this.authService.getSessions(userId);
  }

  @Post('profile')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req: any, @Body() body: any) {
    return this.authService.updateProfile(req.user.userId || req.user.sub, body);
  }

  @Post('security/password')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Req() req: any, @Body() body: any) {
    return this.authService.updatePassword(req.user.userId || req.user.sub, body);
  }
}
