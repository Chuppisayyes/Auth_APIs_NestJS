import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() { // Khởi tạo hàm chính chạy ứng dụng nestjs
  const app = await NestFactory.create(AppModule); // khởi tạo toàn bộ ứng dụng
  app.enableCors({origin:"*"}); // 
  const config = new DocumentBuilder() //tạo đối tượng cấu hình Swagger.
    .setTitle('Auth - APIs') //đặt tiêu đề cho trang Swagger UI.
    .setDescription('Full apis auth by Teocoder - 2025') //mô tả API.
    .setVersion('1.0') //phiên bản API.
    //.addTag('Tèo') //nhóm API theo tag “Tèo”.
    //  .addBearerAuth()
    .build(); //hoàn tất cấu hình.
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  //Tạo 1 hàm factory để sinh swagger document.
  //createDocument(app, config) → scan toàn bộ controllers, decorators, DTO → sinh JSON của swagger.
  SwaggerModule.setup('swagger', app, documentFactory);
  //Tạo đường dẫn Swagger UI tại: http://localhost:8080/swagger
  //setup(path, app, documentFactory) sẽ: render UI, generate document, serve swagger static assets
  await app.listen(process.env.PORT ?? 8080); //Khởi chạy server tại cổng: nếu có process.env.PORT thì dùng nếu không → dùng 8080
}
bootstrap();
