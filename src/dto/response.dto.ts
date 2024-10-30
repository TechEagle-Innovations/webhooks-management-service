import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ResponseDto {

  @IsString()
  @IsNotEmpty()
  @Expose()
  status: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  message:string;
  
  @IsNotEmpty()
  @Expose()
  data: any;
}