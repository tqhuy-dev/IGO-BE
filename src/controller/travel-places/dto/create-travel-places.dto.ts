import { IsString, IsNotEmpty } from "class-validator";

export class CreateTravelPlaceDto {
    @IsString()
    @IsNotEmpty()
    country: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}