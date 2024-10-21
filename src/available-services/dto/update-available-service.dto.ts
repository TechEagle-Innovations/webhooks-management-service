import { IsString, IsOptional } from 'class-validator';

export class UpdateAvailableServiceDto {
  @IsString()
  @IsOptional()
  serviceName?: string;

  @IsString()
  @IsOptional()
  eventName?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}
