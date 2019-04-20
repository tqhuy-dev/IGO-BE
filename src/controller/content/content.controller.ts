import { Controller, Get } from '@nestjs/common';

@Controller('contents')
export class ContentsController {
    constructor(){}

    @Get('')
    async getContents() {
        return 'contents api is working';
    }
}