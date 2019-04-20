import { IsString } from "class-validator";

export class ViewContentDto {
    @IsString()
    contentID: string;
}