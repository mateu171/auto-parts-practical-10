import { Body, Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ParseVinPipe } from '../common/pipes/parse-vin.pipe';
import { PartFoundDto } from '../dto/part-found.dto';
import { Role } from '../users/enums/role.enum';
import { NotificationsService } from './notifications.service';

@Controller('requests')
export class PartRequestsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /** Менеджер (ADMIN/MECHANIC) повідомляє, що для запиту за VIN підібрано запчастину. */
  @Roles(Role.ADMIN, Role.MECHANIC)
  @Post(':vinCode/part-found')
  @HttpCode(HttpStatus.OK)
  partFound(
    @Param('vinCode', ParseVinPipe) vinCode: string,
    @Body() dto: PartFoundDto,
    @CurrentUser('email') managerEmail: string,
  ) {
    return this.notificationsService.notifyPartFound(vinCode, dto, managerEmail);
  }
}
