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

eventSchema.index({eventType:1})
eventSchema.index({source:1})
eventSchema.index({
    eventType:1,
    source:1,
    createdAt:-1
})
eventSchema.index({ createdAt: -1 });

export const EventModel = model("Event",eventSchema)
