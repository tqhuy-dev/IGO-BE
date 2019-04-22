import { IsString, IsNotEmpty } from "class-validator";

export class RetrieveCityDto {
    @IsString()
    @IsNotEmpty()
    cityID: string;
}