import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
    constructor(
        ) {
      super();
    }
  
    async validate(token: string) {
        console.log(token)
        return true;
    }
  }