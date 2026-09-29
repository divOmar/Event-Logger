import { ProcessedEventRepositery } from "../../Application/events/processed-event.repository";
import { EventProcessingStatus } from "../../Types/event.types";
import { ProcessedEventModel } from "../mongodb/Models/processed-event.model";





export class MongoProccessedEventRepositry implements ProcessedEventRepositery{
    async exists(eventId: string): Promise<boolean> {
        const processedEvent = await ProcessedEventModel.exists({
            eventId,
            status:EventProcessingStatus.PROCESSED
        })
        return processedEvent !== null
    }
    async marksAsProcessed(eventId: string): Promise<void> {
        await ProcessedEventModel.findOneAndUpdate(
            {eventId},
            {
                status:EventProcessingStatus.PROCESSED,
                processedAt:new Date()
            }
        )
    }
    async markAsProcessing(eventId: string): Promise<void> {
        await ProcessedEventModel.findOneAndUpdate(
            {eventId},
            {
                eventId,
                status:EventProcessingStatus.PROCESSING,
                error:null,
                processedAt:null
            }
        )
    }
    async markAsFailed(eventId: string,error:string): Promise<void> {
        await ProcessedEventModel.findOneAndUpdate(
            {eventId},
            {
                status:EventProcessingStatus.FAILED,
                error
            }
        )
    }
}