import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes } from "mongoose";

export type ServiceTopicDocument = HydratedDocument<serviceTopicInfo>

@Schema({ timestamps: true })
export class serviceTopicInfo {
    @Prop({ required: true, default: "webhook-management" })
    serviceName: string

    @Prop({ required: true })
    controller: string
    
    @Prop({ required: true, unique: true })
    topicName: string

    @Prop({ required: true })
    gateWayURL: string

    @Prop({ required: true })
    urlMethod: string

    @Prop({required: true, default: true})
    isAuthRequired: boolean
}

export const ServiceTopicsSchema = SchemaFactory.createForClass(serviceTopicInfo)