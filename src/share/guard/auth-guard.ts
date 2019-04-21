import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AccountService } from '../services/account.services';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly accountSvc: AccountService
  ) {
    super();
  }

  async validate(token: string) {
    let data = await this.accountSvc.checkToken(token);
    return data;
  }
}