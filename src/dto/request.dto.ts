import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { CreateWebhookDto } from 'src/webhook/dto/create-webhook.dto';
import { FindWebhookDto } from 'src/webhook/dto/find-webhook.dto';
import { UpdateWebhookDto } from 'src/webhook/dto/update-webhook.dto';
import { RemoveWebhookDto } from 'src/webhook/dto/remove.webhook.dto';
import { CreateAvailableServiceDto } from 'src/available-services/dto/create-available-service.dto';
import { FindAvailableServiceDto} from 'src/available-services/dto/find-available-service.dto';
import { UpdateAvailableServiceDto } from 'src/available-services/dto/update-available-service.dto';
import { RemoveAvailableServiceDto } from 'src/available-services/dto/remove.available-service.dto';




export class RequestDto {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsNotEmpty()
  body: CreateWebhookDto | UpdateWebhookDto | RemoveWebhookDto | FindWebhookDto | CreateAvailableServiceDto | FindAvailableServiceDto | UpdateAvailableServiceDto | RemoveAvailableServiceDto;

  @IsObject()
  headers: Record<string, any> | {};

  @IsString()
  @IsNotEmpty()
  method: "GET" | "PATCH" | "POST" | "DELETE";

  @IsObject()
  params: Record<string, string> | {"id": string };

  @IsObject()
  query: Record<string, string> | {};
}
