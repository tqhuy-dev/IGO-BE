import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from './../../controller/travel-places/interface/country.interface';
import { CreateCountryDto } from './../../controller/travel-places/dto/create-country.dto';
import { WRONG_COUNTRY } from './../constant/message';
@Injectable()
export class CountryService {
    constructor(
        @InjectModel('Country') private readonly countryModel: Model<Country>
    ) {}

    createCountry(country: CreateCountryDto) {
        return new Promise((resolve , reject) =>{
            const newCountry = new this.countryModel({
                name: country.name
            });

            resolve(newCountry.save());
        })
    }

    checkCountry(countryID: string) {
        return new Promise((resolve , reject) =>{
            this.countryModel.findOne({
                _id: countryID
            } , (error , result) =>{
                if(error) {
                    reject(WRONG_COUNTRY);
                } else {
                    resolve(true);
                }
            })
        })
    }
    
}