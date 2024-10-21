import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { webhookTopicDocument } from 'src/Schema/webhook.schema';
import { SchemasModule} from 'src/Schema/schemas.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: 'UserWebhook', schema: UserWebhookSchema }]), 
    SchemasModule,
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
  exports:[WebhookService]
})
export class WebhookModule {}
