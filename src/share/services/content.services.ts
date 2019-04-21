import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Content } from './../../controller/content/interface/content.interface';
import { CreateContentDto } from 'src/controller/content/dto/create-content.dto';

@Injectable()
export class ContentService {
    constructor(
        @InjectModel('Content') private readonly contentModel: Model<Content>
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

    createServices(createContentDto: CreateContentDto) {
        return new Promise((resolve , reject) =>{
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
            const newContent = new this.contentModel({
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
                    love:0
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
                images: createContentDto.images
            })

            resolve(newContent.save())
        })
    }
    
}