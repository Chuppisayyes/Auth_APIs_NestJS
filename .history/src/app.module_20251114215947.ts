import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Authv1Module } from './authv1/authv1.module';

@Module({
  imports: [Authv1Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
