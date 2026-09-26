import { Router } from "express";
import { InMemoryEventRepository } from "../../../infrastructure/events/in-memory-event.repository";
import { CreateEvent } from "../../../Application/events/create-event";
import { EventController } from "../controllers/event.controller";
import { createEventRoutes } from "./event.routes";
import { EventMongoRepositery } from "../../../infrastructure/events/mongo-event.repository";
import { GetEvents } from "../../../Application/events/get-events";

const router=Router()


const eventRepositry= new EventMongoRepositery()
const createEvent = new CreateEvent(eventRepositry)
const getEvents= new GetEvents(eventRepositry)
const eventController = new EventController(createEvent,getEvents)

router.use(createEventRoutes(eventController))


export default router