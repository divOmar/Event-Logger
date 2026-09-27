import { Event } from "../../Domain/events/event";



export interface EventPublisher{
    publish(event:Event):Promise<void>
}