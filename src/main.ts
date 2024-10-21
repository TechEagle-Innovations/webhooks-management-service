
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { ConfigService } from '@nestjs/config';


const config = new ConfigService();
const PORT = config.get("WEBHOOK_MANAGEMENT_SERVICE_PORT")
const kafkaBorkers = config.get("ALL_KAFKA_BROKERS").split(',')
console.log("kafkaBorkers", kafkaBorkers)

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [...kafkaBorkers],
      },
      consumer: {
        groupId: 'webhook-consumer'
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner
      }
    }
  });
  
  // Start the HTTP REST server
  await app.listen(PORT, async () => {  // REST API runs on service assigned port
    console.log(await app.getUrl(), `Server started on port`, PORT);
  });

  // Start the microservice
  await app.startAllMicroservices();
}

bootstrap();
