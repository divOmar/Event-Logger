import { Kafka } from "kafkajs";
import { config } from "../../config/env";
import { DeadLetterPublisher } from "../../Application/events/dead-letter.publisher";
import { Event } from "../../Domain/events/event";








const kafka = new Kafka({
    clientId:"event-log-service-dlt",
    brokers:[config.KafkaBrokers]
})


const producer = kafka.producer()



export const connectDeadLetterKafka = async():Promise<void>=>{
    await producer.connect()
    console.log("kafka Dlt is connected ");
    
}


export const disconnectDeadLetterKafka = async (): Promise<void> => {
    await producer.disconnect();
    console.log("Kafka DLT producer disconnected");
};

export class KafkaDeadLetterPublisher implements DeadLetterPublisher {
    async publish(event: Event, error: Error, retryCount: number): Promise<void> {
        const deletedLetterMessge={
            event,
            error:{
                message:error.message
            },
            retryCount,
            failedAt:new Date().toString()
        }
        await producer.send({
            topic:"events.dlt",
            messages:[{
                key:event._id,
                value:JSON.stringify(deletedLetterMessge)
            }]
        })
    }
}