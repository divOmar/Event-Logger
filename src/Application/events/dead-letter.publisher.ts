import { Event } from "../../Domain/events/event";









export interface DeadLetterPublisher {
    publish(
        event:Event,
        error:Error,
        retryCount:number
    ):Promise<void>
}








