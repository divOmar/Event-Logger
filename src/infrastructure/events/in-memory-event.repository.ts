import { EventRepositery } from "../../Application/events/event.repository";
import { Event } from "../../Domain/events/event";






export class InMemoryEventRepository  implements EventRepositery{
    private readonly events:Event[]=[]
    async save(event: Event): Promise<void> {
        this.events.push(event)
    }
}