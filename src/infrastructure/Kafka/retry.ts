



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
                console.error(`operation failed retried....${atempts}/${retries} `)
                await new Promise((resolve)=>{
                    setTimeout(resolve,delayMs)
                })
            }
        }
}