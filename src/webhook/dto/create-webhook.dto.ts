import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class CreateWebhookDto {
  @IsNotEmpty()
  @IsString()
  projectName: string;

  @IsNotEmpty()
  @IsString()
  eventName: string;

  user: any

  @IsNotEmpty()
  @IsString()
  callbackLink: string;

  @IsNotEmpty()
  @IsString()
  serviceName: string;
}


