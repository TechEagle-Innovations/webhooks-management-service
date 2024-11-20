import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
    imports:[ClientsModule.register([
        {
          name: 'KAFKA_CLIENT',
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'webhook-management',
              brokers: ['localhost:9092'],
            },
            consumer: {
              groupId: 'consumergroup-webhook-management'
            }
          }
        },
      ])],
      exports:[ClientsModule]
})

export class SharedResourceModule {}


