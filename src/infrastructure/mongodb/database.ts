import mongoose from "mongoose"
import { config } from "../../config/env"







export const connectDataBase= async ():Promise<void>=>{
    await mongoose.connect(config.DB_URL)
    console.log("database is connected");
}


export const disconnectDataBase = async (): Promise<void> => {
    await mongoose.disconnect();
    console.log("database disconnected");
};