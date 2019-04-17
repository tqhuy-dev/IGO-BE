import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from 'src/controller/user/dto/login.dto';
import { User } from '../../controller/user/interface/user.interface';
import { UserCreateDto } from 'src/controller/user/dto/user-create.dto';
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
                token: '',
                first_name: newUserDTO.first_name,
                last_name: newUserDTO.last_name,
                phone: newUserDTO.phone,
                birthday: newUserDTO.birthday,
                follow: 0
            })

            resolve(newUser.save())
        })
    }

    checkUser(loginDto: LoginDto) {
        return new Promise((resolve, reject) =>{
            this.userModel.findOne({
                username: loginDto.username,
                password: loginDto.password
            } , (error , result) =>{
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
}