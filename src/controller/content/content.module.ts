import { Module } from '@nestjs/common';
import { ContentsController } from './content.controller';

@Module({
    controllers: [
        ContentsController
    ],
    providers: [],
})
export class ContentsModule {};