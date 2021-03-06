import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content } from './../../controller/content/interface/content.interface';
import { CreateContentDto } from 'src/controller/content/dto/create-content.dto';
import { User } from 'src/controller/user/interface/user.interface';
import { async } from 'rxjs/internal/scheduler/async';
import { ReactionContentDto } from 'src/controller/content/dto/reaction-content.dto';
import { REACTION_TYPE } from './../constant/value';
import { REACTION_DUPLICATE } from './../constant/message';

@Injectable()
export class ContentService {
    constructor(
        @InjectModel('Content') private readonly contentModel: Model<Content>,
        @InjectModel('User') private readonly userModel: Model<User>,
    ) { }

    retrieveContentDetail(idContent: string) {
        return new Promise((resolve, reject) => {
            this.contentModel.findOne({
                _id: idContent
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    retrieveUserContents(username: string) {
        return new Promise((resolve, reject) => {
            this.contentModel.find({
                username: username
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    retrieveAllContents() {
        return new Promise((resolve, reject) => {
            this.contentModel.find({

            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    createContent(createContentDto: CreateContentDto) {
        return new Promise(async (resolve, reject) => {
            let dataCheckin = [];
            dataCheckin = createContentDto.location.checkin.map((element: any) => {
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
                username: createContentDto.username,
                content: createContentDto.content,
                location: {
                    name: createContentDto.location.name,
                    country: createContentDto.location.country,
                    checkin: dataCheckin
                },
                tag: createContentDto.tag,
                reaction: {
                    like: [],
                    love: [],
                    comments: [],
                    share: []
                },
                comments: [],
                rate: 0,
                travel: createContentDto.travel,
                type: createContentDto.type,
                range: {
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

    checkContentOfUser(idContent: string, username: string) {
        return new Promise((resolve, reject) => {
            this.contentModel.find({
                username: username
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    let index = result.findIndex(o => o._id.toString() === idContent);
                    if (index === -1) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                }
            })
        })
    }

    deleteContent(idContent: string) {
        return new Promise((resolve, reject) => {
            this.contentModel.remove({
                _id: idContent
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    updateReaction(reactionDTO: ReactionContentDto, dataUser: any) {
        return new Promise(async (resolve, reject) => {

            this.contentModel.findOne({
                _id: reactionDTO.id_content
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    let dataReaction = result.reaction;
                    let reaction = {
                        username: dataUser.username,
                        avatar: dataUser.avatar,
                        name: dataUser.first_name + ' ' + dataUser.last_name,
                        reactionAt: new Date().getTime(),
                    };
                    let dataTypeReaction = reactionDTO.type === 'Like' || reactionDTO.type === 'Unlike'?
                    dataReaction.like : dataReaction.love;
                    if(reactionDTO.type === 'like' || reactionDTO.type === 'love') {
                        let index = dataTypeReaction.findIndex(o => o.username === reactionDTO.username);
                        if (index !== -1) {
                            reject(REACTION_DUPLICATE)
                            return;
                        }
                    }

                    if (reactionDTO.type === 'Like') {
                        dataReaction.like.push(reaction)
                    } else if (reactionDTO.type === 'Love') {
                        dataReaction.love.push(reaction)
                    } else if( reactionDTO.type === 'Unlike') {
                        let indexListReaction = dataReaction.like.findIndex( o => o.username === reactionDTO.username);
                        dataReaction.like.splice(indexListReaction , 1);
                    } else if( reactionDTO.type === 'Unlove') {
                        let indexListReaction = dataReaction.love.findIndex( o => o.username === reactionDTO.username);
                        dataReaction.love.splice(indexListReaction , 1);
                    }
                    this.contentModel.findOneAndUpdate({
                        _id: reactionDTO.id_content
                    }, {
                            $set: {
                                reaction: dataReaction
                            }
                        }, (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve({
                                    isSuccess: true,
                                    data: result
                                });
                            }
                        })
                }
            })
        })
    }

    retrieveContentsFilter(filter: any) {
        return new Promise((resolve , reject) =>{
            this.contentModel.find({} , (error , result) =>{
                if(error) {
                    reject(error);
                } else {
                    let dataFilter = result;
                    if(filter.city) {
                        dataFilter = dataFilter.filter((element) =>{
                            return element.location.name === filter.city
                        })
                    }
                    if(filter.location) {
                        dataFilter = dataFilter.filter((element) =>{
                            let index = element.location.checkin.findIndex(o => o.name === filter.location);
                            return index !== -1;
                        })
                    }
                    resolve(dataFilter);
                }
            })
        })
    }
}