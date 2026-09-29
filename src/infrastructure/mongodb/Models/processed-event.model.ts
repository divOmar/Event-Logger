import { model, Schema } from "mongoose";



const ProcessedEventSchema = new Schema({
    eventId:{
        type:String,
        required:true,
        uniqe:true,
        index:true
    },
    proccessedAt:{
        type:Date,
        default:Date.now()
    },

},
{
    timestamps:false
})



export const ProcessedEventModel =model("ProcessedEvent",ProcessedEventSchema)


