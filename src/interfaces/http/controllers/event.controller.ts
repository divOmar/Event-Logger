import { NextFunction, Request, Response } from "express";
import { CreateEvent } from "../../../Application/events/create-event";
import { Event } from "../../../Domain/events/event";
import { GetEvents } from "../../../Application/events/get-events";
import { EventPagination, ValidatedRequest } from "../../../Types/event.types";
import { EventPaginationDto } from "../../../Application/events/event-pagination.dto";




export class EventController {
    constructor (private readonly createEvent:CreateEvent,
        private readonly getEvents:GetEvents
    ){}
    async create (req:Request,res:Response,next:NextFunction):Promise<void>{
            await this.createEvent.excute(req.body)
            res.status(201).json({success:true,message:"event created successfuly"})
    }

    async getAll(req:Request,res:Response,next:NextFunction):Promise<void>{
        const filters ={
            eventType:req.query.eventType as string | undefined,
            source:req.query.source as string | undefined
        }
        const pagination = (req as ValidatedRequest<EventPaginationDto>).validatedQuery;
        const result = await this.getEvents.excute(filters,pagination)
        res.status(200).json({success:true,
            events: result.events,
            pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / pagination.limit)}})
    }
}