import mongoose from "mongoose"
import { config } from "../../config/env"
import { logger } from "../logging/logger";







export const connectDataBase= async ():Promise<void>=>{
    await mongoose.connect(config.DB_URL)
    logger.info("database is connected");
}


export const disconnectDataBase = async (): Promise<void> => {
    await mongoose.disconnect();
    logger.info("database disconnected");
};