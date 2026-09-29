import { model, Schema } from "mongoose";
import { EventProcessingStatus } from "../../../Types/event.types";



const ProcessedEventSchema = new Schema({
    eventId:{
        type:String,
        required:true,
        uniqe:true,
        index:true
    },
    status:{
        type:String,
        enum:Object.values(EventProcessingStatus),
        required:true
    },
    processedAt:{
        type:Date,
        default:null
    },
    error:{
        type:String,
        default:null
    }

},
{
    timestamps:false
})



export const ProcessedEventModel =model("ProcessedEvent",ProcessedEventSchema)


