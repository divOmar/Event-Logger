
import { EventRepositery } from "../../Application/events/event.repository";
import { Event } from "../../Domain/events/event";
import { CreateEventInput, EventFilters, EventPagination, EventResult } from "../../Types/event.types";
import { EventModel } from "../mongodb/Models/event.model";




export class EventMongoRepositery implements EventRepositery{
    async save(event: CreateEventInput): Promise<void> {
        await EventModel.create(event)
    }

        async findAll(
            filters?: EventFilters,
            pagination?: EventPagination
): Promise<EventResult> 
{
            const query: Record<string, unknown> = {};

                if (filters?.eventType) {
                query.eventType = filters.eventType;
                }

            if (filters?.source) {
                query.source = filters.source;
}

            const skip = pagination
            ? (pagination.page - 1) * pagination.limit: 0;

            const limit = pagination?.limit;

            const events = await EventModel.find(query)
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit ?? 0)
            .lean();

            const total = await EventModel.countDocuments(query);

        const mappedEvents: Event[] = events.map((event) => ({
    id: event._id.toString(),
    eventType: event.eventType,
    source: event.source,
    payload: event.payload,
    createdAt: event.createdAt
  }));

  return {
    events: mappedEvents,
    total: total
  };
}
}