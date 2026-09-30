import { Event } from "../../Domain/events/event";
import { logger } from "../../infrastructure/logging/logger";
import { EventConsumer } from "./event.consumer";
import { ProcessedEventRepositery } from "./processed-event.repository";








export class ProccessEvent implements EventConsumer {
    constructor(private readonly processedEventRepositry:ProcessedEventRepositery){}
        async consume(event: Event): Promise<void> {
        const alreadyProcessed = await this.processedEventRepositry.exists(event._id)
        if(alreadyProcessed){
            logger.info("event already processed");
            return
        }
        
        await this.processedEventRepositry.markAsProcessing(event._id)
        try {
            logger.info({
                    eventId: event._id,
                    eventType: event.eventType,
                    source: event.source
                },
                    "Processing event:"
                );
            await this.processedEventRepositry.marksAsProcessed(event._id)
        } catch (error) {
            await this.processedEventRepositry.markAsFailed(event._id,error instanceof Error ?error.message:"unKnown Error")
            throw error
        }
}
}