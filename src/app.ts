import express from 'express'
import { errorMiddleware } from './Middleware/error.middleware'
import routes from "./interfaces/http/routes/index.js";



const app = express()

app.use(express.json())

app.use(routes)

app.use(errorMiddleware)

export default app 