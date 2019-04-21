import { Controller, Get, Post, HttpStatus, Body, UseGuards, UsePipes } from '@nestjs/common';
import { async } from 'rxjs/internal/scheduler/async';
import { CityService } from 'src/share/services/city.services';
import { CreateTravelPlaceDto } from './dto/create-travel-places.dto';
import { AuthGuard } from '@nestjs/passport';
import { ValidationPipe } from './../../share/pipe/validation.pipe';
import { CreateLocationDTO } from './dto/create-location.dto';
import { WRONG_CITY } from 'src/share/constant/message';

@Controller('places')
export class TravelPlacesController {
    constructor(
        private readonly citySvc: CityService
    ){}

    @Post('')
    @UseGuards(AuthGuard('bearer'))
    @UsePipes(new ValidationPipe())
    async createTravelPlaces(@Body() cityDTO: CreateTravelPlaceDto) {
        try {
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
}