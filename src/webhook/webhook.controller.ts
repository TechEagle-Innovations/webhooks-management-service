import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpException, HttpStatus, Query } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { CreateWebhookDto, CreateWebhookDtoRequest } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { Response } from 'express';
import { OnRequest } from 'src/interface/on-request.interface';
import { FindWebhookDtoRequest } from './dto/find-webhook.dto';
import { validateDto } from 'src/utility/validate-dto';
import { RemoveWebhookDtoRequest } from './dto/remove.webhook.dto';

const serviceFunctionMap = {
  "webhookService-webhook-create": "create",
  "webhookservice-webhook-find": "find",
  "webhookService-folder-update": "update",
  " webhookService-webhook-remove": "remove"
}

const defaultProtocol= 'rpc'

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) { }

  @Post()
  handleHttpReq(@Request() req: any, resp: Response) {
    console.log("req.body=", req.body)
    const request = req.body;
    const { topic, body, headers, method, param, query } = request;

    if (serviceFunctionMap[topic] !== undefined)

      return this[serviceFunctionMap[topic]](request, 'http')

    return { status: "failed", message: "invalid request" }
  }

  @MessagePattern('webhookService-webhook-create')
  create(@Payload() request: CreateWebhookDtoRequest, protocol= defaultProtocol) {

    console.log("webhook-create", request.body)
    return this.webhookService.create(request.body, protocol);
  }

  
  @MessagePattern('webhookService-webhook-find')
 async find(@Payload() request: FindWebhookDtoRequest, protocol= defaultProtocol) {
    
    return this.webhookService.find(request, protocol)

  }

  @MessagePattern('webhookService-webhook-update')
  update(@Payload() request: OnRequest, protocol= defaultProtocol) {
    return this.webhookService.update(request.body.id, request.body, protocol);
  }


  @MessagePattern('webhookService-webhook-remove')
  async remove(@Payload() request: RemoveWebhookDtoRequest, protocol= defaultProtocol) {
     const id = request.body.id;
    return this.webhookService.remove(id, protocol);
  }



}
