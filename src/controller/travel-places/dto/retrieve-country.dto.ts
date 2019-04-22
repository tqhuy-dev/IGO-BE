import { IsString, IsNotEmpty } from "class-validator";

export class RetrieveCountryDto {
    @IsString()
    @IsNotEmpty()
    countryID: string;
}