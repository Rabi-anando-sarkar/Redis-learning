import "dotenv/config"
import express from 'express'
import Redis from 'ioredis'
import twilio from 'twilio'
import crypto from 'crypto'

const app = express()

app.use(express.json())

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
)

function otpKey(phone) {
    return `otp:${phone}`
}

app.post('/sendOTP', async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone || !/^\+[1-9]\d{9,14}$/.test(phone)) {
            return res.status(400).json({ message: "Valid phone number in E.164 format required" });
        }

        const otp = crypto.randomInt(100000, 1000000).toString();

        await redis.set(otpKey(phone), otp, 'EX', 60);

        await client.messages.create({
            body: `sms_2fa`,
            from: process.env.TWILIO_NUMBER,
            to: phone
        })

        res.json(
            { 
                message: "OTP sent successfully",
                otp: otp
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send OTP" });
    }
});

app.post('/verifyOTP', async (req, res) => {
    const { phone, otp } = req.body;
    const savedOTP = await redis.get(otpKey(phone))

    if (!savedOTP) {
        return res.status(400).json(
            {
                message: 'OTP expired or not found'
            }
        )
    }

    if (savedOTP !== otp) {
        return res.status(400).json(
            {
                message: 'Invalid OTP'
            }
        )
    }

    await redis.del(otpKey(phone))

    res.json(
        {
            message: 'OTP verified'
        }
    )
})

app.get('/otp/:phone/ttl', async (req, res) => {
    const ttl = await redis.ttl(otpKey(req.params.phone))

    res.json(
        {
            ttl
        }
    )
})

app.listen(3000, () => {
    console.log(`server running on http://localhost:3000`);
})