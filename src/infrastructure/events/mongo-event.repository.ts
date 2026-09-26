import { EventRepositery } from "../../Application/events/event.repository";
import { Event } from "../../Domain/events/event";
import { EventModel } from "../mongodb/Models/event.model";




export class EventMongoRepositery implements EventRepositery{
    async save(event: Event): Promise<void> {
        await EventModel.create(event)
    }

    async findAll(): Promise<Event[]> {
        const events = await EventModel.find().lean()
        return events as Event[]
    }
}