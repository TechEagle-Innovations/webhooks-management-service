import { Module } from '@nestjs/common';
import { AvailableServicesController } from './available-services.controller';
import { availableServices } from './available-services.service';
import { SchemasModule } from 'src/Schema/schemas.module';

@Module({
  imports: [
    
  SchemasModule,
  ],
  controllers: [AvailableServicesController],
  providers: [availableServices],
})
export class AvailableServicesModule {}
