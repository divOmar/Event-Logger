import { Event } from "../../Domain/events/event";
import { EventConsumer } from "./event.consumer";








export class ProccessEvent implements EventConsumer {
        async consume(event: Event): Promise<void> {
            console.log("proccessing Event",event);
            
        }
}