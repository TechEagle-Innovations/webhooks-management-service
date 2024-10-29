import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAvailableServiceDto } from './dto/create-available-service.dto';
import { UpdateAvailableServiceDto } from './dto/update-available-service.dto';
import { OnRequest } from 'src/interface/on-request.interface';
import { availableServicesTopicDocument } from 'src/Schema/availableService.schema';
import { eventNames } from 'process';
import { Types } from 'mongoose';
 

export class availableServices {

  constructor(
    @InjectModel('availableServicesinfo') public AvailableServicesModule: Model<availableServicesTopicDocument>,
  ) {}

 /**
   * Creates a new available service.
   * 
   * @param createAvailableServiceDto DTO containing the service details to be created.
   * @returns A promise resolving to an object containing the status, message, and created service data.
   */
  async create(createAvailableServiceDto: CreateAvailableServiceDto): Promise<{ status: string; message: string; data?: availableServicesTopicDocument }> {
    try {
        // Check if a service with the same name and event already exists

      const isWebhookAlreadyPresent = await this.isWebhookAlreadyPresent(createAvailableServiceDto);
      if (isWebhookAlreadyPresent) {
        return { status: 'failed', message: 'Webhook already exists' };
      }

        // Prepare service data object
      const webhookData = {
        serviceName: createAvailableServiceDto.serviceName,
        eventName: createAvailableServiceDto.eventName,
        createdBy: createAvailableServiceDto.createdBy,
        updatedBy: createAvailableServiceDto.createdBy,
      };

         // Create new service document
      const createdWebhook = new this.AvailableServicesModule(webhookData);
   
      await createdWebhook.save();

          // Check if service creation was successful

      if (!createdWebhook) {
        return { status: 'failed', message: 'Unable to create webhook' };
      }
       // Return success response with created service
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


  /**
   * Checks if a service with the same name and event already exists.
   * 
   * @param createAvailableServiceDto DTO containing the service details to check.
   * @returns A promise resolving to a boolean indicating whether the service already exists.
   */

   
  async isWebhookAlreadyPresent(createAvailableServiceDto: CreateAvailableServiceDto): Promise<boolean> {
    const { serviceName, eventName } = createAvailableServiceDto;
    const webhook = await this.AvailableServicesModule.findOne({ serviceName, eventName }).exec();
    return !!webhook;
  }
  
  /**
   * Finds all services based on the provided ID or returns all services if no ID is provided.
   * 
   * @param id Optional ID of the service to find.
   * @returns A promise resolving to an object containing the status, message, and found services.
   */
    async find(id?: string) {
      try {
        let result;
  
        if (id) {
          // If an ID is provided, find the specific document by ID
          result = await this.AvailableServicesModule.findById(id).exec();
  
          if (!result) {
            return { status: 'failed', message: `No document found with id: ${id}` };
          }
        } else {
          // If no ID is provided, return all documents
          result = await this.AvailableServicesModule.find().exec();
        }
  
        return { status: 'success', message: 'Data retrieved successfully', data: result };
      } catch (err) {
        console.error(err);
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            status: 'Failure',
            error: err.message || 'An error occurred while fetching data',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    /**
   * Updates an existing service.
   * 
   * @param id ID of the service to update.
   * @param updateAvailableServiceDto DTO containing the updated service details.
   * @returns A promise resolving to an object containing the status, message, and updated service data.
   */


  async update(id: string, updateAvailableServiceDto: UpdateAvailableServiceDto): Promise<any> {
    try {
      // Ensure the ID is a valid ObjectId
      if (!Types.ObjectId.isValid(id)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            status: 'Failure',
            error: 'Invalid ID format',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Find and update the document by ID, and return the updated document
      const updatedWebhook = await this.AvailableServicesModule.findByIdAndUpdate(
        id,
        {
          $set: {
            serviceName: updateAvailableServiceDto.serviceName,
            eventName: updateAvailableServiceDto.eventName,
            createdBy: updateAvailableServiceDto.createdBy,
            updatedBy: updateAvailableServiceDto.updatedBy,
          },
        },
        { new: true } // Return the updated document
      ).exec();

      // Check if the document was found and updated
      if (!updatedWebhook) {
        return {
          status: 'failed',
          message: `Webhook with id ${id} not found or could not be updated`,
        };
      }

      // Return success response with updated data
      return {
        status: 'success',
        message: `Webhook with id ${id} updated successfully`,
        data: updatedWebhook,
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
   * Removes a service by its ID.
   * 
   * @param id ID of the service to remove.
   * @returns A promise resolving to an object containing the status and message.
   */

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
