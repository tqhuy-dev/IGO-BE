import { IsString, IsNotEmpty } from "class-validator";

export class AddFriendsDto {
    @IsString()
    @IsNotEmpty()
    username: string;
}