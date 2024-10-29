
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type webhookTopicDocument = HydratedDocument<webhookinfo>

@Schema({ timestamps: true })
export class webhookinfo {
  @Prop({ required: true })
  projectName: string;

  @Prop({ required: true })
  eventName: string;

  @Prop({ required: true })
  userEmail: string;

  // @Prop({ required: true })
  // Id: string;

  @Prop({ required: true })
  callbackLink: string;

  @Prop({ required: true })
  serviceName: string;
}


export const webhookTopicsSchema = SchemaFactory.createForClass(webhookinfo)

