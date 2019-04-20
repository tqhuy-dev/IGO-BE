import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from 'src/controller/user/dto/login.dto';
import { User } from '../../controller/user/interface/user.interface';
import { UserCreateDto } from 'src/controller/user/dto/user-create.dto';
import * as jwt from 'jsonwebtoken';
import { SECRET_KEY } from './../constant/value';
@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>
    ) {}
    
    createUser(newUserDTO: UserCreateDto) {
        return new Promise((resolve , reject) =>{
            const newUser = new this.userModel({
                username: newUserDTO.username,
                password: newUserDTO.password,
                active: false,
                first_name: newUserDTO.first_name,
                last_name: newUserDTO.last_name,
                phone: newUserDTO.phone,
                birthday: newUserDTO.birthday,
                follow: 0,
                metadata: null
            })

            resolve(newUser.save())
        })
    }

    checkUser(loginDto: LoginDto) {
        return new Promise((resolve, reject) =>{
            let projection = {
                username: true,
                first_name: true,
                last_name:  true,
                phone: true,
                birthday: true,
                follow: true,
                _id: true
            }

            this.userModel.findOne({
                username: loginDto.username,
                password: loginDto.password
            } , projection , (error , result) =>{
                if(error) {
                    reject(error)
                } else {
                    resolve(result);
                }
            })
        })
    }

    viewAllUser() {
        return new Promise((resolve , reject) =>{
            this.userModel.find({} , (error , result) =>{
                if(error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    createToken(username) {
        const accessToken = jwt.sign({
            username: username,
            datetime: new Date(),
            random: Math.random()
        } , SECRET_KEY);

        return accessToken;
    }
}