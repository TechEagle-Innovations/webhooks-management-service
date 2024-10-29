import { IsString, IsOptional } from 'class-validator';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { webhookTopicDocument } from 'src/Schema/webhook.schema';
import { OnRequest } from 'src/interface/on-request.interface';
import { FindWebhookDto, FindWebhookDtoRequest } from './dto/find-webhook.dto';

/**
 * Service for managing webhooks.
 */
@Injectable()
export class WebhookService {
  constructor(
    @InjectModel('webhookinfo') public webhookModel: Model<webhookTopicDocument>,
  ) { }

  /**
   * Creates a new webhook.
   * @param createWebhookDto DTO containing webhook creation details.
   * @returns A promise resolving to an object containing the status, message, and created webhook data.
   */
  async create(createWebhookDto: CreateWebhookDto): Promise<{ status: string; message: string; data?: webhookTopicDocument }> {
    try {
      // Check if a webhook with the same callback link and user already exists
      const isWebhookAlreadyPresent = await this.isWebhookAlreadyPresent(createWebhookDto);
      if (isWebhookAlreadyPresent) {
        return { status: 'failed', message: 'Webhook already exists' };
      }

      // Prepare user object
      const user = {
        // userId: createWebhookDto.user._id,
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

      // Check if webhook creation was successful
      if (!createdWebhook) {
        return { status: 'failed', message: 'Unable to create webhook' };
      }

      // Return success response
      return {
        status: 'success',
        message: 'Webhook created successfully',
        data: createdWebhook,
      };
  } catch (error) {
    console.error('Error occurred while creating the webhook', error);
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

  /**
   * Checks if a webhook with the same callback link and user already exists.
   * @param createWebhookDto DTO containing webhook creation details.
   * @returns A promise resolving to a boolean indicating whether the webhook already exists.
   */
  async isWebhookAlreadyPresent(createWebhookDto: CreateWebhookDto): Promise<boolean> {
    const { callbackLink, user } = createWebhookDto;
    const webhook = await this.webhookModel.findOne({ callbackLink, user }).exec();
    return !!webhook;
  }

  /**
   * Finds all webhooks based on the provided payload.
   * @param payload Payload containing user, query parameters, and route parameters.
   * @returns A promise resolving to an object containing the status, message, and found webhooks.
   */
  async find(payload: FindWebhookDtoRequest) {
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
        return { status: "failed", message: "Unable to get webhook" };
      }

      // Return successful response with found webhooks
      return { status: "success", message: "All webhook received successfully", data: findAllwebhook };
    } catch (err) {
      console.log(err);
      throw new HttpException(
        {
          statusCode: HttpStatus.FORBIDDEN,
          status: 'Failure',
          error: err.response,
        },
        HttpStatus.FORBIDDEN,
        { cause: err },
      );
    }
  }

  /**
   * Updates an existing webhook.
   * @param id The ID of the webhook to update.
   * @param updateWebhookDto DTO containing updated webhook details.
   * @returns A promise resolving to an object containing the status, message, and updated webhook data.
   */
  async update(id: string, updateWebhookDto: UpdateWebhookDto): Promise<any> {
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

      // Handle error and throw an HTTP exception
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

  /**
   * Removes a webhook by its ID.
   * @param id The ID of the webhook to remove.
   * @returns A promise resolving to an object containing the status and message.
   */

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
