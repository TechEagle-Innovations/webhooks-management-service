import { Expose, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
  IsArray,
  IsObject,
} from 'class-validator';

// Define CreateWebhookData first
export class CreateWebhookData {
  @Expose()
  @IsString()
  @IsNotEmpty()
  serviceName?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  eventName?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  callbackLink?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  projectName?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  userEmail?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  _id?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  updatedAt: string;

  // @Expose()
  // @IsNotEmpty()
  // sampleData: any;

  @Expose()
  @IsNumber()
  __v: number;
}

// Define CreateWebhookDtoResponseDto after CreateWebhookData
export class CreateWebhookDtoResponseDto {
  @Expose()
  @IsString()
  status: string;

  @Expose()
  @IsString()
  message: string;

  @Expose()
  @ValidateNested()
  @Type(() => CreateWebhookData)
  data: CreateWebhookData;
}


export class FindWebhookResponseDto {
  @Expose()
  @IsString()
  status: string;

  @Expose()
  @IsString()
  message: string;

  @Expose()
  @ValidateNested()
  @Type(() => CreateWebhookData)
  data: CreateWebhookData[] ;
}

// Define a generic ResponseDto for any other cases
export class ResponseDto {
  @Expose()
  @IsString()
  status: string;

  @Expose()
  @IsString()
  message: string;

  @Expose()
  data: any;
}

export class CreateAvailableResponseData {
  @Expose()
  @IsString()
  @IsNotEmpty()
  serviceName: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  eventName: string;


  @Expose()
  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  _id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  createdAt: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  updatedAt: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  updatedBy: string;


  @Expose()
  @IsNotEmpty()
  sampleData: any;

  @Expose()
  @IsNumber()
  __v: number;
}

export class CreateAvailableServiceResponseDto {
  @Expose()
  @IsString()
  status: string;

  @Expose()
  @IsString()
  message: string;

  @Expose()
  @ValidateNested()
  @Type(() => CreateAvailableResponseData)
  data: CreateAvailableResponseData;
}

export class findByServiceName{

  @Expose()
  @IsString()
  eventName: string;


} 

export class FindServiceNameResponseDto {
  @Expose()
  @IsString()
  status: string;

  @Expose()
  @IsString()
  message: string;

  
  @Expose()
  data: string[];
}

export class FindAvailableServiceResponseDto {
  @Expose()
  @IsString()
  status: string;

  @Expose()
  @IsString()
  message: string;

  @Expose()
  @ValidateNested()
  @Type(() => CreateAvailableResponseData)
  data: CreateAvailableResponseData[] ;
}
