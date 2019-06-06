import { Controller, Get, Post, Body, HttpStatus, UseGuards, Param, UsePipes, Delete, Req, Put } from '@nestjs/common';
import { ContentService } from 'src/share/services/content.services';
import { async } from 'rxjs/internal/scheduler/async';
import { CreateContentDto } from './dto/create-content.dto';
import { AuthGuard } from '@nestjs/passport';
import { ContentBusiness } from './business/content-business';
import { WRONG_TYPE_VACATION, CREATE_CONTENT_SUCCESS, DELETE_CONTENT_SUCCESS, DELETE_CONTENT_FAIL, REACTING_SUCCESS, REACTING_WRONG_TYPE } from './../../share/constant/message';
import { ViewUserContentDto } from './dto/view-user-content.dto';
import { ViewContentDto } from './dto/view-content.dto';
import { ValidationPipe } from './../../share/pipe/validation.pipe';
import { Request } from 'express';
import { AccountService } from 'src/share/services/account.services';
import { UserService } from 'src/share/services/user.services';
import { ReactionContentDto } from './dto/reaction-content.dto';
import { REACTION_TYPE } from 'src/share/constant/value';
@Controller('contents')
export class ContentsController {
    constructor(
        private readonly content: ContentService,
        private readonly contentBusiness: ContentBusiness,
        private readonly accountSvc: AccountService,
        private readonly userSvc: UserService
    ) { }

    async getDataUserFromContent() {
        let data = [];
        let dataContents: any = await this.content.retrieveAllContents();
        for (let i = 0; i < dataContents.length; i++) {
            let dataElementContents = {
                id: dataContents[i]._id,
                location: dataContents[i].location,
                reaction: dataContents[i].reaction,
                tag: dataContents[i].tag,
                comments: dataContents[i].comments,
                travel: dataContents[i].travel,
                hotel: dataContents[i].hotel,
                images: dataContents[i].images,
                username: dataContents[i].username,
                content: dataContents[i].content,
                rate: dataContents[i].rate,
                type: dataContents[i].type,
                range: dataContents[i].range,
                total_price: dataContents[i].total_price,
                metadata: dataContents[i].metadata,
                createAt: dataContents[i].createAt,
                user_data: {},
                reaction_state:{
                    like: false,
                    love: false
                }
            };
            let dataUser: any = await this.userSvc.retrieveUserDetail(dataContents[i].username);
            dataElementContents.user_data = {
                username: dataUser.username,
                name: dataUser.first_name + ' ' + dataUser.last_name,
                avatar: dataUser.avatar
            };
            data.push(dataElementContents);
        }
        return data;
    }

    @Put('/reaction')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('bearer'))
    async reactingContent(
        @Body() reactionDto: ReactionContentDto
    ) {
        try {
            let ReactionType = [
                ...REACTION_TYPE
            ];
            let index = ReactionType.findIndex(o => o.name === reactionDto.type);
            if(index === -1) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: REACTING_WRONG_TYPE
                }
            }
            let datauser = await this.userSvc.retrieveUserDetail(reactionDto.username);
            let data = await this.content.updateReaction(reactionDto , datauser);
            return {
                status: HttpStatus.OK,
                message: REACTING_SUCCESS,
                data: data
            }
        } catch (error) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: error
            }
        }
    }


    @Get('')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('bearer'))
    async retrieveAllContent() {
        try {
            let data = await this.getDataUserFromContent();
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

    @Get('/filter')
    @UseGuards(AuthGuard('bearer'))
    async retrieveContentsByCity(
        @Req() req: Request
    ) {
        try {
            let filter = req.query;
            let data = await this.getDataUserFromContent();
            if(filter.city) {
                if(filter.city !== 'all') {
                    data = data.filter((element) =>{
                        return element.location.name === filter.city
                    })
                }
            }
            if(filter.location) {
                if(filter.location !== 'all') {
                    data = data.filter((element) =>{
                        let index = element.location.checkin.findIndex(o => o.name === filter.location);
                        return index !== -1;
                    })
                }
            }
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