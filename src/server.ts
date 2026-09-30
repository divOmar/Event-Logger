
import "reflect-metadata";
import app from "./app";
import { config } from "./config/env";
import { connectDataBase, disconnectDataBase } from "./infrastructure/mongodb/database";
import { connectKafka, disconnectKafka } from "./infrastructure/Kafka/kafka-event.publisher";
import { connectKafkaConsumer, disconnectKafkaConsumer, startKafkaConsumer, subscribeToEvents } from "./infrastructure/Kafka/kafka-event.consumer";
import { ProccessEvent } from "./Application/events/process-event";
import { connectDeadLetterKafka, disconnectDeadLetterKafka, KafkaDeadLetterPublisher } from "./infrastructure/Kafka/kafka-dead-letter.publisher";
import { MongoProccessedEventRepositry } from "./infrastructure/events/mongo-processed-event.repository";
import { logger } from "./infrastructure/logging/logger";



let server: ReturnType<typeof app.listen>;

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
        server =app.listen(config.port,()=>{
        logger.info(`app is running on port ${config.port}`);
})

}



const closeHttpServer = async (): Promise<void> => {
  if (!server) return;
        logger.info("closing http server ");
        
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  logger.info("HTTP server closed");
};
















const shutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  try {
    logger.info("1. Closing HTTP server...");
    await closeHttpServer();

    logger.info("2. Disconnecting Kafka consumer...");
    await disconnectKafkaConsumer();

    logger.info("3. Disconnecting Kafka producer...");
    await disconnectKafka();

    logger.info("4. Disconnecting DLT producer...");
    await disconnectDeadLetterKafka();

    logger.info("5. Disconnecting MongoDB...");
    await disconnectDataBase();

    logger.info("Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    logger.error({error},"Error during graceful shutdown:");
    process.exit(1);
  }
};






startServer()