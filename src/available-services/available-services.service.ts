import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAvailableServiceDto } from './dto/create-available-service.dto';
import { UpdateAvailableServiceDto } from './dto/update-available-service.dto';
import { OnRequest } from 'src/interface/on-request.interface';
import { availableServicesTopicDocument } from 'src/Schema/availableService.schema';
import { AvailableServicesModule } from './available-services.module'; 
export class availableServices {
  // AvailableServicesModule: any;
  constructor(
    @InjectModel('availableServicesinfo') public AvailableServicesModule: Model<availableServicesTopicDocument>,
  ) {}

  async create(CreateAvailableServiceDto: CreateAvailableServiceDto): Promise<{ status: string; message: string; data?: availableServicesTopicDocument}> {
    try {
      const isWebhookAlreadyPresent = await this.isWebhookAlreadyPresent(CreateAvailableServiceDto);
      if (isWebhookAlreadyPresent) {
        return { status: 'failed', message: 'Webhook Available Service already exists' };
      }

      const createdWebhook = new this.AvailableServicesModule(CreateAvailableServiceDto);
      await createdWebhook.save();

      if (!createdWebhook) {
        return { status: 'failed', message: 'Unable to create available service' };
      }

      return {
        status: 'success',
        message: 'Webhookservice created successfully',
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


  async isWebhookAlreadyPresent(createWebhookDto: CreateAvailableServiceDto): Promise<boolean> {
    const { serviceName, eventName} = createWebhookDto;
    const webhook = await this.AvailableServicesModule.findOne({ serviceName, eventName}).exec();
    return !!webhook;
  }


  
  async find(
    payload: OnRequest, 
    id?: string
  ): Promise<{ status: string; message: string; data?: any }> {
    try {
      if (id) {
        const webhook = await this.AvailableServicesModule.findById(id).exec();
        if (!webhook) {
          return { status: 'failed', message: `Webhook with id ${id} not found` };
        }
        return {
          status: 'success',
          message: 'Available service retrieved successfully',
          data: webhook,
        };
      }
  
      const query = payload.query;
      const params = payload.param ? payload.param.split(',').map(id => id.trim()) : [];
  
      const conditions: any[] = [];
  
      if (query && Object.keys(query).length > 0) {
        conditions.push(query);
      }
  
      const finalQuery: any = conditions.length > 0 ? { $and: conditions } : {};
  
      // Add '_id' to final query if params are provided
      if (params.length > 0) {
        finalQuery['_id'] = { $in: params };
      }
  
      // Fetch matching webhooks sorted by 'createdAt'
      const webhooks = await this.AvailableServicesModule.find(finalQuery).sort({ createdAt: 'asc' }).exec();
  
      // Return the result based on whether webhooks were found
      if (webhooks.length > 0) {
        return {
          status: 'success',
          message: 'Available service retrieved successfully',
          data: webhooks,
        };
      } else {
        return {
          status: 'failed',
          message: 'No webhooks found',
        };
      }
    } catch (err) {
      console.error('Error in retrieving webhooks:', err.message, err.stack);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          status: 'Failure',
          error: err.message || 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  

  

  async update(
    id: string,
  updateAvailableServiceDto: UpdateAvailableServiceDto,
): Promise<{ status: string; message: string; data?: availableServicesTopicDocument}> {
    try {
        const existingWebhook = await this.AvailableServicesModule.findById(id).exec();
        
       
        if (!existingWebhook) {
            return { status: 'failed', message: `Webhook with id ${id} not found` };
        }

        if (updateAvailableServiceDto.serviceName) {
            existingWebhook.serviceName = updateAvailableServiceDto.serviceName;
        }
       
        if (updateAvailableServiceDto.eventName) {
            existingWebhook.eventName = updateAvailableServiceDto.eventName;
        }
        if (updateAvailableServiceDto.createdBy) {
            existingWebhook.createdBy = updateAvailableServiceDto.createdBy;
        }
        if (updateAvailableServiceDto.updatedBy) {
          existingWebhook.updatedBy = updateAvailableServiceDto.updatedBy;
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
      const webhook = await this.AvailableServicesModule .findById(id).exec();
  
      if (!webhook) {
        return {
          status: 'failed',
          message: `Webhook with id ${id} not found`,
        };
      }
  
      const isDeleted = await this.AvailableServicesModule.deleteOne({ _id: id }).exec();
  
      if (isDeleted.deletedCount === 0) {
        return {
          status: 'failed',
          message: 'Unable to delete webhook availableService',
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
