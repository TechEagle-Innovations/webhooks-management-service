import { IsNotEmpty, ValidateNested ,IsString } from "class-validator";
import { FindWebhookDto } from "./find-webhook.dto"; 
import { RequestDto } from "src/dto/request.dto";
import { Expose, Type } from "class-transformer";
import { User } from "src/dto/user.dto";
// import { IsString } from "@nestjs/class-validator";

export class RemoveWebhookDto extends FindWebhookDto {
   @IsString()
   @IsNotEmpty()
   id: string;

   @IsNotEmpty()
     @ValidateNested()  // Ensures the nested DTO is validated
    @Type(() => User)
    user:User;
   
  }

  export class RemoveWebhookDtoRequest extends RequestDto{
    @IsNotEmpty()
    @ValidateNested()  // Ensures the nested DTO is validated
    @Type(() => RemoveWebhookDto)
    body: RemoveWebhookDto;

    @IsNotEmpty()
    method: "DELETE";
}


  