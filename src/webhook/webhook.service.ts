import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { webhookTopicDocument} from 'src/Schema/webhook.schema';
import { OnRequest } from 'src/interface/on-request.interface';

@Injectable()
export class WebhookService {
  constructor(
    @InjectModel('webhookinfo') public webhookModel: Model<webhookTopicDocument>,
  ) {}

  async create(createWebhookDto: CreateWebhookDto): Promise<{ status: string; message: string; data?: webhookTopicDocument }> {
    try {
     
      const isWebhookAlreadyPresent = await this.isWebhookAlreadyPresent(createWebhookDto);
      if (isWebhookAlreadyPresent) {
        return { status: 'failed', message: 'Webhook already exists' };
      }
  
      const user = {
        userId: createWebhookDto.user.userId,
        userEmail: createWebhookDto.user.userEmail,
      };
  
      const webhookData = {
        projectName: createWebhookDto.projectName,
        eventName: createWebhookDto.eventName,
        userId: createWebhookDto.user.userId,
        userEmail: createWebhookDto.user.userEmail,
        callbackLink: createWebhookDto.callbackLink,
        serviceName: createWebhookDto.serviceName,
      };
  
     
      const createdWebhook = new this.webhookModel(webhookData);
      await createdWebhook.save();
  
      if (!createdWebhook) {
        return { status: 'failed', message: 'Unable to create webhook' };
      }
  
      return {
        status: 'success',
        message: 'Webhook created successfully',
        data: createdWebhook,
      };
    } catch (err) {
      console.error('Error occurred while creating the webhook', err);
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          status: 'Failure',
          error: err.message || 'Internal Server Error',
        },
        HttpStatus.FORBIDDEN,
        {
          cause: err,
        },
      );
    }
  }
  

  async isWebhookAlreadyPresent(createWebhookDto: CreateWebhookDto): Promise<boolean> {
    const { callbackLink, user} = createWebhookDto;
    const webhook = await this.webhookModel.findOne({ callbackLink, user}).exec();
    return !!webhook;
  }

  

  async find(
    payload: OnRequest, 
    id?: string
  ): Promise<{ status: string; message: string; data?: any }> {
    try {
   
      if (id) {
        const webhook = await this.webhookModel.findById(id).exec();
        if (!webhook) {
          return { status: 'failed', message: `Webhook with id ${id} not found` };
        }
        return {
          status: 'success',
          message: 'Webhook retrieved successfully',
          data: webhook,
        };
      }
  
     
      const query = payload.query;
      const params = payload.param ? payload.param.split(',') : [];
  
      const conditions: any[] = [];
  
      if (query && Object.keys(query).length > 0) {
        conditions.push(query);
      }
  
      const finalQuery: any = conditions.length > 0 ? { $and: conditions } : {};
  
      if (params.length > 0) {
        finalQuery['_id'] = { $in: params.map(id => id.trim()) };
      }
  
      const webhooks = await this.webhookModel.find(finalQuery).sort({ createdAt: 'asc' }).exec();
  
      if (webhooks.length > 0) {
        return {
          status: 'success',
          message: 'Webhooks retrieved successfully',
          data: webhooks,
        };
      } else {
        return {
          status: 'failed',
          message: 'No webhooks found',
        };
      }
    } catch (err) {
      console.error('Error in retrieving webhooks:', err);
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          status: 'Failure',
          error: err.message || 'Internal Server Error',
        },
        HttpStatus.FORBIDDEN,
        { cause: err },
      );
    }
  }
  
 
  async update(
    id: string,
    updateWebhookDto: UpdateWebhookDto,
): Promise<{ status: string; message: string; data?: webhookTopicDocument }> {
    try {
        const existingWebhook = await this.webhookModel.findById(id).exec();
        
       
        if (!existingWebhook) {
            return { status: 'failed', message: `Webhook with id ${id} not found` };
        }

        if (updateWebhookDto.projectName) {
            existingWebhook.projectName = updateWebhookDto.projectName;
        }
        if (updateWebhookDto.user) { 
            if (updateWebhookDto.user.userEmail) {
                existingWebhook.userEmail = updateWebhookDto.user.userEmail;
            }
            if (updateWebhookDto.user.userId) {
                existingWebhook.userId = updateWebhookDto.user.userId;
            }
        }
        if (updateWebhookDto.callbackLink) {
            existingWebhook.callbackLink = updateWebhookDto.callbackLink;
        }
        if (updateWebhookDto.serviceName) {
            existingWebhook.serviceName = updateWebhookDto.serviceName;
        }

        const updatedWebhook = await existingWebhook.save();

        return {
            status: 'success',
            message: 'Webhook updated successfully',
            data: updatedWebhook,
        };
    } catch (error) {
        console.error('Error occurred while updating webhook:', error);

        throw new HttpException(
            {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR, 
                status: 'Failure',
                error: error.message || 'Internal Server Error',
            },
            HttpStatus.INTERNAL_SERVER_ERROR, 
            {
                cause: error,
            },
        );
    }
}

  
  

async remove(id: string): Promise<{ status: string; message: string }> {
  try {
    const webhook = await this.webhookModel.findById(id).exec();

    if (!webhook) {
      return {
        status: 'failed',
        message: `Webhook with id ${id} not found`,
      };
    }

    const isDeleted = await this.webhookModel.deleteOne({ _id: id }).exec();

    if (isDeleted.deletedCount === 0) {
      return {
        status: 'failed',
        message: 'Unable to delete webhook',
      };
    }

    return {
      status: 'success',
      message: 'Webhook deleted successfully',
    };
  } catch (error) {
    console.error('Error occurred while deleting webhook:', error);
    throw new HttpException(
      {
        statusCode: HttpStatus.FORBIDDEN,
        status: 'Failure',
        error: error.message || 'Internal Server Error',
      },
      HttpStatus.FORBIDDEN,
      {
        cause: error,
      },
    );
  }
}
}
