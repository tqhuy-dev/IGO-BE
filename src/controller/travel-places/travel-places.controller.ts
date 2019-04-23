import { Controller, Get, Post, HttpStatus, Body, UseGuards, UsePipes, Param } from '@nestjs/common';
import { async } from 'rxjs/internal/scheduler/async';
import { CityService } from 'src/share/services/city.services';
import { CreateTravelPlaceDto } from './dto/create-travel-places.dto';
import { AuthGuard } from '@nestjs/passport';
import { ValidationPipe } from './../../share/pipe/validation.pipe';
import { CreateLocationDTO } from './dto/create-location.dto';
import { WRONG_CITY } from 'src/share/constant/message';
import { CountryService } from 'src/share/services/country.services';
import { CreateCountryDto } from './dto/create-country.dto';
import { RetrieveCityDto } from './dto/retrieve-city.dto';
import { RetrieveCountryDto } from './dto/retrieve-country.dto';
import { WRONG_COUNTRY } from './../../share/constant/message';

@Controller('places')
export class TravelPlacesController {
    constructor(
        private readonly citySvc: CityService,
        private readonly countrySVC: CountryService
    ){}

    @Post('')
    @UseGuards(AuthGuard('bearer'))
    @UsePipes(new ValidationPipe())
    async createTravelPlaces(@Body() cityDTO: CreateTravelPlaceDto) {
        try {
            await this.countrySVC.checkCountry(cityDTO.country);
            let data = await this.citySvc.createCity(cityDTO);
            return {
                status: HttpStatus.OK,
                data: data
            }
        } catch (error) {
            return {
                status: HttpStatus.OK,
                message: error
            }
        }
    }

    @Get('/locations/:cityID')
    @UseGuards(AuthGuard('bearer'))
    @UsePipes(new ValidationPipe())
    async retrieveLocationListCity(@Param() param: RetrieveCityDto) {
        try {
            let city: any = await this.citySvc.checkExistCity(param.cityID);
            let data: any = await this.citySvc.retrieveCityLocation(param.cityID);
            if(data.length === 0) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: WRONG_CITY
                }
            }
            return {
                status: HttpStatus.OK,
                data: data,
                city: city
            }
        } catch (error) {
            return {
                status: HttpStatus.OK,
                message: error
            }
        }
    }

    @Get('')
    @UseGuards(AuthGuard('bearer'))
    @UsePipes(new ValidationPipe())
    async retrieveCityList() {
        try {
            let data = await this.countrySVC.retrieveCityList();
            return {
                status: HttpStatus.OK,
                data: data
            }
        } catch (error) {
            return {
                status: HttpStatus.OK,
                message: error
            }
        }
    }

    @Get('/:countryID')
    @UseGuards(AuthGuard('bearer'))
    @UsePipes(new ValidationPipe())
    async retrieveCityOfCountry(@Param() param : RetrieveCountryDto) {
        try {
            let country: any = await this.countrySVC.checkCountry(param.countryID);
            let data: any = await this.citySvc.retrieveCityOfCountry(param.countryID);
            if(data.length === 0) {
                return {
                    status: HttpStatus.BAD_REQUEST,
                    message: WRONG_COUNTRY
                }
            }
            return {
                status: HttpStatus.OK,
                data: data,
                country: country
            }
        } catch (error) {
            return {
                status: HttpStatus.BAD_REQUEST,
                message: error
            }
        }
    }

    @Post('/location')
    @UseGuards(AuthGuard('bearer'))
    @UsePipes(new ValidationPipe())
    async createTravelLocation(@Body() locationDTO: CreateLocationDTO) {
        try {
            await this.citySvc.checkExistCity(locationDTO.city);
            let data = await this.citySvc.createLocation(locationDTO);
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

    @Post('/country')
    @UseGuards(AuthGuard('bearer'))
    @UsePipes(new ValidationPipe())
    async createCountry(@Body() countryDTO: CreateCountryDto) {
        try {
            let  data = await this.countrySVC.createCountry(countryDTO);
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
}