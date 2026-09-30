import pino from "pino";










export const logger = pino({
    level:"info",
    base:{
        service:"event-log-service"
    },
    timestamp:pino.stdTimeFunctions.isoTime
})





