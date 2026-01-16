"use client"

import {useMutation} from "@tanstack/react-query";
import {api} from "@/lib/eden";
import {useRouter, useSearchParams} from "next/dist/client/components/navigation";
import {useUsername} from "@/hooks/UsernameHook";
import {Suspense} from "react";

export default function Home() {
    return (
        <Suspense>
            <Lobby/>
        </Suspense>
    )
}

function Lobby() {
    const {username} = useUsername();
    const router = useRouter();
    const searchParams = useSearchParams();
    const wasDestroyed = searchParams.get("destroyed") === "true";
    const error = searchParams.get("error");

    const {mutate: createRoom, isPending} = useMutation({
        mutationFn: async () => {
            const res = await api.room.create.post()

            if (res.status === 200) {
                router.push(`/room/${res.data?.roomId}`)
            }
        }
    })

    return (
        <main className="min-h-screen w-full">
            <div className={"flex items-center justify-center min-h-screen"}>
                <div className={"absolute top-36"}>
                    {wasDestroyed && <div className={"bg-red-950/50 border border-red-900 p-4 text-center"}>
                        <p className={"text-red-500 text-sm font-bold"}>ROOM DESTROYED</p>
                        <p className={"text-zinc-500 text-xs mt-1"}>All messages are permanently deleted.</p>
                    </div>}
                    {error === "room-not-found" &&
                        <div className={"bg-red-950/50 border border-red-900 p-4 text-center"}>
                            <p className={"text-red-500 text-sm font-bold"}>ROOM NOT FOUND</p>
                            <p className={"text-zinc-500 text-xs mt-1"}>Room may have expired or never existed.</p>
                        </div>}
                    {error === "room-full" && <div className={"bg-red-950/50 border border-red-900 p-4 text-center"}>
                        <p className={"text-red-500 text-sm font-bold"}>ROOM FULL</p>
                        <p className={"text-zinc-500 text-xs mt-1"}>Room is at it{"'"}s maximum capacity. Create a new
                            one.</p>
                    </div>}
                </div>
                <div>
                    <div className={"text-center mb-10"}>
                        <h1 className={"text-green-500 text-2xl mb-2"}>{">_ "}private_chat_room</h1>
                        <p className={"text-sm text-zinc-500"}>A self destructive and secure chat room</p>
                    </div>
                    <div className="min-w-md  border border-zinc-800 backdrop-blur-md bg-zinc-900/50 p-6 space-y-4">
                        <h2 className={"text-center text-zinc-200"}>Your Identity</h2>
                        <div className={"bg-zinc-950"}>
                            <p className={"px-4 py-2 text-center text-zinc-400"}>{username}</p>
                        </div>
                        <button
                            className={"bg-zinc-200 text-zinc-900 w-full py-3 mt-3 hover:bg-zinc-50 transition-colors cursor-pointer font-bold"}
                            onClick={() => createRoom()}
                        >
                            {isPending ? "CREATING..." : "CREATE SECURE ROOM"}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
