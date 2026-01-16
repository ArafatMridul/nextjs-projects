import {Elysia} from 'elysia'
import {nanoid} from "nanoid";
import {redis} from "@/lib/Redis";
import {authMiddleWare} from "@/app/api/[[...slugs]]/auth";
import {Message, realtime} from "@/lib/realtime";
import z from "zod";

const ROOM_TTL_SECS = 60 * 10; // time-to-live(ttl) : 10 mins

const rooms = new Elysia({prefix: "/room"}).post("/create", async () => {
    const roomId = nanoid();

    // create a room in database
    await redis.hset(`meta:${roomId}`, {connected: [], createdAt: Date.now()});

    // automatically remove room after 10 mins
    await redis.expire(`meta:${roomId}`, ROOM_TTL_SECS);

    return {roomId};
})

const messages = new Elysia({prefix: "/messages"}).use(authMiddleWare).post("/", async ({body, auth}) => {
    const {roomId} = auth;
    const {sender, text}: { sender: string, text: string } = body;

    const roomExists = await redis.exists(`meta:${roomId}`);
    if (!roomExists) {
        throw new Error("Room does not exists");
    }

    const message: Message = {
        id: nanoid(),
        sender,
        text,
        timestamp: Date.now(),
        roomId,
    }

    await redis.rpush(`messages:${roomId}`, {
        ...message, token: auth.token
    })
    // @ts-expect-error
    await realtime.channel(roomId).emit("chat.message", message);
    const remaining = await redis.ttl(`meta:${roomId}`);
    await redis.expire(`messages:${roomId}`, remaining);
    await redis.expire(`history:${roomId}`, remaining);
    await redis.expire(roomId, remaining);

}, {
    body: z.object({
        sender: z.string().max(100),
        text: z.string().max(1000),
    }),
    query: z.object({
        roomId: z.string(),
    })
})

export const app = new Elysia({prefix: '/api'}).use(rooms).use(messages)

export const GET = app.fetch
export const POST = app.fetch