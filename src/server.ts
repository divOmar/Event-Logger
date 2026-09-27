
import "reflect-metadata";
import app from "./app";
import { config } from "./config/env";
import { connectDataBase } from "./infrastructure/mongodb/database";
import { connectKafka } from "./infrastructure/Kafka/kafka-event.publisher";
import { connectKafkaConsumer, startKafkaConsumer, subscribeToEvents } from "./infrastructure/Kafka/kafka-event.consumer";
import { ProccessEvent } from "./Application/events/process-event";





const startServer= async ():Promise<void>=>{
        const eventConsumer= new ProccessEvent()
        await connectDataBase()
        await connectKafka()
        await connectKafkaConsumer()
        await subscribeToEvents()
         startKafkaConsumer(eventConsumer)
        app.listen(config.port,()=>{
        console.log(`app is running on port ${config.port}`);
})

}



startServer()