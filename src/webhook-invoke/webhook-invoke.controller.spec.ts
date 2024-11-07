import { Test, TestingModule } from '@nestjs/testing';
import { WebhookInvokeController } from './webhook-invoke.controller';
import { WebhookInvokeService } from './webhook-invoke.service';

describe('WebhookInvokeController', () => {
  let controller: WebhookInvokeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebhookInvokeController],
      providers: [WebhookInvokeService],
    }).compile();

    controller = module.get<WebhookInvokeController>(WebhookInvokeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
