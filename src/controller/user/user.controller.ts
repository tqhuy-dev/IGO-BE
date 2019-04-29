import { Controller, Get, Post, HttpStatus, UsePipes, Body, UseGuards, Param, Req } from '@nestjs/common';
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

    @Get('/:username')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('bearer'))
    async retrieveUserDetail(@Param() param: UserDetailDto) {
        try {
            let userInformation = await this.userSvc.retrieveUserDetail(param.username);
            let contents = await this.contentSvc.retrieveUserContents(param.username);
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
            let data: any = await this.contentSvc.retrieveUserContents(username.username);
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

    @Get('/contents')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('bearer'))
    async listContents(
    ) {
        try {
            let data = await this.contentSvc.retrieveAllContents();
            return {
                status: HttpStatus.OK,
                data: data
            };
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