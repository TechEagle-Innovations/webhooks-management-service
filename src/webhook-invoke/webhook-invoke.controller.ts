
import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpException, HttpStatus, Query } from '@nestjs/common';
import { WebhookInvokeService } from './webhook-invoke.service';
import { CreateWebhookInvokeDto } from './dto/create-webhook-invoke.dto';
import { UpdateWebhookInvokeDto } from './dto/update-webhook-invoke.dto';
import { MessagePattern } from '@nestjs/microservices';

const serviceFunctionMap = {
  "webhookService-invoke-function": "invoke",
  "webhookService-invoke-check": "check",
  "webhookService-invoke-test": "test"
  
}


@Controller('webhook-invoke')
export class WebhookInvokeController {
  constructor(private readonly webhookInvokeService: WebhookInvokeService) {}


  @Post()
  handleHttpReq(@Request() req: any, resp: Response) {
    console.log("req.body=", req.body)
    const request = req.body;
    const { topic, body, headers, method, param, query } = request;

    if (serviceFunctionMap[topic] !== undefined)

      return this[serviceFunctionMap[topic]](request, 'http')

    return { status: "failed", message: "invalid request" }
  }


  @Post('invoke')

  @MessagePattern('webhookService-invoke-function')
  async invoke(@Body() payload: any) {
    console.log("Received webhook payload:", payload);
    const result = await this.webhookInvokeService.invoke(payload);
    return result;
  }

  @MessagePattern('webhookService-invoke-check')
  @Post('check')
  async check(@Body() payload: any) {
    const result = {status:'success', message:"dummy webhook check success"}
    return result;
  }
  
  @MessagePattern('webhookService-invoke-test')
   @Post('test')
  async test(@Body() payload: any) {
    const result = await this.webhookInvokeService.check(payload);
    return result;
  }

}