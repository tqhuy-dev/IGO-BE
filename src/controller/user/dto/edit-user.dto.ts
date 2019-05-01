import { IsString } from "class-validator";

export class EditUserDto {
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    phone: string;

    @IsString()
    birthday: string;

    @IsString()
    avatar: string;

    @IsString()
    password: string;
}