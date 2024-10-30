import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongoose';
import { RequestDto } from 'src/dto/request.dto';
import { User } from 'src/dto/user.dto';


export class CreateWebhookDto {
  @IsNotEmpty()
  @IsString()
  projectName: string;

  @IsNotEmpty()
  @IsString()
  eventName: string;

  // user: any

  @IsNotEmpty()
  @IsString()
  callbackLink: string;

  @IsNotEmpty()
  @IsString()
  serviceName: string;

  @IsNotEmpty()
  @ValidateNested()  // Ensures the nested DTO is validated
  @Type(() => User)
  user: User;
}

export class CreateWebhookDtoRequest extends RequestDto {
  @IsNotEmpty()
  @ValidateNested() // Ensures the nested DTO is validated
  @Type(() => CreateWebhookDto)
  body: CreateWebhookDto;

  @IsString()
  @IsNotEmpty()
  method: 'POST';
  static user: any;
}

export class createWebhookResponseDto {
  @IsString()
  @IsNotEmpty()
  @Expose()
  status: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  message: string;

  @IsNotEmpty()
  @ValidateNested()
  @Expose()
  @Type(() => CreateWebhookDto)
  data: CreateWebhookDto;
}



