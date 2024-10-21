import { Controller, Get, Post, Body, Patch, Param, Delete , Request, HttpException, HttpStatus, Query } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { OnRequest } from 'src/interface/on-request.interface'; 

const serviceFunctionMap = {
  "webhookservice-webhook-create": "create",
  "webhookservice-webhook-find": "find",
  "webhookService-folder-update": "update",
}

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}


    
  @Post("new")
  handleHttpReq(@Request() req: any, resp: Response) {
    console.log("req.body=", req.body)
    const request=req.body;
    const { topic, body, headers, method, param, query } = request;
   
    if (serviceFunctionMap[topic] !== undefined)

      return this[serviceFunctionMap[topic]](request)

    return { status: "failed", message: "invalid request" }
  }

  @MessagePattern('webhookService-webhook-create')
  create(@Payload() request: OnRequest) {

    console.log("webhook-create")
    return this.webhookService.create(request.body);
  }
  
  // @Get("get_all")
  // @MessagePattern('webhookService-webhook-find')
  // find(@Payload() request: OnRequest) {
  //   return this.webhookService.find(request);
  // }
  @MessagePattern('webhookService-webhook-find')
  @Get('get')
  async find(@Query('id') id?: string) {
    try {
      const payload: OnRequest = {
        topic: 'webhook-fetch',
        body: {},
        headers: {},
        method: 'GET',
        param: id || '',
        query: id ? {} : {}, 
      };

      return await this.webhookService.find(payload);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          status: 'Failure',
          error: error.message || 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @MessagePattern('webhookService-webhook-update')
  @Patch('update_by_id/:id')
  async updateById(@Param('id') id: string, @Body() updateWebhookDto: UpdateWebhookDto) {
    return this.webhookService.update(id, updateWebhookDto); 
  }


  @Delete('delete_by_id/:id')
  async deleteById(@Param('id') id: string) {
    return this.webhookService.remove(id); 
  }

  @MessagePattern('webhookService-webhook-remove')
  remove(@Payload() request: OnRequest) {
    const id = request.body.id; 
    return this.webhookService.remove(id); 
  }


}
