import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentEntity } from '../../common/data-store/data-store.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Get('classes')
  getClasses() {
    return this.service.getClasses();
  }

  @Get()
  findAll(
    @Query('className') className?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('schoolLevel') schoolLevel?: string,
  ) {
    return this.service.findAll({ className, status, search, schoolLevel });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() dto: Partial<StudentEntity>) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<StudentEntity>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
