import { NextFunction, Request, Response } from "express";
import { CreateEvent } from "../../../Application/events/create-event";
import { Event } from "../../../Domain/events/event";
import { GetEvents } from "../../../Application/events/get-events";




export class EventController {
    constructor (private readonly createEvent:CreateEvent,
        private readonly getEvents:GetEvents
    ){}
    async create (req:Request,res:Response,next:NextFunction):Promise<void>{
            await this.createEvent.excute(req.body)
            res.status(201).json({success:true,message:"event created successfuly"})
    }

    async getAll(req:Request,res:Response,next:NextFunction):Promise<void>{
        const events = await this.getEvents.excute()
        res.status(200).json({success:true,events})
    }
}