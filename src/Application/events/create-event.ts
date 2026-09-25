import { Event } from "../../Domain/events/event";
import { EventRepositery } from "./event.repository";



export class CreateEvent{
        constructor(private readonly eventRepositery:EventRepositery){}
        async excute(event:Event):Promise<void>{
            await this.eventRepositery.save(event)
        }
}