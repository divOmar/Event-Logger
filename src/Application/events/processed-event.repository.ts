





export interface ProcessedEventRepositery {
    exists(eventId:string):Promise<boolean>
    marksAsProcessed(eventId:string):Promise<void>
}
