import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { validateDto } from "../../../Middleware/validation.middleware";
import { createEventDto } from "../../../Application/events/create-event.dto";
import { EventPaginationDto } from "../../../Application/events/event-pagination.dto";








export const createEventRoutes =(eventController:EventController)=>{
    const router = Router()


    router.post("/events",
        validateDto(createEventDto),
        eventController.create.bind(eventController)
    )


    router.get('/get-events',
        validateDto(EventPaginationDto,"query"),
        eventController.getAll.bind(eventController)
    )
    return router 
}