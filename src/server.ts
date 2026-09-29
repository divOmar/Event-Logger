
import "reflect-metadata";
import app from "./app";
import { config } from "./config/env";
import { connectDataBase } from "./infrastructure/mongodb/database";
import { connectKafka } from "./infrastructure/Kafka/kafka-event.publisher";
import { connectKafkaConsumer, startKafkaConsumer, subscribeToEvents } from "./infrastructure/Kafka/kafka-event.consumer";
import { ProccessEvent } from "./Application/events/process-event";
import { connectDeadLetterKafka, KafkaDeadLetterPublisher } from "./infrastructure/Kafka/kafka-dead-letter.publisher";
import { MongoProccessedEventRepositry } from "./infrastructure/events/mongo-processed-event.repository";





const startServer= async ():Promise<void>=>{
        const processedEventRepositry = new MongoProccessedEventRepositry()
        const eventConsumer= new ProccessEvent(processedEventRepositry)
        const deadLetterPublisher = new KafkaDeadLetterPublisher()
        await connectDataBase()
        await connectKafka()
        await connectDeadLetterKafka()
        await connectKafkaConsumer()
        await subscribeToEvents()
         startKafkaConsumer(eventConsumer,deadLetterPublisher)
        app.listen(config.port,()=>{
        console.log(`app is running on port ${config.port}`);
})

}



startServer()