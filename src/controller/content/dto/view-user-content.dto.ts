import { IsString } from "class-validator";

export class ViewUserContentDto {
    @IsString()
    username: string;
}