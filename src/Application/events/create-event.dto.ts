import { IsNotEmpty, IsObject, IsString } from "class-validator";





export class createEventDto {
    @IsString()
    @IsNotEmpty()
    eventType!:string
    @IsString()
    @IsNotEmpty()
    source!:string
    @IsObject()
    payload!: Record<string, unknown>
}