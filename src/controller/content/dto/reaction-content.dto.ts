import { IsString } from "class-validator";

export class ReactionContentDto {
    @IsString()
    type: string;

    @IsString()
    username: string;

    @IsString()
    id_content: string;
}