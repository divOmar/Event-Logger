import { EventRepositery } from "../../Application/events/event.repository";
import { Event } from "../../Domain/events/event";
import { EventFilters, EventPagination, EventResult } from "../../Types/event.types";






export class InMemoryEventRepository  implements EventRepositery{
    private readonly events:Event[]=[]
    async save(event: Event): Promise<Event> {
        this.events.push(event)
        return event
    }
 async findAll(
  filters?: EventFilters,
  pagination?: EventPagination
): Promise<EventResult> {
  let events = [...this.events];

  if (filters?.eventType) {
    events = events.filter(
      (event) => event.eventType === filters.eventType
    );
  }

  if (filters?.source) {
    events = events.filter(
      (event) => event.source === filters.source
    );
  }

  const total = events.length;

  const skip = pagination
    ? (pagination.page - 1) * pagination.limit
    : 0;

  const limit = pagination?.limit ?? events.length;

  events = events.slice(skip, skip + limit);

  return {
    events,
    total
  };
}
}