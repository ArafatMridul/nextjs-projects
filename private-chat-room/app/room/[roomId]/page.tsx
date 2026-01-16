"use client"

import {useParams, useRouter} from "next/dist/client/components/navigation";
import {useEffect, useRef, useState} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {api} from "@/lib/eden";
import {useUsername} from "@/hooks/UsernameHook";
import {format} from "date-fns/format";
import {useRealtime} from "@/lib/realtime-client";

const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const Page = () => {
    const [copied, setCopied] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
    const [input, setInput] = useState("");
    const {username} = useUsername()
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLDivElement>(null);

    const {roomId}: { roomId: string } = useParams();

    const copyText = async () => {
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    }

    const {mutate: sendMessage, isPending} = useMutation({
        mutationFn: async ({text}: { text: string }) => {
            await api.messages.post({sender: username, text}, {query: {roomId}});
            setInput("");

        }
    })

    const {data: messages, refetch} = useQuery({
        queryKey: ["messages", roomId],
        queryFn: async () => {
            const res = await api.messages.get({query: {roomId}})
            return res.data;
        },
    })

    useRealtime({
        channels: [roomId],
        events: ["chat.message", "chat.destroy"],
        onData: async ({event}) => {
            if (event === "chat.message") {
                await refetch();
            } else if (event === "chat.destroy") {
                router.push("/?destroyed=true");
            }
        }
    })

    const {data: ttlData} = useQuery({
        queryKey: ["ttl", roomId],
        queryFn: async () => {
            const res = await api.room.ttl.get({query: {roomId}})
            return res.data;
        }
    })

    useEffect(() => {
        function main() {
            if (ttlData?.ttl !== undefined) {
                setTimeRemaining(ttlData.ttl)
            }
        }

        main();
    }, [ttlData]);

    useEffect(() => {
        if (timeRemaining === null) return;

        if (timeRemaining === 0) {
            router.push("/?destroyed=true");
            return;
        }

        const timeout = setTimeout(() => {
            setTimeRemaining(prev => (prev ?? 1) - 1);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [timeRemaining, router]);

    const {mutate: destroyRoom} = useMutation({
        mutationFn: async () => {
            await api.room.delete(null, {query: {roomId}});
        }
    })

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollTop = messageRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <main className={"h-screen flex flex-col"}>
            <header className={"py-6 border-b border-zinc-700"}>
                <div className={"max-w-5xl mx-auto flex items-center gap-10"}>
                    <div className={"pr-10 border-r border-dashed border-zinc-600"}>
                        ROOM ID
                        <div className={"flex items-center gap-3"}>
                            <p className={"text-green-500 text-xl font-bold"}>{roomId}</p>
                            <div className={"w-12 mx-auto"}>
                                <button
                                    onClick={copyText}
                                    className={`border px-3 py-1.5 text-[0.5rem] font-extrabold transition-colors cursor-pointer ${copied ? "bg-zinc-500" : "bg-zinc-800"}`}>{copied ? "COPIED!" : "COPY"}</button>
                            </div>
                        </div>
                    </div>
                    <div className={"flex items-center justify-between flex-1"}>
                        <div>
                            <p>SELF-DESTRUCT IN</p>
                            <span
                                className={timeRemaining !== null && timeRemaining > 60 ? "text-yellow-500" : "text-red-400"}>{timeRemaining !== null ? formatTimeRemaining(timeRemaining) : "--:--"}</span>
                        </div>
                        <div>
                            <button
                                onClick={() => destroyRoom()}
                                className={"ring-2 border-none ring-transparent font-extrabold hover:ring-red-200 transition-all duration-300 ease-in-out cursor-pointer px-8 py-2 bg-red-500"}>DESTROY
                                NOW
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <section
                ref={messageRef}
                className={"flex-1 max-w-5xl w-full mx-auto overflow-y-scroll scroll-smooth scrollbar-custom py-8 px-4"}>
                {/*    MESSAGING SECTION    */}
                {messages?.messages.length === 0 && <div className={"flex items-center justify-center h-full"}>
                    <p className={"text-zinc-600 text-sm font-extrabold"}>No messages yet, start the conversation.</p>
                </div>}
                {messages?.messages.map(m =>
                    <div className={"flex flex-col items-start"} key={m.id}>
                        <div className={`max-w-[80%] group ${m.sender === username && "self-end"}`}>
                            <div
                                className={`flex items-baseline gap-3 mb-1 ${m.sender === username && "flex-row-reverse"}`}>
                               <span
                                   className={`text-xs font-bold uppercase ${m.sender === username ? "text-green-500" : "text-blue-500"}`}>
                                    {m.sender === username ? "YOU" : m.sender}
                               </span>
                                <span className={"text-[10px] text-zinc-600"}>
                                    {format(m.timestamp, "HH:mm")}
                                </span>
                            </div>
                            <p className={`text-sm text-zinc-300 leading-relaxed break-all mb-4 ${m.sender === username && "text-end"}`}>
                                {m.text}
                            </p>
                        </div>
                    </div>
                )}
            </section>

            <footer className={"bg-zinc-900 py-6"}>
                <div className={"max-w-5xl mx-auto flex items-center gap-4"}>
                    <div className={"flex-1 flex items-center bg-black"}>
                        <div className={"flex font-extrabold"}>
                            <span className={"px-2 text-green-500"}>{"~ "}</span>
                            <span className={"text-green-500"}>{"> "}</span>
                        </div>
                        <input autoFocus ref={inputRef} type="text" value={input}
                               onKeyDown={(e) => {
                                   if (e.key === "Enter" && input.trim() && !isPending) {
                                       sendMessage({text: input})
                                       inputRef.current?.focus();
                                   }
                               }}
                               placeholder={"type message..."}
                               onChange={(e) => setInput(e.target.value)}
                               className={"px-4 py-3 text-xl w-full focus:outline-none"}/>
                    </div>
                    <button
                        onClick={() => {
                            sendMessage({text: input});
                            inputRef.current?.focus();
                        }}
                        disabled={!input.trim() || isPending}
                        className={"w-32 py-2 border border-zinc-400 bg-zinc-600 hover:bg-zinc-500 cursor-pointer transition-colors"}>
                        {isPending ? "SENDING..." : "SEND"}
                    </button>
                </div>
            </footer>
        </main>
    );
};

export default Page;