import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors: true });
  const options = new DocumentBuilder()
  .setTitle('Field Force User Management Service')
  .setDescription("This is a digital platform, owned by The **[Tech Serve4 U, LLC](http://techserve4u.com)** <br />**Disclaimer:** You are not allowed to distribute, share, or sell this platform, services, and any contents to anyone for selling or public usages.<br/>**Contact for more details:** <info@techserve4u.com> <br />**Phone:** +1 (586) 834-8526")
  .setVersion('1.0')
  .addTag('user')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
    'access-token',
  )
  .build();
 const document = SwaggerModule.createDocument(app, options);
 SwaggerModule.setup('api/user-management', app, document);
  await app.listen(port);
}
bootstrap();
