
import "reflect-metadata";
import app from "./app";
import { config } from "./config/env";
import { connectDataBase } from "./infrastructure/mongodb/database";





const startServer= async ():Promise<void>=>{
        await connectDataBase()
        
        app.listen(config.port,()=>{
        console.log(`app is running on port ${config.port}`);
})

}



startServer()