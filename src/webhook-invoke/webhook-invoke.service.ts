import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateWebhookInvokeDto } from './dto/create-webhook-invoke.dto';
import { UpdateWebhookInvokeDto } from './dto/update-webhook-invoke.dto';
import { WebhookModule } from 'src/webhook/webhook.module';
import { webhookTopicDocument } from 'src/Schema/webhook.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import { availableServicesTopicDocument } from 'src/Schema/availableService.schema';


@Injectable()
export class WebhookInvokeService {
  constructor(
    @InjectModel('webhookinfo') public webhookModel: Model<webhookTopicDocument>,
    @InjectModel('availableServicesinfo') public AvailableServicesModule: Model<availableServicesTopicDocument>,

  ) { }

  async invoke(payload: any) {
    try {
      console.log("webhook-invoke", payload);
      const { eventName, projectName, userEmail, data } = payload;
      const res = await this.webhookModel.find({ $and: [{ eventName: payload.eventName }, { projectName: payload.projectName }, { userEmail: payload.userEmail }] })
      const urls = res.map((webhook) => webhook.callbackLink);
      console.log(urls);
      const promises = urls.map((url) => this.sendData(url, data));
      const result: any = await Promise.allSettled(promises);
      console.log(result);
      const rdata = result.map((fresult) => ({ status: fresult.status, fdata: fresult.value.data }));
      return {
        message: 'Webhook invoked successfully',
        status: "success", data: rdata
      };
    } catch (error) {
      console.error('Error occurred while creating the webhook', error);

    }

  }

  async sndData(url, data) {
    return axios(url, {
      method: "POST",
      data: data
    })
  }

  async check(payload: any) {
    try {
      console.trace("webhook-invoke", payload);
      const { eventName, projectName, userEmail, id } = payload;

      const availableServices = await this.AvailableServicesModule.findOne({
        $and: [
          { eventName: payload.eventName },
          { serviceName: payload.serviceName }
        ]
      });
      console.trace("availableServices", availableServices);
      const webhookRes = await this.webhookModel.find({
        $and: [
          { _id: payload.id },
          { eventName: payload.eventName },
          { projectName: payload.projectName },
          { userEmail: payload.userEmail }
        ]
      });

      console.log("webhookRes",webhookRes)
      const urls = webhookRes.map((webhook) => webhook.callbackLink);
      console.log("Callback URLs:", urls); 


      const promises = urls.map((url) => this.sendData(url, availableServices.sampleData));
      const result: any = await Promise.allSettled(promises);
      console.log(result);
      const rdata = result.map((fresult) => ({ status: fresult.status, fdata: fresult.value.data }));
      return {
        message: 'Webhook invoked successfully',
        status: "success", data: rdata
      };
    } catch (error) {
      console.error('Error occurred while creating the webhook', error);

    }
  }

  async sendData(url, data) {
    return axios(url, {
      method: "POST",
      data: data
    })

  }

}