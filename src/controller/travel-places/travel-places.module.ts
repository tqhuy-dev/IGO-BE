import { Module } from '@nestjs/common';
import { TravelPlacesController } from './travel-places.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TravelPlacesSchema } from './schema/travel-places.schema';
import { CityService } from 'src/share/services/city.services';
import { LocationSchema } from './schema/location.schema';
import { countrySchema } from './schema/country.schema';
import { CountryService } from 'src/share/services/country.services';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name : 'City' , schema: TravelPlacesSchema},
            { name : 'Location' , schema: LocationSchema},
            { name : 'Country' , schema: countrySchema}
        ])
    ],
    controllers: [TravelPlacesController],
    providers: [CityService, CountryService],
})
export class TravelPlacesModule {};