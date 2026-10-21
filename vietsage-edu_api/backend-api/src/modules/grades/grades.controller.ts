import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GradesService } from './grades.service';
import { GradeEntity } from '../../common/data-store/data-store.service';

@Controller('grades')
export class GradesController {
  constructor(private readonly service: GradesService) {}

  @Get()
  findAll(
    @Query('className') className?: string,
    @Query('subject') subject?: string,
    @Query('semester') semester?: string,
  ) {
    return this.service.findAll({ className, subject, semester });
  }

  @Get('student/:studentId')
  findByStudentId(
    @Param('studentId') studentId: string,
    @Query('semester') semester?: string,
  ) {
    return this.service.findByStudentId(studentId, semester);
  }

  @Post()
  saveGrades(@Body() body: { grades: GradeEntity[] } | GradeEntity[]) {
    const list = Array.isArray(body) ? body : body.grades;
    return this.service.saveGrades(list);
  }
}
