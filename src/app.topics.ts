export const allTopics2 = {
    webhook: [
        {
            controller:"/webhook",
            topicName: "webhookService-webhook-create",
            gateWayURL: "webhook/create",
            urlMethod: "POST"
        },
        {
            controller:"/webhook",
            topicName: "webhookService-webhook-find",
            gateWayURL: "webhook/find",
            urlMethod: "GET"
        },
        
       {
            controller:"/webhook",
            topicName: "webhookService-webhook-update",
            gateWayURL: "webhook/update",
            urlMethod: "PATCH"
        },

        {
            controller:"/webhook",
            topicName: "webhookService-webhook-remove",
            gateWayURL: "webhook/delete",
            urlMethod: "DELETE"
        },
    ],

    availableService: [
        {
            controller:"/available-services",
            topicName: "webhookService-availableServices-create",
            gateWayURL: "availableServices/",
            urlMethod: "POST"
        },
       
        {
            controller:"/available-services",
            topicName: "webhookService-availableServices-find",
            gateWayURL: "availableServices/find",
            urlMethod: "GET"
        },
        
       {
            controller:"/available-services",
            topicName: "webhookService-availableServices-update",
            gateWayURL: "availableServices/update",
            urlMethod: "PATCH"
        },

        {
            controller:"/available-services",
            topicName: "webhookService-availableServices-remove",
            gateWayURL: "availableServices/delete",
            urlMethod: "DELETE"
        },
    ]
    
}