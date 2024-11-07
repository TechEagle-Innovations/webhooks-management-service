import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateWebhookInvokeDto } from './dto/create-webhook-invoke.dto';
import { UpdateWebhookInvokeDto } from './dto/update-webhook-invoke.dto';
import { WebhookModule } from 'src/webhook/webhook.module';
import { webhookTopicDocument } from 'src/Schema/webhook.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';


@Injectable()
export class WebhookInvokeService {
  constructor(
    @InjectModel('webhookinfo') public webhookModel: Model<webhookTopicDocument>,

  ) { }

  async invoke(payload: any) {
    try {
      console.log("webhook-invoke", payload);
      const { eventName, projectName, userEmail, data } = payload;
      const res = await this.webhookModel.find({ $and: [{ eventName: payload.eventName }, { projectName: payload.projectName }, { userEmail: payload.userEmail }] })
      const urls = res.map((webhook) => webhook.callbackLink);
      console.log(urls);
      const promises = urls.map((url) => this.sendData(url, data));
      const result:any = await Promise.allSettled(promises);
      console.log(result);
      const rdata = result.map((fresult) => ({ status: fresult.status, fdata: fresult.value.data }));
      return {
        message: 'Webhook invoked successfully',
        status: "success", data:rdata
      };
    } catch (error) {
      console.error('Error occurred while creating the webhook', error);
      // const message = error.response?.message || 'Internal Server Error';
      // const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      // throwException(protocol, statusCode, message);
    }

  }

  async sendData(url, data) {
    return axios(url, {
      method: "POST",
      data: data
    })
  }
}

