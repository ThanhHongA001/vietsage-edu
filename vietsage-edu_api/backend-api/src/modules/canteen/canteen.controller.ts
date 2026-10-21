import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CanteenService } from './canteen.service';
import { CanteenMealEntity } from '../../common/data-store/data-store.service';

@Controller('canteen')
export class CanteenController {
  constructor(private readonly service: CanteenService) {}

  @Get('menu')
  getMenu() {
    return this.service.getWeeklyMenu();
  }

  @Get('today')
  getToday() {
    return this.service.getTodayMeal();
  }

  @Patch('menu/:id')
  updateMeal(@Param('id') id: string, @Body() dto: Partial<CanteenMealEntity>) {
    return this.service.updateMeal(id, dto);
  }

  @Post('register')
  registerMeal(
    @Body()
    dto: {
      studentId?: string;
      studentName?: string;
      dayId: string;
      date?: string;
      selectedItems: any[];
    },
  ) {
    return this.service.registerMeal(dto);
  }

  @Get('registrations')
  getRegistrations(@Query('studentId') studentId?: string) {
    return this.service.getRegistrations(studentId);
  }
}
