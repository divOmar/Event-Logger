import express from 'express'
import { errorMiddleware } from './Middleware/error.middleware'
import routes from "./interfaces/http/routes/index.js";



const app = express()

app.use(express.json())

app.use(routes)
app.get("/health",(req,res)=>{
    res.status(200).json({status:"ok",service:"event log service"})
})


app.use(errorMiddleware)

export default app 