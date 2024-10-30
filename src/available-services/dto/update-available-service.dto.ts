import { PartialType } from '@nestjs/mapped-types';
import { CreateAvailableServiceDto } from './create-available-service.dto'; 
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { RequestDto } from 'src/dto/request.dto';
import { Expose, Type } from 'class-transformer';

export class UpdateAvailableServiceDto extends PartialType(CreateAvailableServiceDto) {
    
    @IsString()
    @IsNotEmpty()
    id:string
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
export class UpdateAvailableServiceResponseDto {
    @IsString()
    @IsNotEmpty()
    @Expose()
    status: string;
  
    @IsString()
    @IsNotEmpty()
    @Expose()
    message: string;
  
    @IsNotEmpty()
    @ValidateNested()
    @Expose()
    @Type(() =>UpdateAvailableServiceDto)
    data: UpdateAvailableServiceDto;
  }