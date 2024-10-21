// schemas/schemas.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceTopicsSchema } from './ServiceTopicsSchema';
import {  webhookTopicsSchema } from './webhook.schema'; 
import { availableServicesTopicsSchema } from './availableService.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "serviceTopicInfo", schema: ServiceTopicsSchema }]),
    MongooseModule.forFeature([{ name: "webhookinfo", schema: webhookTopicsSchema}]),
    MongooseModule.forFeature([{ name: "availableServicesinfo", schema: availableServicesTopicsSchema}]),
    
  ],
  exports: [
    MongooseModule.forFeature([{ name: "serviceTopicInfo", schema: ServiceTopicsSchema }]),
    MongooseModule.forFeature([{ name: "webhookinfo", schema: webhookTopicsSchema}]),
    MongooseModule.forFeature([{ name: "availableServicesinfo", schema: availableServicesTopicsSchema}]),
    
  
  ],
})
export class SchemasModule {}