
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type availableServicesTopicDocument = HydratedDocument<availableServicesinfo>

@Schema({ timestamps: true })
export class availableServicesinfo {

    @Prop({ required: true })
    serviceName: string;
  
    @Prop({ required: true })
    eventName: string;
  
    @Prop({ required: true })
    createdBy: string;
  
    @Prop({ required: true })
    updatedBy: string;

    @Prop({ required: true, type: Object }) 
    sampleData: any;

}

export const availableServicesTopicsSchema = SchemaFactory.createForClass(availableServicesinfo)

