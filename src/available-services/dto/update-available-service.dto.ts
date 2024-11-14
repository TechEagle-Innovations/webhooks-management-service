import { PartialType } from '@nestjs/mapped-types';
import { CreateAvailableServiceDto } from './create-available-service.dto'; 
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { RequestDto } from 'src/dto/request.dto';
import { Expose, Type } from 'class-transformer';

export class UpdateAvailableServiceDto extends PartialType(CreateAvailableServiceDto) {
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    serviceName:string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    eventName:string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    updatedBy:string
}

export class UpdateAvailableServiceDtoRequest extends RequestDto{
    @IsNotEmpty()
    @ValidateNested()  // Ensures the nested DTO is validated
    @Type(() => UpdateAvailableServiceDto)
    body: UpdateAvailableServiceDto;

    @IsString()
    @IsNotEmpty()
    method: "PATCH";
}
