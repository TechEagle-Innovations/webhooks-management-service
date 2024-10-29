import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class UpdateWebhookDto {
    @IsString()
    projectName?: string;
  
    @IsString()
    callbackLink?: string;

    user?: any
  
    @IsString()
    serviceName?: string;

    @IsString()  
    @IsNotEmpty()  
     id: string;

     @IsString()
     eventName?: string;
  }