import { ProcessedEventRepositery } from "../../Application/events/processed-event.repository";
import { ProcessedEventModel } from "../mongodb/Models/processed-event.model";





export class MongoProccessedEventRepositry implements ProcessedEventRepositery{
    async exists(eventId: string): Promise<boolean> {
        const processedEvent = await ProcessedEventModel.exists({
            eventId
        })
        return processedEvent !== null
    }
    async marksAsProcessed(eventId: string): Promise<void> {
        await ProcessedEventModel.create({eventId})
    }
}