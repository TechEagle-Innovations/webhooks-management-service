import { ResponseDto } from "./dto/response.dto"
import { CreateWebhookDtoRequest } from "./webhook/dto/create-webhook.dto"
import { FindWebhookDtoRequest, FindWebhookResponseDto } from "./webhook/dto/find-webhook.dto"
import { UpdateWebhookDtoRequest, UpdateWebhookResponseDto } from "./webhook/dto/update-webhook.dto"
import { RemoveWebhookDtoRequest } from "./webhook/dto/remove.webhook.dto"
import { CreateAvailableServiceDtoRequest, CreateAvailableServiceResponseDto } from "./available-services/dto/create-available-service.dto"
import { FindAvailableServiceDtoRequest} from "./available-services/dto/find-available-service.dto"
import { UpdateAvailableServiceDtoRequest } from "./available-services/dto/update-available-service.dto"
import { RemoveAvailableServiceDtoRequest } from "./available-services/dto/remove.available-service.dto"
export const allTopics2 = {
    webhook: [
        {
            controller: "/webhook",
            topicName: "webhookService-webhook-create",
            gateWayURL: "/webhook",
            urlMethod: "POST"
        },
        {
            controller: "/webhook",
            topicName: "webhookService-webhook-find",
            gateWayURL: "/webhook/find/:id",
            urlMethod: "GET"
        },

        {
            controller: "/webhook",
            topicName: "webhookService-webhook-update",
            gateWayURL: "/webhook/update",
            urlMethod: "PATCH"
        },

        {
            controller: "/webhook",
            topicName: "webhookService-webhook-remove",
            gateWayURL: "/webhook/delete",
            urlMethod: "DELETE"
        },
    ],

    availableService: [
        {
            controller: "/available-services",
            topicName: "webhookService-availableServices-create",
            gateWayURL: "/available-services",
            urlMethod: "POST"
        },

        {
            controller: "/available-services",
            topicName: "webhookService-availableServices-find",
            gateWayURL: "/available-services",
            urlMethod: "GET"
        },

        {
            controller: "/available-services",
            topicName: "webhookService-availableServices-update",
            gateWayURL: "/available-services",
            urlMethod: "PATCH"
        },

        {
            controller: "/available-services",
            topicName: "webhookService-availableServices-remove",
            gateWayURL: "/available-services",
            urlMethod: "DELETE"
        },
    ]

}

export const responseDtoMap = {
    "webhookService-webhook-create": CreateWebhookDtoRequest,
    "webhookService-webhook-find":FindWebhookResponseDto,
    "webhookService-webhook-update": UpdateWebhookResponseDto,
    "webhookService-webhook-remove": RemoveWebhookDtoRequest,
    'webhookService-availableServices-create': ResponseDto,
    'webhookService-availableServices-find': ResponseDto,
    'webhookService-availableServices-update': ResponseDto,
    'webhookService-availableServices-remove': ResponseDto,
}
export const requestDtoMap = {
    "webhookService-webhook-create": CreateWebhookDtoRequest,
    "webhookService-webhook-find": FindWebhookDtoRequest,
    "webhookService-webhook-update": UpdateWebhookDtoRequest,
    "webhookService-webhook-remove":RemoveWebhookDtoRequest,
    'webhookService-availableServices-create':CreateAvailableServiceDtoRequest,
    'webhookService-availableServices-find': FindAvailableServiceDtoRequest,
    'webhookService-availableServices-update': UpdateAvailableServiceDtoRequest,
    'webhookService-availableServices-remove': RemoveAvailableServiceDtoRequest,
    
}