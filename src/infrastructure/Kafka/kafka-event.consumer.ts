import { Kafka } from "kafkajs";
import { config } from "../../config/env";
import { EventConsumer } from "../../Application/events/event.consumer";
import { Event } from "../../Domain/events/event";
import { plainToInstance } from "class-transformer";
import { ConsumedEventDto } from "../../Application/events/consumed-event.dto";
import { validate } from "class-validator";



        



const kafka = new Kafka({
    clientId:"event-log-service-consumer",
    brokers:[config.KafkaBrokers]
})

const consumer = kafka.consumer({
    groupId:"event-log-service-group"
})


export const connectKafkaConsumer = async():Promise<void>=>{
    await consumer.connect()
    console.log("kafka consumer connect successfuly");
    
}


export const subscribeToEvents = async():Promise<void>=>{
    await consumer.subscribe({
        topic:config.KafkaTopic,
        fromBeginning:true
    })
}




export const startKafkaConsumer = async (eventConsumer:EventConsumer):Promise<void>=>{
    await consumer.run({
        eachMessage:async ({message})=>{
            if(!message.value){
                return
            }
            let parsedMessage: unknown;

            try {
            parsedMessage = JSON.parse(message.value.toString());
            } catch (error) {
            console.error("Invalid JSON Kafka message", error);
            return;
            }
            const eventDto =plainToInstance(
            ConsumedEventDto,
            parsedMessage
            )
            const errors = await validate(eventDto)
            if(errors.length>0){
                console.error("invalid kafka Event",errors)
                return
            }     
            const event: Event = {
                _id: eventDto._id,
                eventType: eventDto.eventType,
                source: eventDto.source,
                payload: eventDto.payload,
                createdAt: new Date(eventDto.createdAt)
            };
                await eventConsumer.consume(event);
        }   
    })
}



