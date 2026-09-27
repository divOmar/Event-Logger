import { Kafka } from "kafkajs";
import { config } from "../../config/env";






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




export const startKafkaConsumer = async ():Promise<void>=>{
    await consumer.run({
        eachMessage:async ({message})=>{
            console.log("kafka message recived");
        }
    })
}
