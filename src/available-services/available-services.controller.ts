import { Controller, Get, Post, Body, Patch, Param, Delete , Request, Query, HttpException, HttpStatus} from '@nestjs/common';
import { availableServices } from './available-services.service';
import { CreateAvailableServiceDto } from './dto/create-available-service.dto';
import { UpdateAvailableServiceDto } from './dto/update-available-service.dto';
import { Response } from 'express';
import { OnRequest } from 'src/interface/on-request.interface'; 
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

const serviceFunctionMap = {
  "webhookService-availableServices-create": "create",
  "webhookService-availableServices-find": "find",
  "webhookService-availableServices-update": "update",
  "webhookService-availableServices-remove": "remove",
}

@Controller('available-services')
export class AvailableServicesController {
  constructor(private readonly availableServicesService: availableServices) {}

  @Post("")
  handleHttpReq(@Request() req: any, resp: Response) {
    console.log("req.body=", req.body)
    const request=req.body;
    const { topic, body, headers, method, param, query } = request;
   
    if (serviceFunctionMap[topic] !== undefined)

      return this[serviceFunctionMap[topic]](request)

    return { status: "failed", message: "invalid request" }
  }

  @MessagePattern('webhookService-availableServices-create')
  create(@Payload() request: OnRequest) {

    console.log("webhook-create", request.body)
    return this.availableServicesService.create(request.body);
  }


  @MessagePattern('webhookService-availableServices-find')
  @Get()
  async find(@Query('id') id?: string) {
    return this.availableServicesService.find(id);
  }


  @MessagePattern('webhookService-availableServices-update')
  @Patch('update_by_id/:id')
  async updateById(@Param('id') id: string, @Body() updateAvailableServiceDto: UpdateAvailableServiceDto) {
    return this.availableServicesService.update(id, updateAvailableServiceDto); 
  }

  @MessagePattern('webhookService-availableServices-remove')
  @Delete('delete_by_id/:id')
  async deleteById(@Param('id') id: string) {
    return this.availableServicesService.remove(id); 
  }


}
