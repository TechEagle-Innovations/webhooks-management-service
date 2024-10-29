import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { RequestDto } from "src/dto/request.dto";
import { User } from "src/dto/user.dto";

export class FindWebhookDto{
  @IsString()
    @IsOptional()
    id:string;

    @IsNotEmpty()
    @ValidateNested()  // Ensures the nested DTO is validated
    @Type(() => User)
    user:User;
    
}

export class FindWebhookDtoRequest extends RequestDto{
    @IsNotEmpty()
    @ValidateNested()  // Ensures the nested DTO is validated
  @Type(() => FindWebhookDto)
    body: FindWebhookDto;

    @IsString()
    @IsNotEmpty()
    method: "GET";
}
  