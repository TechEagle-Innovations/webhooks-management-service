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
// import { User } from 'src/dto/user.dto';


export class CreateAvailableServiceDto {
  // @IsNotEmpty()
  // @IsString()
  // createdBy: string;

  @IsNotEmpty()
  @IsString()
  eventName: string;

  // user: any

  // @IsNotEmpty()
  // @IsString()
  // updatedBy: string;

  @IsNotEmpty()
  @IsString()
  serviceName: string;

  @IsOptional()
  @IsNotEmpty()
  sampleData: any;


}

export class CreateAvailableServiceDtoRequest extends RequestDto {
  @IsNotEmpty()
  @ValidateNested() // Ensures the nested DTO is validated
  @Type(() => CreateAvailableServiceDto)
  body: CreateAvailableServiceDto;

  @IsString()
  @IsNotEmpty()
  method: 'POST';
  static user: any;

}








