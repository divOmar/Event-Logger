import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { validateDto } from "../../../Middleware/validation.middleware";
import { createEventDto } from "../../../Application/events/create-event.dto";








export const createEventRoutes =(eventController:EventController)=>{
    const router = Router()


    router.post("/events",
        validateDto(createEventDto),
        eventController.create.bind(eventController)
    )
    return router 
}