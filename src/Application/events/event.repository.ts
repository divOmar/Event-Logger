import { Event } from "../../Domain/events/event";

export interface EventRepositery{
    save(event:Event):Promise<void>
    findAll():Promise<Event[]>
}

