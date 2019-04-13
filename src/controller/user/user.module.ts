import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from 'src/share/services/user.services';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { HttpStrategy } from 'src/share/guard/auth-guard';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'User' , schema: UserSchema}
        ]),
        PassportModule.register({ defaultStrategy: 'bearer' }),
    ],
    controllers: [UserController],
    providers: [
        UserService,
        HttpStrategy
    ],
})
export class UserModule {};