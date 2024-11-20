
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, ServerKafka, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

const config = new ConfigService();
const PORT = config.get("WEBHOOK_MANAGEMENT_SERVICE_PORT")
const kafkaBorkers = config.get("ALL_KAFKA_BROKERS").split(',')
console.log("kafkaBorkers", kafkaBorkers)
const _microserviceName = "WEBHOOK_MANAGEMENT_SERVICE"
const USER_SERVICE_LINK = config.get("USER_MANAGEMENT_SERVICE")

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId:'webhook-management',
          brokers: [...kafkaBorkers],
        },
        consumer: {
          groupId: 'consumergroup-webhook-management'
        },
        producer: {
          createPartitioner: Partitioners.LegacyPartitioner
        }
      }
    }, {
    inheritAppConfig: true,

  });

  // const kafkaService = app.get("KafkaService");
  // const kafkaClient= kafkaService.client;
  // const producer = kafkaClient.producer();

  // await producer.connect();

  // await producer.send("service-activity","Working fine");
  // // Start the HTTP REST server
  app.enableShutdownHooks()
  await app.listen(PORT, async () => { // REST API runs on service assigned port
    console.log(await app.getUrl(), `Server started on port`, PORT);
  });

  // Start the microservice
  await app.startAllMicroservices();

  try {
    const sayHelloToUserService = await axios(`${USER_SERVICE_LINK}/hello-service/${_microserviceName}`)
    console.log("sayHelloToUserService", sayHelloToUserService.data.data)
  } catch (error) {
    console.log(error.response)
  }
}
bootstrap();
