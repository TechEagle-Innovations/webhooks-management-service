import { IsString, IsOptional } from 'class-validator';
import { Injectable, HttpException, HttpStatus, BadRequestException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { webhookTopicDocument } from 'src/Schema/webhook.schema';
import { OnRequest } from 'src/interface/on-request.interface';
import { FindWebhookDto, FindWebhookDtoRequest } from './dto/find-webhook.dto';
import { throwException } from 'src/utility/throwError';
import { availableServicesTopicDocument, availableServicesTopicsSchema } from 'src/Schema/availableService.schema';

/**
 * Service for managing webhooks.
 */
@Injectable()
export class WebhookService {
  constructor(
    @InjectModel('webhookinfo') public webhookModel: Model<webhookTopicDocument>,
    @InjectModel('availableServicesinfo') public AvailableServicesModule: Model<availableServicesTopicDocument>,
  ) { }

  /**
   * Creates a new webhook.
   * @param createWebhookDto DTO containing webhook creation details.
   * @returns A promise resolving to an object containing the status, message, and created webhook data.
   */

  async create(createWebhookDto: CreateWebhookDto, protocol: string): Promise<{ status: string; message: string; data?: webhookTopicDocument }> {
    try {
       console.log("createWebhookDto",createWebhookDto);
   
       if(createWebhookDto.projectName !==createWebhookDto.user.projectName){
       throw new UnauthorizedException()
       }

      // Check if a webhook with the same callback link, user email, and service name already exists
      const isWebhookAlreadyPresent = await this.isWebhookAlreadyPresent(createWebhookDto);
      if (isWebhookAlreadyPresent) {
        throw new BadRequestException('Webhook Already Exists');
      }

  
      // Verify if the serviceName exists in available services collection in MongoDB
      const isServiceAvailable = await this.AvailableServicesModule.findOne({ serviceName: createWebhookDto.serviceName });
      if (!isServiceAvailable) {
        throw new BadRequestException('Service name does not exist in available services');
      }
  
      // Prepare user object
      const user = {
        userEmail: createWebhookDto.user.userEmail,
      };
  
      // Prepare webhook data object
      const webhookData = {
        projectName: createWebhookDto.user.projectName,
        eventName: createWebhookDto.eventName,
        userEmail: user.userEmail,
        callbackLink: createWebhookDto.callbackLink,
        serviceName: createWebhookDto.serviceName,
      };
  
      // Create new webhook document
      const createdWebhook = new this.webhookModel(webhookData);
      await createdWebhook.save();
  
      if (!createdWebhook) {
        throw new InternalServerErrorException('Failed to create webhook');
      }
  
      return {
        status: 'success',
        message: 'Webhook created successfully',
        data: createdWebhook,
      };
    } catch (error) {
      console.error('Error occurred while creating the webhook', error);
      const message = error.response?.message || 'Internal Server Error';
      const statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      throwException(protocol, statusCode, message);
    }
  }
  
  /**
   * Checks if a webhook with the same callback link, user email, and service name already exists.
   * @param createWebhookDto DTO containing webhook creation details.
   * @returns A promise resolving to a boolean indicating whether the webhook already exists.
   */
  async isWebhookAlreadyPresent(createWebhookDto: CreateWebhookDto): Promise<boolean> {
    const { user, eventName } = createWebhookDto;
  
    // Check if a webhook with the same callbackLink, userEmail, and serviceName exists
    const webhook = await this.webhookModel.findOne({
      //callbackLink,
      userEmail: user.userEmail,
      //serviceName,
      eventName,
    }).exec();
  
    return !!webhook;
  }
  
  
  


  /**
   * Finds all webhooks based on the provided payload.
   * @param payload Payload containing user, query parameters, and route parameters.
   * @returns A promise resolving to an object containing the status, message, and found webhooks.
   */
   async find(payload: FindWebhookDtoRequest, protocol: string) {
    console.log("webhook-create", payload);

    // Extract necessary information from payload
    const user = payload.body.user;
    const query = payload.query;
    const params = payload.params["id"] ? payload.params["id"].split(",") : [];

    try {
      // Prepare conditions array for filtering
      const conditions: any[] = [];
      conditions.push({ projectName: user.projectName });

      // Add query parameters to conditions if present
      if (query && Object.keys(query).length) {
        conditions.push(query);
      }

      // Create query parameter object
      const queryParam = { $and: conditions };

      // Add _id condition if params are present
      if (params.length) {
        queryParam['_id'] = { $in: params };
      }

      // Execute find query
      const findAllwebhook = await this.webhookModel.find(queryParam).exec();

      // Check if webhooks were found
      if (!findAllwebhook.length) {
        //return { status: "failed", message: "Unable to get webhook" };
        throw new NotFoundException('Error in getting available services');
      }

      // Return successful response with found webhooks
      return { status: "success", message: "All webhook received successfully", data: findAllwebhook };
    } catch (err) {
      console.log(err);
      const message = err.response.message;
      const statusCode = err.status;
   throwException(protocol, statusCode, message);
      // throw new HttpException(
      //   {
      //     statusCode: HttpStatus.FORBIDDEN,
      //     status: 'Failure',
      //     error: err.response,
      //   },
      //   HttpStatus.FORBIDDEN,
      //   { cause: err },
      // );
    }
  }


  /**
 * Finds events based on the provided service name and returns the count of available events.
 * @param serviceName The name of the service to search for events.
 * @returns A promise resolving to an object containing the status, message, event count, and events list.
 */
  async findByServiceName(payload: FindWebhookDtoRequest, serviceName: string, protocol: string) {
    try {
      console.log("webhookservice-create", payload);
   
      if (payload.body.user.projectName !== payload.body.projectName) {
        throw new UnauthorizedException('project name is required');
      }


      // Check if serviceName is provided in the request
      if (!serviceName) {
        throw new NotFoundException('Service name is required to find webhooks');
      }

      // Query the webhooks by service name and retrieve the available events
      const webhooks = await this.webhookModel.find({ serviceName }).exec();

      if (!webhooks.length) {
        throw new NotFoundException(`No webhooks found for service name: ${serviceName}`);
      }

      // Return the list of available events
      return {
        status: 'success',
        message: 'Events retrieved successfully',
        data: webhooks.map((webhook) => webhook.eventName),
      };
    } catch (error) {
      console.error('Error finding webhooks by service name:', error);
      throw new NotFoundException(error.message || 'Internal Server Error');
    }
  }


  /**
   * Updates an existing webhook.
   * @param id The ID of the webhook to update.
   * @param updateWebhookDto DTO containing updated webhook details.
   * @returns A promise resolving to an object containing the status, message, and updated webhook data.
   */
  async update(id: string, updateWebhookDto: UpdateWebhookDto, protocol: string): Promise<any> {
    console.log(id, updateWebhookDto);

    try {
      // Find the webhook to update
      const foundWebhook = await this.webhookModel.findById(id).exec();

      // Check if webhook exists
      if (!foundWebhook) {
        return {
          status: 'failed',
          message: `Webhook with id ${id} not found`,
        };
      }

      // Get old and new callback links
      const oldCallbackLink = foundWebhook.callbackLink;
      const newCallbackLink = updateWebhookDto.callbackLink || oldCallbackLink;

      // Perform partial update
      const updatedWebhook = await this.webhookModel.updateOne(
        { _id: id },
        {
          $set: {
            projectName: updateWebhookDto?.projectName || foundWebhook.projectName,
            eventName: updateWebhookDto?.eventName || foundWebhook.eventName,
            userEmail: updateWebhookDto?.user?.userEmail || foundWebhook.userEmail,
            callbackLink: newCallbackLink,
            serviceName: updateWebhookDto?.serviceName || foundWebhook.serviceName,
          },
        }
      );

      // Update foundWebhook object with new values
      foundWebhook.projectName = updateWebhookDto?.projectName;
      foundWebhook.callbackLink = newCallbackLink;

      // Check if update was successful
      if (!updatedWebhook) {
        return {
          status: 'failed',
          message: `Unable to update webhook with id ${id}`,
        };
      }

      // Return successful response with updated webhook
      return {
        status: 'success',
        message: `Webhook with id ${id} updated successfully`,
        data: {
          updatedWebhook: foundWebhook,
        },
      };
    } catch (error) {
      console.error('Error occurred while updating webhook info:', error);
      const message = error.response.message;
      const statusCode = error.status;
      throwException(protocol, statusCode, message);

      // Handle error and throw an HTTP exception
      // throw new HttpException(
      //   {
      //     statusCode: HttpStatus.FORBIDDEN,
      //     status: 'Failure',
      //     error: error.message || 'Internal Server Error',
      //   },
      //   HttpStatus.FORBIDDEN,
      //   {
      //     cause: error,
      //   },
      // );
    }
  }

  /**
   * Removes a webhook by its ID.
   * @param id The ID of the webhook to remove.
   * @returns A promise resolving to an object containing the status and message.
   */

async remove(id: string, protocol: string): Promise<{ status: string; message: string }> {
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
    const message = error.response.message;
    const statusCode = error.status;
    throwException(protocol, statusCode, message);
    // throw new HttpException(
    //   {
    //     statusCode: HttpStatus.FORBIDDEN,
    //     status: 'Failure',
    //     error: error.message || 'Internal Server Error',
    //   },
    //   HttpStatus.FORBIDDEN,
    //   {
    //     cause: error,
    //   },
    // );
  }
}
}
