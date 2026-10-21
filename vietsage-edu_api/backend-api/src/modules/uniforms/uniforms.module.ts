import { Module } from '@nestjs/common';
import { UniformsService } from './uniforms.service';
import { UniformsController } from './uniforms.controller';

@Module({
  controllers: [UniformsController],
  providers: [UniformsService],
  exports: [UniformsService],
})
export class UniformsModule {}
