import { Optional } from "@nestjs/common";
import { Expose, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { RequestDto } from "src/dto/request.dto";
// import { User } from "src/dto/user.dto";

export class FindAvailableServiceDto{
  // @IsString()
  @Optional()
   id:string;
    
}

export class FindAvailableServiceDtoRequest extends RequestDto{
    @IsNotEmpty()
    @ValidateNested()  // Ensures the nested DTO is validated
  @Type(() => FindAvailableServiceDto)
    body: FindAvailableServiceDto;

   method: "GET" ;
}

