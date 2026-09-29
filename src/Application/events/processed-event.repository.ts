





export interface ProcessedEventRepositery {
    exists(eventId:string):Promise<boolean>
    marksAsProcessed(eventId:string):Promise<void>
    markAsProcessing(eventId:string):Promise<void>
    markAsFailed(eventId:string,error:string):Promise<void>
}
