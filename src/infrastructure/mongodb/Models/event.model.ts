import { model, Schema } from "mongoose";






const eventSchema = new Schema({
    eventType:{
        type:String,
        required:true
    },

    source:{
        type:String,
        required:true
    },
    payload:{
        type:Schema.Types.Mixed,
        required:true
    }
},
{
    timestamps:true
})



export const EventModel = model("Event",eventSchema)
