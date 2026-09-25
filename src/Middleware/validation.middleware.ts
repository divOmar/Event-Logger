import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"
import { NextFunction, Request, Response } from "express"






export const validateDto = (DtoClass:any)=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
        const dto = plainToInstance(DtoClass,req.body)
        const errors = await validate(dto)
        if(errors.length>0){
            return res.status(400).json({
                success:false,
                message:"validation failed",
                errors
            })
        }
        req.body=dto
        next()
    }
}