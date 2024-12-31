
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhookModule } from './webhook/webhook.module';
import { KafkaAdminService } from './app.kafka.service';
import { SchemasModule } from './Schema/schemas.module';
import { AvailableServicesModule } from './available-services/available-services.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestResponseValidationInterceptor } from './interceptor/validation.interceptor';
import { WebhookInvokeModule } from './webhook-invoke/webhook-invoke.module';
import { availableServices } from './available-services/available-services.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SharedResourceModule } from './shared-resource/shared-resource.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('ATLAS_ADDRESS'),
        
      }),
      
      inject: [ConfigService],
      
    }),
    SharedResourceModule,
    WebhookModule,
    SchemasModule,
    AvailableServicesModule,
    WebhookInvokeModule,
  ],
  controllers: [AppController],
  providers: [AppService,KafkaAdminService, availableServices, ClientsModule, SharedResourceModule,
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new RequestResponseValidationInterceptor,
  }
  ],
  exports:[SharedResourceModule, ClientsModule]
})
export class AppModule {}

