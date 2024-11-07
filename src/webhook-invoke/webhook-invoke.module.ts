import { Module } from '@nestjs/common';
import { WebhookInvokeService } from './webhook-invoke.service';
import { WebhookInvokeController } from './webhook-invoke.controller';
import { SchemasModule } from 'src/Schema/schemas.module';

@Module({
  imports:[SchemasModule],
  controllers: [WebhookInvokeController],
  providers: [WebhookInvokeService],
  exports: [WebhookInvokeService]
})
export class WebhookInvokeModule {}
