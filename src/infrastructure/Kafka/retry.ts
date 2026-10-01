import { logger } from "../logging/logger"




export const retry = async(
    operation:()=>Promise<void>,
    retries:number,
    delayMs:number
):Promise<void>=>{
        let atempts =0
        while(atempts<=retries){
            try {
                await operation()
                return
            } catch (error) {
                atempts++
                if(atempts>retries){
                    throw error
                }
                logger.error(
            {
                attempt: atempts,
                maxRetries: retries,
                delayMs
            },
                "Kafka operation failed, retrying"
            );
                await new Promise((resolve)=>{
                    setTimeout(resolve,delayMs)
                })
            }
        }
}