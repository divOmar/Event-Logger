
import "reflect-metadata";
import app from "./app";
import { config } from "./config/env";
import { connectDataBase } from "./infrastructure/mongodb/database";
import { connectKafka } from "./infrastructure/Kafka/kafka-event.publisher";





const startServer= async ():Promise<void>=>{
        await connectDataBase()
        await connectKafka()
        app.listen(config.port,()=>{
        console.log(`app is running on port ${config.port}`);
})

}



startServer()