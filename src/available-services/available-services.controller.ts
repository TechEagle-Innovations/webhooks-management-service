import { Controller, Get, Post, Body, Patch, Param, Delete , Request, Query, HttpException, HttpStatus} from '@nestjs/common';
import { availableServices } from './available-services.service';
import { CreateAvailableServiceDto, CreateAvailableServiceDtoRequest } from './dto/create-available-service.dto';
import { UpdateAvailableServiceDto } from './dto/update-available-service.dto';
import { Response } from 'express';
import { OnRequest } from 'src/interface/on-request.interface'; 
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { FindAvailableServiceDto, FindAvailableServiceDtoRequest } from './dto/find-available-service.dto';
import { validateDto } from 'src/utility/validate-dto';

const serviceFunctionMap = {
  "webhookService-availableServices-create": "create",
  "webhookService-availableServices-find": "find",
  "webhookService-availableServices-update": "update",
  "webhookService-availableServices-remove": "remove",
}

const defaultProtocol= 'rpc'

@Controller('available-services')
export class AvailableServicesController {
  constructor(private readonly availableServicesService: availableServices) {}

  @Post()
  handleHttpReq(@Request() req: any, resp: Response) {
    console.log("req.body=", req.body)
    const request=req.body;
    const { topic, body, headers, method, params, query } = request;
   
    if (serviceFunctionMap[topic] !== undefined)

      return this[serviceFunctionMap[topic]](request,'http')

    return { status: "failed", message: "invalid request" }
  }

  @MessagePattern('webhookService-availableServices-create')
  create(@Payload() request: CreateAvailableServiceDtoRequest, protocol= defaultProtocol) {

    console.log("event-create", request.body)
    return this.availableServicesService.create(request.body, protocol);
  }


  @MessagePattern('webhookService-availableServices-find')
  async find(@Payload() request: FindAvailableServiceDtoRequest,protocol= defaultProtocol) {
    // const validationResult = await validateDto(FindAvailableServiceDtoRequest, request);
    // if (validationResult) {
    //   return validationResult;
    // }
   
    return this.availableServicesService.find(request,protocol)

  }
  // async find(@Query('id') id?: string) {
  //   return this.availableServicesService.find(id);
  // }
  // async find(@Query() request: FindAvailableServiceDtoRequest) {
  //   return this.availableServicesService.find(id);
  // }


  @MessagePattern('webhookService-availableServices-update')
  async updateById(@Param('id') id: string, @Body() updateAvailableServiceDto: UpdateAvailableServiceDto,protocol= defaultProtocol) {
    return this.availableServicesService.update(id, updateAvailableServiceDto,protocol); 
  }

  @MessagePattern('webhookService-availableServices-remove')
  async deleteById(@Param('id') id: string,protocol= defaultProtocol) {
    return this.availableServicesService.remove(id,protocol); 
  }


}
