import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http.error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { ValidationPipe } from "./shared/validation.pipe";
import { MulterModule } from '@nestjs/platform-express';




@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
  MulterModule.register({
    dest: './files',
  }), UserModule],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_FILTER,
    useClass: HttpErrorFilter
  },
  {
    provide:APP_INTERCEPTOR,
    useClass:LoggingInterceptor
  },
  {
    provide:APP_PIPE,
    useClass:ValidationPipe
  }
  ],
})
export class AppModule {}
