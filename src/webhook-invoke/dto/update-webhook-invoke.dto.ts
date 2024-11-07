import { PartialType } from '@nestjs/mapped-types';
import { CreateWebhookInvokeDto } from './create-webhook-invoke.dto';

export class UpdateWebhookInvokeDto extends PartialType(CreateWebhookInvokeDto) {}
