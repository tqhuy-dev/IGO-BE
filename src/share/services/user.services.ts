import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from 'src/controller/user/dto/login.dto';
import { User } from '../../controller/user/interface/user.interface';
import { UserCreateDto } from 'src/controller/user/dto/user-create.dto';
import * as jwt from 'jsonwebtoken';
import { SECRET_KEY } from './../constant/value';
import { EditUserDto } from 'src/controller/user/dto/edit-user.dto';
import { async } from 'rxjs/internal/scheduler/async';
import { USERNAME_ALREADY_IN_LIST } from '../constant/message';
@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>
    ) {}

    retrieveUserDetail(id: string) {
        return new Promise((resolve , reject) =>{
            let projection = {
                password: false,
                active: false,
                _id: false
            };

            this.userModel.findOne({
                username: id
            } , projection , (error , result) =>{
                if(error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    addFriends(usernameFriend: string , username: string) {
        return new Promise( async (resolve , reject) =>{
            let listFriends = []
            await this.userModel.findOne({
                username: username
            } , (error , result) =>{
                if(error) {
                    reject(error);
                } else {
                    listFriends = result.friends;
                    let index = listFriends.findIndex(o => o.username === usernameFriend);
                    if(index >= 0) {
                        reject(USERNAME_ALREADY_IN_LIST);
                        return ;
                    }
                    listFriends.push({
                        username: usernameFriend,
                        createAt: new Date().getTime().toString()
                    });
                }
            })

            await this.userModel.findOneAndUpdate({
                username: username
            } , {
                $set:{
                    friends: listFriends
                }
            } , (error ,result) =>{
                if(error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }
    
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
                metadata: null,
                avatar: newUserDTO.avatar,
                friends:[]
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

    editUser(editUser : EditUserDto , username: string) {
        let bodyEdit: any = {};
        if(editUser.avatar !== '') {
            bodyEdit.avatar = editUser.avatar;
        }

        if(editUser.first_name !== '') {
            bodyEdit.first_name = editUser.first_name;
        }

        if(editUser.last_name !== '') {
            bodyEdit.last_name = editUser.last_name;
        }

        if(editUser.birthday !== '') {
            bodyEdit.birthday = editUser.birthday;
        }

        if(editUser.phone !== '') {
            bodyEdit.phone = editUser.phone
        }

        if(editUser.password !== '') {
            bodyEdit.password = editUser.password;
        }

        return new Promise((resolve , reject) =>{
            this.userModel.findOneAndUpdate({
                username: username
            }, {
                $set: bodyEdit
            } , (error ,result) =>{
                if(error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }
}