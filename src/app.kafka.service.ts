import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Admin, Kafka } from 'kafkajs';




@Injectable()
export class KafkaAdminService implements OnModuleInit {
    config = new ConfigService();
    kafkaBorkers = this.config.get("ALL_KAFKA_BROKERS").split(',')
    private admin: Admin
    private readonly kafka = new Kafka({
        clientId: 'webhook-admin-microservice',
        brokers: [...this.kafkaBorkers], // Replace with your Kafka brokers
    });

    async onModuleInit() {
        this.admin = this.kafka.admin();

        // await this.createTopics(admin);
        // await admin.disconnect();
    }

    async connectAdmin() {
        return await this.admin.connect();
    }
    async createTopics(topicsToCreate) {
        await this.connectAdmin()
        const topicExists = await this.admin.listTopics();
        console.log("topicExists", topicExists)
        let TopicsToCreate = topicsToCreate.filter(topic => !topicExists.includes(topic.topicName))
        TopicsToCreate = TopicsToCreate.map(topic => {
            return {
                topic: topic.topicName,
                numPartitions: 3,
                replicationFactor: 1,
            }
        })
        console.log("TopicsToCreate", TopicsToCreate)

        const replyTopicsToCreate = TopicsToCreate.map(topic => {
            return {
                topic: `${topic.topic}.reply`,
                numPartitions: 3,
                replicationFactor: 1,
            }
        })
        TopicsToCreate = [...TopicsToCreate,...replyTopicsToCreate]

        console.log("TopicsToCreate", TopicsToCreate)
        const topicsCreated = await this.admin.createTopics({ topics: TopicsToCreate, });
        console.log("topicsCreated", topicsCreated)
    }
}