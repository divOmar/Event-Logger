import express from 'express'



const app = express()

app.use(express.json())


app.get("/health",(req,res)=>{
    res.status(200).json({status:"ok",service:"event log service"})
})

export default app 