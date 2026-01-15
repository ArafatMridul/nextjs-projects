import {Elysia} from 'elysia'
import {nanoid} from "nanoid";
import {redis} from "@/lib/Redis";

const ROOM_TTL_SECS = 60 * 10; // time-to-live(ttl) : 10 mins

const rooms = new Elysia({prefix: "/room"}).post("/create", async () => {
    const roomId = nanoid();

    // create a room in database
    await redis.hset(`meta:${roomId}`, {connected: [], createdAt: Date.now()});

    // automatically remove room after 10 mins
    await redis.expire(`meta:${roomId}`, ROOM_TTL_SECS);

    return {roomId};
})

export const app = new Elysia({prefix: '/api'}).use(rooms)

export const GET = app.fetch
export const POST = app.fetch