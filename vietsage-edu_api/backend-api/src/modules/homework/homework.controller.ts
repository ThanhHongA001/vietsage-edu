import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkEntity } from '../../common/data-store/data-store.service';

@Controller('homework')
export class HomeworkController {
  constructor(private readonly service: HomeworkService) {}

  @Get()
  findAll(
    @Query('className') className?: string,
    @Query('subject') subject?: string,
    @Query('teacherId') teacherId?: string,
    @Query('studentId') studentId?: string,
  ) {
    return this.service.findAll({ className, subject, teacherId, studentId });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() dto: Partial<HomeworkEntity>) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<HomeworkEntity>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/submit')
  submit(
    @Param('id') id: string,
    @Body()
    dto: {
      studentId?: string;
      studentName?: string;
      studentCode?: string;
      content?: string;
      fileUrls?: string[];
    },
  ) {
    return this.service.submit(id, dto);
  }

  @Patch(':id/submissions/:submissionId/grade')
  grade(
    @Param('id') id: string,
    @Param('submissionId') submissionId: string,
    @Body() body: { score: number; feedback?: string },
  ) {
    return this.service.gradeSubmission(id, submissionId, body);
  }
}
