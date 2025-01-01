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
  /**
   * Invokes a webhook based on the provided payload.
   * @param payload - Object containing event details, project name, user email, and data to send.
   * @returns An object with a success message, status, and data about the invocation results.
   */

  async invoke(payload: any) {
    try {
      console.log("webhook-invoke", payload);

      // Extract relevant information from the payload
      const { eventName, projectName, userEmail, data } = payload.body;
      // Find webhooks matching the criteria
      const res = await this.webhookModel.find({ $and: [{ eventName: eventName }, { projectName: projectName }, { userEmail: userEmail }] })
       // Extract callback URLs from the found webhooks
       
      const urls = res.map((webhook) => webhook.callbackLink);
      console.log(urls);

      // Send data to each URL concurrently
      const promises = urls.map((url) => this.sendData(url, data));
      console.log(promises);
      // Wait for all promises to settle and collect results
      const result: any = await Promise.allSettled(promises);
      console.log(result);
       // Process the results
      const rdata = result.map((fresult) => (
        { status: fresult.status, fdata: fresult.value.data }));
      return {
        message: 'Webhook invoked successfully',
        status: "success", data: rdata
      };
    } catch (error) {
      console.error('Error occurred while creating the webhook', error);

    }

  }
  /**
   * Sends data to a specified URL using axios.
   * @param url - The URL to send data to.
   * @param data - The data to be sent.
   * @returns A promise resolving to the axios response.
   */

  async sendData(url, data) {
    return axios(url, {
      method: "POST",
      data: data
    })
  }
   /**
   * Checks if a webhook exists based on the provided payload.
   * @param payload - Object containing event details, project name, user email, and id.
   * @returns An object with a success message, status, and data about the check results.
   */

  async check(payload: any) {
    try {
      console.trace("webhook-invoke", payload);
        
      // Extract relevant information from the payload
      const { eventName, projectName, userEmail, id } = payload;

      // Find available services matching the criteria

      const availableServices = await this.AvailableServicesModule.findOne({
        $and: [
          { eventName: payload.eventName },
          { serviceName: payload.serviceName }
        ]
      });
      console.trace("availableServices", availableServices);
       // Find webhook matching the criteria
      const webhookRes = await this.webhookModel.find({
        $and: [
          { _id: payload.id },
          { eventName: payload.eventName },
          { projectName: payload.projectName },
          { userEmail: payload.userEmail }
        ]
      });

      console.log("webhookRes",webhookRes)
       // Extract callback URLs from the found webhooks
      const urls = webhookRes.map((webhook) => webhook.callbackLink);

      console.log("Callback URLs:", urls); 

        // Send data to each URL concurrently
      const promises = urls.map((url) => this.sendData(url, availableServices.sampleData));

      // Wait for all promises to settle and collect results
      const result: any = await Promise.allSettled(promises);
      console.log(result);

      // Process the results
      const rdata = result.map((fresult) => ({ status: fresult.status, fdata: fresult.value.data }));
      return {
        message: 'Webhook invoked successfully',
        status: "success", data: rdata
      };
    } catch (error) {
      console.error('Error occurred while creating the webhook', error);

    }
  }

  /**
   * Sends data to a specified URL using axios.
   * @param url - The URL to send data to.
   * @param data - The data to be sent.
   * @returns A promise resolving to the axios response.
   */

  
  // //async sendData(url, data) {
  //   return axios(url, {
  //     method: "POST",
  //     data: data
  //   })

  }




