import { Controller, Get, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { removeUnneccessoryObjectKeys } from './utility/miscellenous';
import { allTopics2 } from './app.topics';
import { KafkaAdminService } from './app.kafka.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { ServiceTopicDocument } from './Schema/ServiceTopicsSchema';
const config = new ConfigService();
@Controller()
export class AppController implements OnModuleInit, OnApplicationBootstrap {

  private _microserviceName = "webhook-management"
  private USER_SERVICE_LINK = config.get("WEBHOOK_MANAGEMENT_SERVICE")


  private topicsToAdd = {}
  private topics = []
  constructor(private readonly appService: AppService, private readonly kafkaAdminService: KafkaAdminService, @InjectModel("serviceTopicInfo") public serviceTopic: Model<ServiceTopicDocument>) {
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
  async onApplicationBootstrap() {
    console.log("onApplicationBootstrap");
    

  }
  async onModuleInit() {

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
}
