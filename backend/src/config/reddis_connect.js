import { createClient } from 'redis';

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-13351.crce263.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 13351
    }
});
    export default redisClient;



