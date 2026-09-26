import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"
import { NextFunction, Request, Response } from "express"






export const validateDto = (DtoClass:any,source: "body" | "query" = "body")=>{
    return async (req:Request,res:Response,next:NextFunction)=>{
          const data = source === "query"
            ? req.query
            : req.body;
        const dto = plainToInstance(DtoClass,data)
        const errors = await validate(dto)
        if(errors.length>0){
            return res.status(400).json({
                success:false,
                message:"validation failed",
                errors
            })
        }
        if (source === "body") {
            req.body = dto;
}
        else {
            (req as any).validatedQuery = dto;
}
        next()
    }
}