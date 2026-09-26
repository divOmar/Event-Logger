import { Event } from "../../Domain/events/event";
import { CreateEventInput } from "../../Types/event.types";
import { EventRepositery } from "./event.repository";



export class CreateEvent{
        constructor(private readonly eventRepositery:EventRepositery){}
        async excute(input:CreateEventInput):Promise<void>{
            await this.eventRepositery.save(input)
        }
}