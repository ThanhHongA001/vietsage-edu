import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UniformsService } from './uniforms.service';
import { UniformItemEntity } from '../../common/data-store/data-store.service';

@Controller('uniforms')
export class UniformsController {
  constructor(private readonly service: UniformsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('gradeGroup') gradeGroup?: string,
  ) {
    return this.service.findAll({ category, gradeGroup });
  }

  @Get('orders')
  findAllOrders(
    @Query('studentName') studentName?: string,
    @Query('status') status?: string,
  ) {
    return this.service.findAllOrders({ studentName, status });
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  createItem(@Body() dto: Partial<UniformItemEntity>) {
    return this.service.createItem(dto);
  }

  @Patch(':id')
  updateItem(@Param('id') id: string, @Body() dto: Partial<UniformItemEntity>) {
    return this.service.updateItem(id, dto);
  }

  @Delete(':id')
  removeItem(@Param('id') id: string) {
    return this.service.removeItem(id);
  }

  @Post('orders')
  createOrder(
    @Body()
    dto: {
      items: any[];
      totalAmount: number;
      studentName?: string;
      studentClass?: string;
    },
  ) {
    return this.service.createOrder(dto);
  }

  @Patch('orders/:orderCode/status')
  updateOrderStatus(
    @Param('orderCode') orderCode: string,
    @Body() body: { status: string },
  ) {
    return this.service.updateOrderStatus(orderCode, body.status);
  }
}
