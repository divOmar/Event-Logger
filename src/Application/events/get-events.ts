import { Event } from "../../Domain/events/event";
import { EventRepositery } from "./event.repository";






export class GetEvents {
    constructor (private readonly eventRepositery:EventRepositery){}
    async excute():Promise<Event[]>{
        return this.eventRepositery.findAll()
    }
}