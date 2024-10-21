import { Test, TestingModule } from '@nestjs/testing';
import { AvailableServicesController } from './available-services.controller';
import { availableServices } from './available-services.service';

describe('AvailableServicesController', () => {
  let controller: AvailableServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailableServicesController],
      providers: [availableServices ],
    }).compile();

    controller = module.get<AvailableServicesController>(AvailableServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
