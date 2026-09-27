import { Event } from "../../Domain/events/event";
import { CreateEventInput, EventFilters, EventPagination, EventResult } from "../../Types/event.types";

export interface EventRepositery{
    save(event:CreateEventInput):Promise<Event>
    findAll(filters?:EventFilters,pagination?:EventPagination):Promise<EventResult>
}

