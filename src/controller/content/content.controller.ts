import { Controller, Get, Post, Body, HttpStatus, UseGuards, Param, UsePipes } from '@nestjs/common';
import { ContentService } from 'src/share/services/content.services';
import { async } from 'rxjs/internal/scheduler/async';
import { CreateContentDto } from './dto/create-content.dto';
import { AuthGuard } from '@nestjs/passport';
import { ContentBusiness } from './business/content-business';
import { WRONG_TYPE_VACATION, CREATE_CONTENT_SUCCESS } from './../../share/constant/message';
import { ViewUserContentDto } from './dto/view-user-content.dto';
import { ViewContentDto } from './dto/view-content.dto';
import { ValidationPipe } from './../../share/pipe/validation.pipe';

@Controller('contents')
export class ContentsController {
    constructor(
        private readonly content: ContentService,
        private readonly contentBusiness: ContentBusiness
    ){}

    @Get('/:contentID')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('bearer'))
    async getContent(@Param() param: ViewContentDto) {
        try {
            let data = await this.content.retrieveContentDetail(param.contentID);
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

    @Post('')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('bearer'))
    async createContent(@Body() createContentDto: CreateContentDto) {
        try {
            if(!this.contentBusiness.checkTypeVacation(createContentDto.type)) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: WRONG_TYPE_VACATION
                }
            }
            let data  = await this.content.createContent(createContentDto);
            return {
                status: HttpStatus.OK,
                data: data,
                message: CREATE_CONTENT_SUCCESS
            }
        } catch (error) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: error
            }
        }
    }
}