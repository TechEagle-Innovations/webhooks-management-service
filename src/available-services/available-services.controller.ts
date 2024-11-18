import { Controller, Get, Post, Body, Patch, Param, Delete , Request, Query, HttpException, HttpStatus} from '@nestjs/common';
import { availableServices } from './available-services.service';
import { CreateAvailableServiceDto, CreateAvailableServiceDtoRequest } from './dto/create-available-service.dto';
import { UpdateAvailableServiceDto, UpdateAvailableServiceDtoRequest } from './dto/update-available-service.dto';
import { Response } from 'express';
import { OnRequest } from 'src/interface/on-request.interface'; 
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { FindAvailableServiceDto, FindAvailableServiceDtoRequest } from './dto/find-available-service.dto';
import { validateDto } from 'src/utility/validate-dto';
import { RemoveAvailableServiceDto, RemoveAvailableServiceDtoRequest } from './dto/remove.available-service.dto';

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
  
    return this.availableServicesService.find(request,protocol)

  }
  


  @MessagePattern('webhookService-availableServices-update')
  async update(@Payload() request: UpdateAvailableServiceDtoRequest, protocol= defaultProtocol) {
    console.log("CONTROLLER body", request);
    return this.availableServicesService.update(request.params.id,request.body,protocol); 
  }

  @MessagePattern('webhookService-availableServices-remove')
  async remove(@Payload() request: RemoveAvailableServiceDtoRequest, protocol= defaultProtocol) {
    const id = request.body.id;
   return this.availableServicesService.remove(id, protocol);
 }

//  @Post('again')
//  async supplyEvents(@Payload() data:any, protocol=defaultProtocol){
//   const { serviceName, events } = data;
//   return this.availableServicesService.supplyEvent(data, protocol)


  
  //  try {
  //   console.log("data", data);
  //    const {serviceName, events}=data;
  //    const promises=events.map((eventName)=> this.availableServicesService.create({serviceName, eventName, sampleData:"sampleData"},protocol))
  //    const result:any = await Promise.allSettled(promises);
  //    const rdata = result.map((fresult) => ({ status: fresult.status, fdata: fresult.value.data }));
  //    return {
  //      message: 'Webhook invoked successfully',
  //      status: "success", data: rdata
  //    };
  
  //  } catch (error) {
  //    console.error('Error occurred ', error);
     
//  //  }
 //}
}
