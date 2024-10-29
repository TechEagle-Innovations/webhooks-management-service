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
            gateWayURL: "/webhook/available-services",
            urlMethod: "GET"
        },

        {
            controller: "/available-services",
            topicName: "webhookService-availableServices-update",
            gateWayURL: "/webhook/available-services",
            urlMethod: "PATCH"
        },

        {
            controller: "/available-services",
            topicName: "webhookService-availableServices-remove",
            gateWayURL: "/webhook/available-services",
            urlMethod: "DELETE"
        },
    ]

}