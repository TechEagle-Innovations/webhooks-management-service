// import { IsString, IsOptional } from 'class-validator';

// export class UpdateAvailableServiceDto {
//   @IsString()
//   @IsOptional()
//   serviceName?: string;

//   @IsString()
//   @IsOptional()
//   eventName?: string;

//   @IsString()
//   @IsOptional()
//   createdBy?: string;

//   @IsString()
//   @IsOptional()
//   updatedBy?: string;
// }
import { PartialType } from '@nestjs/mapped-types';
import { CreateAvailableServiceDto } from './create-available-service.dto'; 
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { RequestDto } from 'src/dto/request.dto';
import { Type } from 'class-transformer';

export class UpdateAvailableServiceDto extends PartialType(CreateAvailableServiceDto) {
    
    @IsString()
    @IsNotEmpty()
    id:string
}

export class UpdateFileDtoRequest extends RequestDto{
    @IsNotEmpty()
    @ValidateNested()  // Ensures the nested DTO is validated
    @Type(() => UpdateAvailableServiceDto)
    body: UpdateAvailableServiceDto;

    @IsString()
    @IsNotEmpty()
    method: "PATCH";
}