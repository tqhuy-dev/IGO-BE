import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content } from './../../controller/content/interface/content.interface';
import { CreateContentDto } from 'src/controller/content/dto/create-content.dto';
import { User } from 'src/controller/user/interface/user.interface';
import { async } from 'rxjs/internal/scheduler/async';

@Injectable()
export class ContentService {
    constructor(
        @InjectModel('Content') private readonly contentModel: Model<Content>,
        @InjectModel('User') private readonly userModel: Model<User>,
    ) {}

    retrieveContentDetail(idContent: string) {
        return new Promise((resolve , reject) =>{
            this.contentModel.findOne({
                _id: idContent
            } , (error , result) =>{
                if(error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    retrieveUserContents(username: string) {
        return new Promise((resolve , reject) =>{
            this.contentModel.find({
                username: username
            } , (error , result) =>{
                if(error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    retrieveAllContents() {
        return new Promise((resolve , reject) =>{
            this.contentModel.find({

            } , (error , result) =>{
                if(error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    createContent(createContentDto: CreateContentDto) {
        return new Promise(async (resolve , reject) =>{
            let dataCheckin = [];
            dataCheckin = createContentDto.location.checkin.map((element:any) =>{
                return {
                    name: element.name,
                    address: element.address,
                    rate: element.rate,
                    images: element.images,
                    comments: []
                }
            });
            let dataUser = await this.userModel.findOne({
                username: createContentDto.username
            })
            const newContent = new this.contentModel({
                user_data: {
                    username:createContentDto.username,
                    name: dataUser.first_name + ' ' + dataUser.last_name,
                    avatar: dataUser.avatar
                },
                username: createContentDto.username,
                content: createContentDto.content,
                location:{
                    name: createContentDto.location.name,
                    country: createContentDto.location.country,
                    checkin: dataCheckin
                },
                tag: createContentDto.tag,
                reaction:{
                    like:0,
                    love:0,
                    comments:0,
                    share:0
                },
                comments: [],
                rate: 0,
                travel: createContentDto.travel,
                type: createContentDto.type,
                range:{
                    from: createContentDto.range.from,
                    to: createContentDto.range.to
                },
                total_price: createContentDto.total_price,
                hotel: createContentDto.hotel,
                metadata: createContentDto.metadata,
                images: createContentDto.images,
                createAt: (new Date().getTime()).toString()
            })

            resolve(newContent.save())
        })
    }
    
    checkContentOfUser(idContent: string , username: string) {
        return new  Promise((resolve , reject) =>{
            this.contentModel.find({
                username: username
            } , (error , result) =>{
                if(error) {
                    reject(error);
                }else {
                    let index = result.findIndex(o => o._id.toString() === idContent);
                    if(index === -1) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            })
        })
    }

    deleteContent(idContent: string) {
        return new Promise((resolve , reject)=>{
            this.contentModel.remove({
                _id: idContent
            } , (error ,  result)=>{
                if(error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }
}