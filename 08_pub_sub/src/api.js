import express from 'express'
import Redis from 'ioredis'

const app = express()
app.use(express.json())

const publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379') 

app.post("/notifications", async(req,res) => {
    const payload = {
        title: req.body.title | "Default Title",
        createdAt: new Date().toISOString()
    }

    await publisher.publish("notifications", JSON.stringify(payload))

    res.json(
        {
            message: "notification sent"
        }
    )
})

app.listen(3000, () => {
    console.log('Server is runninh on port http://localhost:3000');
})