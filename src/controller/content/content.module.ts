import { Module } from '@nestjs/common';
import { ContentsController } from './content.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentSchema } from './schema/content.schema';
import { ContentService } from 'src/share/services/content.services';
import { ContentBusiness } from './business/content-business';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name : 'Content' , schema: ContentSchema}
        ])
    ],
    controllers: [
        ContentsController
    ],
    providers: [
        ContentService,
        ContentBusiness
    ],
})
export class ContentsModule {};