import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TravelPlaces } from './../../controller/travel-places/interface/travel-places.interface';
import { CreateTravelPlaceDto } from 'src/controller/travel-places/dto/create-travel-places.dto';
import { TREND_VALUES } from '../constant/value';
import { Location } from 'src/controller/travel-places/interface/location.interface';
import { CreateLocationDTO } from 'src/controller/travel-places/dto/create-location.dto';
import { WRONG_CITY } from 'src/share/constant/message';
@Injectable()
export class CityService {
    constructor(
        @InjectModel('City') private readonly cityModel: Model<TravelPlaces>,
        @InjectModel('Location') private readonly locationModel: Model<Location>
    ) {}
    

    createCity(cityDTO: CreateTravelPlaceDto) {
        return new Promise((resolve , reject) =>{
            const newCity = new this.cityModel({
                country: cityDTO.country,
                name: cityDTO.name,
                description: cityDTO.description,
                rate: 0,
                checkin: 0,
                weather: {
                    min: 0,
                    max: 0
                },
                trend: TREND_VALUES[0].name
            })

            resolve(newCity.save());
        })
    }

    createLocation(locationDTO: CreateLocationDTO) {
        return new  Promise((resolve , reject) =>{
            const newLocation = new this.locationModel({
                city: locationDTO.city,
                name: locationDTO.name,
                description: locationDTO.description,
                address: locationDTO.address,
                rate: 0,
                checkin: 0,
                reviews: [],
                trend: TREND_VALUES[0].name,
                price: 0
            })

            resolve(newLocation.save());
        })
    }

    checkExistCity(idCity) {
        return new Promise((resolve , reject) =>{
            this.cityModel.findOne({
                _id: idCity
            } , (error , result) =>{
                if(error) {
                    reject(WRONG_CITY);
                } else {
                   resolve(result);
                }
            })
        })
    }

    retrieveCityLocation(idCity) {
        return new Promise((resolve , reject) =>{
            this.locationModel.find({
                city: idCity
            } , (error , result) =>{
                if(error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    }

    retrieveCityOfCountry(idCountry: string) {
        return new Promise((resolve , reject) =>{
            this.cityModel.find({
                country: idCountry
            } , (error , result) =>{
                if(error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            })
        })
    } 
}