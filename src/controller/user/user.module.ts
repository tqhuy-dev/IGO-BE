import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from 'src/share/services/user.services';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { HttpStrategy } from 'src/share/guard/auth-guard';
import { PassportModule } from '@nestjs/passport';
import { AccountSchema } from './schema/account.schema';
import { AccountService } from 'src/share/services/account.services';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'User' , schema: UserSchema},
            { name: 'Account' , schema: AccountSchema}
        ]),
        PassportModule.register({ defaultStrategy: 'bearer' }),
    ],
    controllers: [UserController],
    providers: [
        UserService,
        HttpStrategy,
        AccountService
    ],
})
export class UserModule {};