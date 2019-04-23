import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { async } from 'rxjs/internal/scheduler/async';
import { TYPE_VACATION, TRAVEL_MOVEMENT } from 'src/share/constant/value';

@Controller('data-types')
export class DataTypesController {
    constructor(){}

    @Get('/type-vacation')
    @UseGuards(AuthGuard('bearer'))
    async getTypeVacation() {
        return {
            status: HttpStatus.OK,
            data: TYPE_VACATION
        }
    }

    @Get('/travel')
    @UseGuards(AuthGuard('bearer'))
    async getTravelMovement() {
        return {
            status: HttpStatus.OK,
            data: TRAVEL_MOVEMENT
        }
    }
}