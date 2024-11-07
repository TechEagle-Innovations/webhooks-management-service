import { Test, TestingModule } from '@nestjs/testing';
import { WebhookInvokeService } from './webhook-invoke.service';

describe('WebhookInvokeService', () => {
  let service: WebhookInvokeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebhookInvokeService],
    }).compile();

    service = module.get<WebhookInvokeService>(WebhookInvokeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
