import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WebhookInvokeService } from './webhook-invoke.service';
import { CreateWebhookInvokeDto } from './dto/create-webhook-invoke.dto';
import { UpdateWebhookInvokeDto } from './dto/update-webhook-invoke.dto';

@Controller('webhook-invoke')
export class WebhookInvokeController {
  constructor(private readonly webhookInvokeService: WebhookInvokeService) {}

  @Post('invoke')
  async invoke(@Body() payload: any) {
    console.log("Received webhook payload:", payload);
    
   
    const result = await this.webhookInvokeService.invoke(payload);
  
    return result;
  }
  @Post('check')
  async check(@Body() payload: any) {
    // console.log("invoke is running successfully", body);
    // const { url, data } = body; // Extracting `url` and `data` from the body
    const result = {status:'success', message:"dummy webhook check success"}
    return result;
  }

  @Post('test')
  async test(@Body() payload: any) {
    // console.log("invoke is running successfully", body);
    // const { url, data } = body; // Extracting `url` and `data` from the body
    const result = await this.webhookInvokeService.check(payload);
    return result;
  }

}