import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateLocationDTO {
    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

}