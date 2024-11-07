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
  check(@Body() body:any){
     console.log("invoke is running successfully",body);
     return {status:"success", message:"good", data:body};
  }
}
