import { Test, TestingModule } from '@nestjs/testing';
import { availableServices } from './available-services.service';

describe('AvailableServicesService', () => {
  let service: availableServices;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [availableServices],
    }).compile();

    service = module.get<availableServices>(availableServices);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
