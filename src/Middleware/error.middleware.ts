import { NextFunction, Request, Response } from "express";






export const errorMiddleware = (
    err:Error,
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    console.log(err);
        res.status(500).json({success:"false",message:"something went wrong"})
}