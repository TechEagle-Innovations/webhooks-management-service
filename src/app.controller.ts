import { BeforeApplicationShutdown, Body, Controller, Get, Inject, OnApplicationBootstrap, OnModuleInit, Post } from '@nestjs/common';
import { Patch, Param, Delete, Request, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { removeUnneccessoryObjectKeys } from './utility/miscellenous';
import { allTopics2 } from './app.topics';
import { KafkaAdminService } from './app.kafka.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { ServiceTopicDocument } from './Schema/ServiceTopicsSchema';
import { error } from 'console';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { availableServices } from './available-services/available-services.service';
import { Router } from './utility/router';
//import { availableServicesService } from '../src/available-services/available-services.service';
const config = new ConfigService();
import { MessagePattern } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const serviceFunctionMap = {
  "webhook-service-event": "supplyEvents"
}

const allServiceNames = [
  "INVENTORY_MANAGEMENT_SERVICE",
  "ORDER_MANAGEMENT_SERVICE",
  "USER_MANAGEMENT_SERVICE",
  "ADMIN_MANAGEMENT_SERVICE",
  "LOCATION_MANAGEMENT_SERVICE",
  "FLEET_MANAGEMENT_SERVICE",
  "MEDIA_MANAGEMENT_SERVICE",
  "GCS_SERVICE",
  "CONTENT_MANAGEMENT_SERVICE",
  "TRANSACTIONAL_LOG_SERVICE",
  "ACTIVITY_LOG_SERVICE",
  "SYSTEM_LOG_SERVICE",
  "SHIPMENT_MANAGEMENT_SERVICE",
  "NOTIFICATION_MANAGEMENT_SERVICE",
  "DOCUMENTATION_MANAGEMENT_SERVICE "
]
const allServiceDetails = {}

const getAllConfigData = () => {
  allServiceNames.forEach(service => {
    console.log("allServiceNames.forEach", service)
    const link = config.get(service);
    // const controller = config.get(service + "_CONTROLLER");
    allServiceDetails[service] = { link }
    // console.log(config.get(service),"{ port, link, controller }",{ port, link, controller }, port, link, controller )
  });
  console.log("allServiceDetails", allServiceDetails)
}
@Controller()

export class AppController implements OnModuleInit, OnApplicationBootstrap, BeforeApplicationShutdown {

  @Post()
  handleHttpReq(@Request() req: any, resp: Response) {
    console.log("req.body=", req.body)
    const request = req.body;
    const { topic, body, headers, method, param, query } = request;

    if (serviceFunctionMap[topic] !== undefined)

      return this[serviceFunctionMap[topic]](request, 'http')

    return { status: "failed", message: "invalid request" }
  }

  private serviceRouter = {}

  private _microserviceName = "webhook-management"
  private USER_SERVICE_LINK = config.get("WEBHOOK_MANAGEMENT_SERVICE")


  private topicsToAdd = {}
  private topics = []
  availableServicesService: any;
  constructor(private readonly appService: AppService,
    private readonly kafkaAdminService: KafkaAdminService,
    @InjectModel("serviceTopicInfo") public serviceTopic: Model<ServiceTopicDocument>,
    public readonly availableServices: availableServices,
    @Inject("KAFKA_CLIENT") private client: ClientKafka) {
    getAllConfigData()

    const topicControllers = Object.keys(allTopics2); //get all keys froms controllers
    console.log("topicControllers", topicControllers)
    const allTopicsToCreate = {}
    topicControllers.forEach((controller) => {   // get topics ready from all controllers
      allTopics2[controller].forEach(topic => {
        allTopicsToCreate[topic.topicName] = { ...topic } //create new object so that we dont change orignal object contents
      })
    })

    console.log("allTopicsToCreate", allTopicsToCreate)
    this.topicsToAdd = allTopicsToCreate; // add topics from all controllers to be handled in onApplicationBootstrap
  }
  public defaultProtocol = 'rpc'
  async onApplicationBootstrap() {
    console.log("onApplicationBootstrap");
   this.broadcast(1);
  }

  async beforeApplicationShutdown() {
    console.log("beforeApplicationShutdown");
   this.broadcast(2);
  }
  private webhookTopicsTosubscribe = ["service-activity"]
  async onModuleInit() {
    this.webhookTopicsTosubscribe.forEach(topic => {
      this.client.subscribeToResponseOf(topic)
    })
    await this.client.connect();
    // try {
    //   console.log("allServiceNames=", allServiceNames)
    //   const allServicePromisses = await allServiceNames.map(async (serviceItem) => {
    //     console.log(" allServiceDetails[serviceItem]=",  allServiceDetails[serviceItem])
    //    const SERVICE_LINK = allServiceDetails[serviceItem].link // get specific service link
    //     const router = new Router()
    //     this.serviceRouter[serviceItem] = router
    //     const getTopicsResp = await axios(
    //       `${SERVICE_LINK}/get-active-event`,
    //     );
    //     // console.log(serviceName,"getTopicsResp", getTopicsResp.data.data)
    //     const allTopics = getTopicsResp.data.data.topics;

    //     const {serviceName, events } = allTopics;
    //     return this.availableServices.supplyEvent(allTopics, this.defaultProtocol);


    //   });
    // } catch (error) {
    //   console.trace(error);
    // }



    console.log("onModuleInit");
    const allTopicNames = Object.keys(this.topicsToAdd) //get all topic keys 
    console.log("allTopicNames", allTopicNames)

    const foundTopics = await this.serviceTopic.find({ serviceName: this._microserviceName, topicName: { $in: allTopicNames } })
    // console.log("foundTopics", foundTopics)

    const topicsNotToAddToDB = foundTopics.map((topic) => topic.topicName)
    // console.log("topicsNotToAddToDB", topicsNotToAddToDB)

    const topicsToAddToDB = removeUnneccessoryObjectKeys(this.topicsToAdd, topicsNotToAddToDB)
    // console.log("topicsToAddToDB", topicsToAddToDB);

    const topicsToAddToDBNames = Object.keys(topicsToAddToDB)
    // console.log("topicsToAddToDBNames", topicsToAddToDBNames);

    if (topicsToAddToDBNames.length) {
      const writeTopicsToDB = topicsToAddToDBNames.map(topicName => { return topicsToAddToDB[topicName] })
      // console.log("writeTopicsToDB", writeTopicsToDB);

      const createMultipleTopics = await this.serviceTopic.create(writeTopicsToDB);
      // console.log("createMultipleTopics", createMultipleTopics);
    }

    this.topics = await this.serviceTopic.find({ serviceName: this._microserviceName })
    await this.kafkaAdminService.createTopics(this.topics);
  }


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("serviceable-topics")
  getAllTOpics() {
    return { status: "success", message: "topics served by microservice fetched successfully", data: { topics: this.topics } }
  }

  //@Post('active-service-event')
  @MessagePattern('webhookService-app-registerEvents')
  async supplyEvents(@Payload() data: any) {
    try {
      const { serviceName, events } = data;
      return this.availableServices.supplyEvent(data, this.defaultProtocol)
    } catch (error) {
      console.error('Error occurred ', error);
    }
  }

  async broadcast(status) {
    console.log("message Broadcast");
    const topic = "service-activity"
    const payload = {
      topic: "service-activity",
      body: {
        ServiceName: "WEBHOOK_MANAGEMENT_SERVICE",
        status: status
      },
      headers: {},
      method: "POST",
      params: {},
      query: {}
    }
    const kafkaResp = this.client.send(topic, { key: "payload.body.user.userEmail", value: payload });
    const fistrresp= await firstValueFrom(kafkaResp);
    console.log("kafkaResp", fistrresp)
    return true
  }

  @MessagePattern("service-activity")
  helloWebhook(@Payload() payload: any) {
    if(payload.body.status===1){
      console.log(`${payload.body.ServiceName} started successfully`);
    }else{
      console.log(`${payload.body.ServiceName} closed successfully`);
    }
    console.log(payload);
  }

}
