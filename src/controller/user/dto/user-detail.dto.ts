import { IsString } from "class-validator";

export class UserDetailDto {
    @IsString()
    username: string;
}