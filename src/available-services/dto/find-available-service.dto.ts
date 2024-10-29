import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { RequestDto } from "src/dto/request.dto";
// import { User } from "src/dto/user.dto";

export class FindAvailableServiceDto{
  @IsString()
    @IsOptional()
    id:string;

    @IsNotEmpty()
    @ValidateNested()  // Ensures the nested DTO is validated
    @Type(() => FindAvailableServiceDto)
    findAvailableService:FindAvailableServiceDto;
    
}

export class FindAvailableServiceDtoRequest extends RequestDto{
    @IsNotEmpty()
    @ValidateNested()  // Ensures the nested DTO is validated
  @Type(() => FindAvailableServiceDto)
    body: FindAvailableServiceDto;

    @IsString()
    @IsNotEmpty()
    method: "GET";
}
  