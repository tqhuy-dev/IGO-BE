import { Module } from '@nestjs/common';
import { TravelPlacesController } from './travel-places.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TravelPlacesSchema } from './schema/travel-places.schema';
import { CityService } from 'src/share/services/city.services';
import { LocationSchema } from './schema/location.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name : 'City' , schema: TravelPlacesSchema},
            { name : 'Location' , schema: LocationSchema}
        ])
    ],
    controllers: [TravelPlacesController],
    providers: [CityService],
})
export class TravelPlacesModule {};