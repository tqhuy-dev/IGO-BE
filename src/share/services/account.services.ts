import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from './../../controller/user/interface/account.schema';
@Injectable()
export class AccountService {
    constructor(
        @InjectModel('Account') private readonly accountModel: Model<Account>
    ) { }

    createAccount(username: string, token: string) {
        return new Promise((resolve, reject) => {
            const newAccount = new this.accountModel({
                username: username,
                token: token
            })

            resolve(newAccount.save());
        })

    }

    updateAccount(username: string, token: string) {
        return new Promise((resolve, reject) => {
            this.accountModel.findOneAndUpdate({
                username: username
            }, {
                    $set: {
                        token: token
                    }
                }, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                })
        })
    }

    async verifyAccount(username: string, token: string) {
        let account: any = await this.accountModel.findOne({
            username: username
        });
        if (account !== null) {
            this.updateAccount(username, token);
        } else {
            this.createAccount(username, token);
        }
    }

    checkToken(token: string) {
        return new Promise((resolve, reject) => {
            this.accountModel.findOne({
                token: token
            }, (error, result) => {
                if (error) {
                    resolve(false)
                } else {
                    if(result !== null) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            })
        })

    }
}