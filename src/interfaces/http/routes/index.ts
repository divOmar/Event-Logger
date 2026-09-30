import { Router } from "express";
import { InMemoryEventRepository } from "../../../infrastructure/events/in-memory-event.repository";
import { CreateEvent } from "../../../Application/events/create-event";
import { EventController } from "../controllers/event.controller";
import { createEventRoutes } from "./event.routes";
import { EventMongoRepositery } from "../../../infrastructure/events/mongo-event.repository";
import { GetEvents } from "../../../Application/events/get-events";
import { KafkaEventPublisher } from "../../../infrastructure/Kafka/kafka-event.publisher";
import healthRoutes from "./health.routes";
const router=Router()


const eventRepositry= new EventMongoRepositery()
const eventPublisher= new KafkaEventPublisher()
const createEvent = new CreateEvent(eventRepositry,eventPublisher)
const getEvents= new GetEvents(eventRepositry)
const eventController = new EventController(createEvent,getEvents)

router.use(createEventRoutes(eventController))

router.use(healthRoutes)



export default router