import { Kafka } from "kafkajs";
import { EventPublisher } from "../../Application/events/event.publisher";
import { Event } from "../../Domain/events/event";
import { config } from "../../config/env";






const kafka = new Kafka({
    clientId:"event-log-service",
    brokers:[config.KafkaBrokers],
    retry:{
        initialRetryTime:300,
        retries:5,
        maxRetryTime:5000
    }
})


const producer = kafka.producer()


export const connectKafka=async ():Promise<void>=>{
            await producer.connect()
            console.log("kafka connectted successfuly");
}

export const disconnectKafka = async ():Promise<void>=>{
    await producer.disconnect()
    console.log("kafka diconnected");
    
}


export class KafkaEventPublisher implements EventPublisher{
    async publish(event: Event): Promise<void> {
        await producer.send({
            topic:config.KafkaTopic,
            messages:[{
                key:event._id,
                value:JSON.stringify(event)
            }]
        })
    }
}


