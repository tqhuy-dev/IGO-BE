import { Controller, Get, Post, Body, HttpStatus, UseGuards } from '@nestjs/common';
import { ContentService } from 'src/share/services/content.services';
import { async } from 'rxjs/internal/scheduler/async';
import { CreateContentDto } from './dto/create-content.dto';
import { AuthGuard } from '@nestjs/passport';
import { ContentBusiness } from './business/content-business';
import { WRONG_TYPE_VACATION } from './../../share/constant/message';

@Controller('contents')
export class ContentsController {
    constructor(
        private readonly content: ContentService,
        private readonly contentBusiness: ContentBusiness
    ){}

    @Get('')
    async getContents() {
        return 'contents api is working';
    }

    @Post('')
    @UseGuards(AuthGuard('bearer'))
    async createContent(@Body() createContentDto: CreateContentDto) {
        try {
            if(!this.contentBusiness.checkTypeVacation(createContentDto.type)) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: WRONG_TYPE_VACATION
                }
            }
            let data  = await this.content.createServices(createContentDto);
            return {
                status: HttpStatus.OK,
                data: data
            }
        } catch (error) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: error
            }
        }
    }
}