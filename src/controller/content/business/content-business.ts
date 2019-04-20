import { Injectable } from '@nestjs/common';
import { TYPE_VACATION } from 'src/share/constant/value';

@Injectable()
export class ContentBusiness {
    constructor() {}
    
    checkTypeVacation(type: string) {
        let index = TYPE_VACATION.findIndex(o => o.name === type);
        if(index === -1) {
            return false;
        } else {
            return true;
        }
    }
}