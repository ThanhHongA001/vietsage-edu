import { Module } from '@nestjs/common';
import { Hn212Controller } from './hn212.controller';
import { Hn212AdapterService } from './hn212-adapter.service';
@Module({ controllers: [Hn212Controller], providers: [Hn212AdapterService] })
export class Hn212Module {}
