import Redis from 'ioredis';

const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

subscriber.subscribe('notifications', (error) => {
    if(error) {
        console.log(`Failed to subscribe :: ${error.message}`);
        return
    }

    console.log("subscribed successfully");
})


subscriber.on('message', (channel, message) => {
    console.log("Recevied on ", channel, ":", JSON.parse(message));
})