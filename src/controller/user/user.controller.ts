import { Controller, Get, Post, HttpStatus, UsePipes, Body, UseGuards } from '@nestjs/common';
import { UserService } from 'src/share/services/user.services';
import { ValidationPipe } from '../../share/pipe/validation.pipe';
import { UserCreateDto } from './dto/user-create.dto';
import { AuthGuard } from '@nestjs/passport';
import { async } from 'rxjs/internal/scheduler/async';
import { LoginDto } from './dto/login.dto';
import { NOT_FOUND_ACCOUNT, ACCOUNT_EXIST } from './../../share/constant/message';

@Controller('users')
export class UserController {
    constructor(
        private readonly userSvc: UserService
    ) { }

    @Get('')
    async getUser() {
        try {
            let data: any = [];
            data = await this.userSvc.viewAllUser();
            if(data.length > 0) {
                return {
                    status: HttpStatus.OK,
                    data: data
                }
            } else {
                return {
                    status: HttpStatus.NOT_FOUND,
                    message: 'No data'
                }
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
            let data = await this.userSvc.checkUser(login);
            if (data !== null) {
                return {
                    status: HttpStatus.OK,
                    data: data
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