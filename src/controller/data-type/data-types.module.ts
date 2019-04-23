import { Module } from '@nestjs/common';
import { DataTypesController } from './data-type.controller';

@Module({
    controllers: [DataTypesController],
    providers: [],
})
export class DataTypesModule {};