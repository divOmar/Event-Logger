import { Event } from "../../Domain/events/event";


export interface EventConsumer {
    consume(event:Event):Promise<void>
}



