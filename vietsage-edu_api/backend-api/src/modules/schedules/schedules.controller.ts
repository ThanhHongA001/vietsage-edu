import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ScheduleEntity } from '../../common/data-store/data-store.service';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly service: SchedulesService) {}

  @Get()
  findAll(
    @Query('className') className?: string,
    @Query('teacherName') teacherName?: string,
    @Query('dayOfWeek') dayOfWeek?: number,
  ) {
    return this.service.findAll({ className, teacherName, dayOfWeek });
  }

  @Post()
  create(@Body() dto: Partial<ScheduleEntity>) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<ScheduleEntity>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
