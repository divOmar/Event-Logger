import { Event } from "../../Domain/events/event";
import { CreateEventInput } from "../../Types/event.types";
import { EventPublisher } from "./event.publisher";
import { EventRepositery } from "./event.repository";



export class CreateEvent{
        constructor(private readonly eventRepositery:EventRepositery,
            private readonly eventPublisher:EventPublisher
        ){}
        async excute(input:CreateEventInput):Promise<void>{
            const event =await this.eventRepositery.save(input)
            await this.eventPublisher.publish(event)
        }
}