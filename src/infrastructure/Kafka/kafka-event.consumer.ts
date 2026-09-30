import { Kafka } from "kafkajs";
import { config } from "../../config/env";
import { EventConsumer } from "../../Application/events/event.consumer";
import { Event } from "../../Domain/events/event";
import { plainToInstance } from "class-transformer";
import { ConsumedEventDto } from "../../Application/events/consumed-event.dto";
import { validate } from "class-validator";
import { retry } from "./retry";
import { DeadLetterPublisher } from "../../Application/events/dead-letter.publisher";
import { logger } from "../logging/logger";



        



const kafka = new Kafka({
    clientId:"event-log-service-consumer",
    brokers:[config.KafkaBrokers]
})

const consumer = kafka.consumer({
    groupId:"event-log-service-group"
})


export const connectKafkaConsumer = async():Promise<void>=>{
    await consumer.connect()
    logger.info("kafka consumer connect successfuly");
    
}


export const disconnectKafkaConsumer = async():Promise<void>=>{
    await consumer.disconnect()
    logger.info("kafka consumer disconnected")
}


export const subscribeToEvents = async():Promise<void>=>{
    await consumer.subscribe({
        topic:config.KafkaTopic,
        fromBeginning:true
    })
}




export const startKafkaConsumer = async (eventConsumer:EventConsumer,deadLetterPublisher:DeadLetterPublisher):Promise<void>=>{
    await consumer.run({
        eachMessage:async ({message})=>{
            if(!message.value){
                return
            }
            let parsedMessage: unknown;

            try {
            parsedMessage = JSON.parse(message.value.toString());
            } catch (error) {
            logger.error({error},"Invalid JSON Kafka message");
            return;
            }
            const eventDto =plainToInstance(
            ConsumedEventDto,
            parsedMessage
            )
            const errors = await validate(eventDto)
            if(errors.length>0){
                logger.error({errors},"invalid kafka Event")
                return
            }     
            const event: Event = {
                _id: eventDto._id,
                eventType: eventDto.eventType,
                source: eventDto.source,
                payload: eventDto.payload,
                createdAt: new Date(eventDto.createdAt)
            };
                try {
                    await retry(
                    ()=> eventConsumer.consume(event),
                    3,
                    1000
                )
                } catch (error) {
                    logger.error({
                        eventId: event._id,
                        eventType: event.eventType,
                        source: event.source,
                        error
                        },
                        "event processing failed after retries"
                        );
                await deadLetterPublisher.publish(event,error as Error, 3)
                return
                }
        }   
    })
}







