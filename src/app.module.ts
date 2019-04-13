import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_SOURCE } from './core/enviroment';
import { UserModule } from './controller/user/user.module';
import { LoggerMiddleware } from './share/middleware/logger.middleware';
@Module({
  imports: [
    MongooseModule.forRoot(MONGO_SOURCE , { useNewUrlParser: true }),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('users');
  }
}
