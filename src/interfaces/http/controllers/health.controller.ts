import { Request, Response } from "express";







export const healthCheack=(req:Request,res:Response):void=>{
    res.status(200).json({
        success:true,
        status:"ok"
    })
}







export const livenessCheack=(req:Request,res:Response):void=>{
    res.status(200).json({
        success:true,
        status:"alive"
    })
}





