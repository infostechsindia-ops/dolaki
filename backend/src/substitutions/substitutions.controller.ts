import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubstitutionsService } from './substitutions.service';
import { ProposeSubstitutionDto } from './dto/substitution.dto';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles';

@Controller('api/v1/orders')
export class SubstitutionsController {
  constructor(private readonly substitutionsService: SubstitutionsService) {}

  /**
   * GET /api/v1/orders/:orderId/items/:orderItemId/substitutions
   * Strictly READ-ONLY candidate & status lookup.
   */
  @Get(':orderId/items/:orderItemId/substitutions')
  getCandidatesAndStatus(
    @Req() req: any,
    @Param('orderId') orderId: string,
    @Param('orderItemId') orderItemId: string,
  ) {
    const userId = req.user?.userId;
    return this.substitutionsService.getCandidatesAndStatus(orderId, orderItemId, userId);
  }

  /**
   * POST /api/v1/orders/:orderId/items/:orderItemId/substitutions/propose
   * Restricted to operational roles (OPERATIONS, MERCHANT_OWNER, RIDER, SUPER_ADMIN).
   */
  @Roles(
    Role.OPERATIONS,
    Role.MERCHANT_OWNER,
    Role.RIDER,
    Role.SUPER_ADMIN,
  )
  @Post(':orderId/items/:orderItemId/substitutions/propose')
  @HttpCode(HttpStatus.CREATED)
  proposeSubstitution(
    @Req() req: any,
    @Param('orderId') orderId: string,
    @Param('orderItemId') orderItemId: string,
    @Body() dto: ProposeSubstitutionDto,
  ) {
    const merchantUserId = req.user?.userId;
    return this.substitutionsService.proposeSubstitution(
      orderId,
      orderItemId,
      merchantUserId,
      dto,
    );
  }

  /**
   * POST /api/v1/orders/:orderId/items/:orderItemId/substitutions/:id/approve
   * Customer explicit approval endpoint (IDOR protected).
   */
  @Post(':orderId/items/:orderItemId/substitutions/:id/approve')
  @HttpCode(HttpStatus.OK)
  approveSubstitution(
    @Req() req: any,
    @Param('orderId') orderId: string,
    @Param('orderItemId') orderItemId: string,
    @Param('id') substitutionId: string,
  ) {
    const userId = req.user?.userId;
    return this.substitutionsService.approveSubstitution(
      userId,
      orderId,
      orderItemId,
      substitutionId,
    );
  }

  /**
   * POST /api/v1/orders/:orderId/items/:orderItemId/substitutions/:id/reject
   * Customer explicit rejection endpoint (IDOR protected).
   */
  @Post(':orderId/items/:orderItemId/substitutions/:id/reject')
  @HttpCode(HttpStatus.OK)
  rejectSubstitution(
    @Req() req: any,
    @Param('orderId') orderId: string,
    @Param('orderItemId') orderItemId: string,
    @Param('id') substitutionId: string,
  ) {
    const userId = req.user?.userId;
    return this.substitutionsService.rejectSubstitution(
      userId,
      orderId,
      orderItemId,
      substitutionId,
    );
  }
}
