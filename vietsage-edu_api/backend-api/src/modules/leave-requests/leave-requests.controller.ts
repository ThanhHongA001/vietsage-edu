import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { LeaveRequestsService } from './leave-requests.service';

@Controller('leave-requests')
export class LeaveRequestsController {
  constructor(private readonly service: LeaveRequestsService) {}

  @Get()
  findAll(
    @Query('className') className?: string,
    @Query('status') status?: string,
    @Query('studentId') studentId?: string,
  ) {
    return this.service.findAll({ className, status, studentId });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  create(
    @Body()
    dto: {
      studentId?: string;
      studentName?: string;
      className?: string;
      startDate: string;
      endDate: string;
      reason: string;
      phone: string;
    },
  ) {
    return this.service.create(dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'APPROVED' | 'REJECTED'; reviewNote?: string },
  ) {
    return this.service.updateStatus(id, body.status, body.reviewNote);
  }
}
