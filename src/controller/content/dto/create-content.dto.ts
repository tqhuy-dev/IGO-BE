import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateContentDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    location: {
        name: string
        country: string,
        checkin: []
    };

    tag: [];
    @IsNotEmpty()
    travel: []
    
    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    range:{
        from: string,
        to: string
    }

    @IsNotEmpty()
    @IsNumber()
    totalPrice: number;

    @IsNotEmpty()
    hotel: [];

    metadata: any;
}