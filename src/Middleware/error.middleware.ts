import { NextFunction, Request, Response } from "express";
import { logger } from "../infrastructure/logging/logger";






export const errorMiddleware = (
    err:Error,
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    logger.error({ error: err }, "Unhandled application error");
        res.status(500).json({success:false,message:"something went wrong"})
}