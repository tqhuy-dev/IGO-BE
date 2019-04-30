import { Controller, Get, Post, HttpStatus, UsePipes, Body, UseGuards, Param, Req, Put } from '@nestjs/common';
import { UserService } from 'src/share/services/user.services';
import { ValidationPipe } from '../../share/pipe/validation.pipe';
import { UserCreateDto } from './dto/user-create.dto';
import { AuthGuard } from '@nestjs/passport';
import { async } from 'rxjs/internal/scheduler/async';
import { LoginDto } from './dto/login.dto';
import { NOT_FOUND_ACCOUNT, ACCOUNT_EXIST } from './../../share/constant/message';
import { AccountService } from 'src/share/services/account.services';
import { ContentService } from 'src/share/services/content.services';
import { ViewUserContentDto } from '../content/dto/view-user-content.dto';
import { Request } from 'express';
import { UserDetailDto } from './dto/user-detail.dto';

@Controller('users')
export class UserController {
    constructor(
        private readonly userSvc: UserService,
        private readonly accountSvc: AccountService,
        private readonly contentSvc: ContentService
    ) { }

    async getDataUserFromContent(username: string) {
        let data = [];
        let dataContents: any = await this.contentSvc.retrieveUserContents(username);
        for (let i = 0 ; i < dataContents.length ; i ++) {
            let dataElementContents = {
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
                user_data: {}
            };
            let dataUser: any = await  this.userSvc.retrieveUserDetail(dataContents[i].username);
            dataElementContents.user_data = {
                username: dataUser.username,
                name: dataUser.first_name + ' ' + dataUser.last_name,
                avatar: dataUser.avatar
            };
            data.push(dataElementContents);
        }
        return data;
    }

    @Put('')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('bearer'))
    async editUser() {

    }

    @Get('/:username')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('bearer'))
    async retrieveUserDetail(@Param() param: UserDetailDto) {
        try {
            let userInformation = await this.userSvc.retrieveUserDetail(param.username);
            let contents = await this.getDataUserFromContent(param.username);
            let data = {
                user: userInformation,
                contents: contents
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

    @Get('/:username/contents')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('bearer'))
    async listContentsUser(@Param() username: ViewUserContentDto) {
        try {
            let data = await this.getDataUserFromContent(username.username);
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
    async createUser(@Body() newUser: UserCreateDto) {
        try {
            let checkAccount = await this.userSvc.checkUser({
                username: newUser.username,
                password: newUser.password
            })

            if (checkAccount !== null) {
                return {
                    status: HttpStatus.CONFLICT,
                    message: ACCOUNT_EXIST
                }
            } else {
                let data = await this.userSvc.createUser(newUser);
                return {
                    status: HttpStatus.OK,
                    data: data
                }
            }
        } catch (error) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: error
            }
        }
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async login(@Body() login: LoginDto) {
        try {
            let data: any = await this.userSvc.checkUser(login);
            if (data !== null) {
                let token = await this.userSvc.createToken(data.username);
                this.accountSvc.verifyAccount(data.username, token);
                return {
                    status: HttpStatus.OK,
                    data: data,
                    access_token: token
                }
            } else {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: NOT_FOUND_ACCOUNT
                }
            }
        } catch (error) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: error
            }
        }
    }
}