import { Controller, Get, Post, Body, HttpStatus, UseGuards, Param, UsePipes, Delete, Req } from '@nestjs/common';
import { ContentService } from 'src/share/services/content.services';
import { async } from 'rxjs/internal/scheduler/async';
import { CreateContentDto } from './dto/create-content.dto';
import { AuthGuard } from '@nestjs/passport';
import { ContentBusiness } from './business/content-business';
import { WRONG_TYPE_VACATION, CREATE_CONTENT_SUCCESS, DELETE_CONTENT_SUCCESS, DELETE_CONTENT_FAIL } from './../../share/constant/message';
import { ViewUserContentDto } from './dto/view-user-content.dto';
import { ViewContentDto } from './dto/view-content.dto';
import { ValidationPipe } from './../../share/pipe/validation.pipe';
import { Request } from 'express';
import { AccountService } from 'src/share/services/account.services';
@Controller('contents')
export class ContentsController {
    constructor(
        private readonly content: ContentService,
        private readonly contentBusiness: ContentBusiness,
        private readonly accountSvc: AccountService
    ) { }

    @Get('')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('bearer'))
    async retrieveAllContent() {
        try {
            let data = await this.content.retrieveAllContents();
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

    @Delete('/:contentID')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('bearer'))
    async deleteContent(
        @Req() req: Request,
        @Param() param: ViewContentDto
    ) {
        try {
            let token = req.headers.authorization.split(' ')[1];
            let data: any = await this.accountSvc.checkToken(token);
            let isExistContent = await this.content.checkContentOfUser(param.contentID, data.data.username)
            if (isExistContent) {
                await this.content.deleteContent(param.contentID);
            } else {
                return {
                    status: HttpStatus.OK,
                    message: DELETE_CONTENT_FAIL
                }
            }
            return {
                status: HttpStatus.OK,
                message: DELETE_CONTENT_SUCCESS
            }
        } catch (error) {
            return {
                status: HttpStatus.BAD_GATEWAY,
                message: error
            }
        }
    }

    @Post('')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('bearer'))
    async createContent(@Body() createContentDto: CreateContentDto) {
        try {
            if (!this.contentBusiness.checkTypeVacation(createContentDto.type)) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: WRONG_TYPE_VACATION
                }
            }
            let data = await this.content.createContent(createContentDto);
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