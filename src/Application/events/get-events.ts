import { Event } from "../../Domain/events/event";
import { EventFilters, EventPagination, EventResult } from "../../Types/event.types";
import { EventRepositery } from "./event.repository";






export class GetEvents {
    constructor (private readonly eventRepositery:EventRepositery){}
    async excute(filters?:EventFilters,pagination?:EventPagination):Promise<EventResult>{
        return this.eventRepositery.findAll(filters,pagination)
    }
}