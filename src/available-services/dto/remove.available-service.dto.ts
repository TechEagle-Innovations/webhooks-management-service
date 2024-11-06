import { IsNotEmpty, ValidateNested, IsString } from "class-validator";
import { FindAvailableServiceDto } from "./find-available-service.dto"; 
import { RequestDto } from "src/dto/request.dto";
import { Expose, Type } from "class-transformer";
import { User } from "src/dto/user.dto";
// import { IsString } from "@nestjs/class-validator";

export class RemoveAvailableServiceDto extends FindAvailableServiceDto {
   @IsString()
   @IsNotEmpty()
   id: string;

  //  @IsNotEmpty()
  //    @ValidateNested()  // Ensures the nested DTO is validated
  //   @Type(() => User)
  //   removeAvailableService:RemoveAvailableServiceDto;
   
  }

  export class RemoveAvailableServiceDtoRequest extends RequestDto{
    @IsNotEmpty()
    @ValidateNested()  // Ensures the nested DTO is validated
    @Type(() => RemoveAvailableServiceDto)
    body: RemoveAvailableServiceDto;

    @IsNotEmpty()
    method: "DELETE";
}

