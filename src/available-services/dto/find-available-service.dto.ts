import { Optional } from "@nestjs/common";
import { Expose, Type } from "class-transformer";
import { isNotEmpty, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { RequestDto } from "src/dto/request.dto";
// import { User } from "src/dto/user.dto";

export class FindAvailableServiceDto{
  @IsString()
  @IsOptional()
  id:string;

  @IsString()
  @IsOptional()
  serviceName:string;

  @IsString()
  @IsOptional()
  eventName:string;

  @IsString()
  @IsOptional()
  sampleData:string;
    
}

export class FindAvailableServiceDtoRequest extends RequestDto{
    @IsNotEmpty()
    @ValidateNested()  // Ensures the nested DTO is validated
  @Type(() => FindAvailableServiceDto)
    body: FindAvailableServiceDto;

   method: "GET" ;
}

