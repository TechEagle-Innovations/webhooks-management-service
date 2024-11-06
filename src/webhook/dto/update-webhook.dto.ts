import { PartialType } from '@nestjs/mapped-types';
import { CreateWebhookDto } from './create-webhook.dto';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { RequestDto } from 'src/dto/request.dto';
import { Expose, Type } from 'class-transformer';

export class UpdateWebhookDto extends PartialType(CreateWebhookDto) {
    
    @IsString()
    @IsNotEmpty()
    id:string
}

export class UpdateWebhookDtoRequest extends RequestDto{
    @IsNotEmpty()
    @ValidateNested()  // Ensures the nested DTO is validated
    @Type(() => UpdateWebhookDto)
    body: UpdateWebhookDto;

    @IsString()
    @IsNotEmpty()
    method: "PATCH";
}

