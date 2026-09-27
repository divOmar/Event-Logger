
import "reflect-metadata";
import app from "./app";
import { config } from "./config/env";
import { connectDataBase } from "./infrastructure/mongodb/database";
import { connectKafka } from "./infrastructure/Kafka/kafka-event.publisher";
import { connectKafkaConsumer, startKafkaConsumer, subscribeToEvents } from "./infrastructure/Kafka/kafka-event.consumer";





const startServer= async ():Promise<void>=>{
        await connectDataBase()
        await connectKafka()
        await connectKafkaConsumer()
        await subscribeToEvents()
         startKafkaConsumer()
        app.listen(config.port,()=>{
        console.log(`app is running on port ${config.port}`);
})

}



startServer()