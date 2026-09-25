import { NextFunction, Request, Response } from "express";
import { CreateEvent } from "../../../Application/events/create-event";




export class EventController {
    constructor (private readonly createEvent:CreateEvent){}
    async create (req:Request,res:Response,next:NextFunction):Promise<void>{
            await this.createEvent.excute(req.body)
            res.status(201).json({success:true,message:"event created successfuly"})
    }
}