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
        <main className={"h-screen flex flex-col bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950"}>
            <header className={"py-4 md:py-6 border-b border-zinc-700/50 backdrop-blur-sm bg-zinc-900/30"}>
                <div className={"sm:max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10"}>
                    <div
                        className={"border-b md:border-b-0 md:border-r border-dashed border-zinc-600/50 w-full md:w-auto flex items-center justify-center"}>
                        <div
                            className={"px-6 md:px-0 pb-4 md:pb-0 md:pr-10 text-sm md:text-base"}>
                            <p className={"text-zinc-400 text-xs md:text-sm mb-1 tracking-wider"}>ROOM ID</p>
                            <div className={"flex items-center gap-3"}>
                                <p className={"text-green-400 text-base md:text-xl font-mono font-bold tracking-wide"}>{roomId}</p>
                                <button
                                    onClick={copyText}
                                    className={`rounded-md border border-zinc-600 px-3 py-1.5 text-[0.6rem] md:text-xs font-bold transition-all duration-200 cursor-pointer hover:scale-105 ${copied ? "bg-green-600 border-green-500 text-white" : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"}`}>
                                    {copied ? "✓ COPIED" : "COPY"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={"flex items-center justify-between flex-1 px-10 md:px-0 pt-4 md:pt-0 w-full"}>
                        <div>
                            <p className={"text-zinc-400 text-xs md:text-sm mb-1 tracking-wider"}>SELF-DESTRUCT IN</p>
                            <span
                                className={`font-mono text-lg md:text-2xl font-bold ${timeRemaining !== null && timeRemaining > 60 ? "text-yellow-400" : "text-red-400 animate-pulse"}`}>
                                {timeRemaining !== null ? formatTimeRemaining(timeRemaining) : "--:--"}
                            </span>
                        </div>
                        <button
                            onClick={() => destroyRoom()}
                            className={"group relative text-xs md:text-sm font-bold cursor-pointer px-4 md:px-8 py-2.5 bg-red-600 hover:bg-red-500 transition-all duration-300 border border-red-500 hover:shadow-lg hover:shadow-red-500/50 hover:scale-105"}>
                            <span className={"relative z-10"}>⚠ DESTROY NOW</span>
                        </button>
                    </div>
                </div>
            </header>
            <section
                ref={messageRef}
                className={"flex-1 max-w-5xl w-full mx-auto overflow-y-scroll scroll-smooth scrollbar-custom py-8 px-4"}>
                {messages?.messages.length === 0 &&
                    <div className={"flex items-center justify-center h-full"}>
                        <div className={"text-center"}>
                            <div className={"text-4xl mb-4 opacity-20"}>💬</div>
                            <p className={"text-zinc-500 text-sm font-semibold tracking-wide"}>
                                No messages yet. Start the conversation.
                            </p>
                        </div>
                    </div>
                }
                {messages?.messages.map(m =>
                    <div className={"flex flex-col items-start mb-6"} key={m.id}>
                        <div className={`max-w-[85%] md:max-w-[75%] group ${m.sender === username && "self-end"}`}>
                            <div
                                className={`flex items-baseline gap-2 mb-2 ${m.sender === username && "flex-row-reverse"}`}>
                               <span
                                   className={`text-xs font-bold uppercase tracking-wider ${m.sender === username ? "text-green-400" : "text-blue-400"}`}>
                                    {m.sender === username ? "YOU" : m.sender}
                               </span>
                                <span className={"text-[10px] text-zinc-600 font-mono"}>
                                    {format(m.timestamp, "HH:mm")}
                                </span>
                            </div>
                            <div className={`relative ${m.sender === username && "flex justify-end"}`}>
                                <p className={`text-sm md:text-base text-zinc-200 leading-relaxed wrap-break-word px-4 py-3 rounded-lg backdrop-blur-sm ${
                                    m.sender === username
                                        ? "bg-green-900/30 border border-green-700/30"
                                        : "bg-zinc-800/50 border border-zinc-700/30"
                                }`}>
                                    {m.text}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <footer className={"bg-zinc-900/50 backdrop-blur-md py-6 px-3 md:px-6 border-t border-zinc-700/50"}>
                <div className={"max-w-5xl mx-auto flex items-center gap-2 md:gap-4"}>
                    <div
                        className={"flex-1 flex items-center bg-black/60 border border-zinc-700/50 overflow-hidden hover:border-zinc-600/50 transition-colors focus-within:border-green-500/50"}>
                        <div className={"flex text-xs md:text-base font-bold pl-3"}>
                            <span className={"text-green-400 font-mono"}>{"~ "}</span>
                            <span className={"text-green-400 font-mono"}>{"> "}</span>
                        </div>
                        <input
                            autoFocus
                            ref={inputRef}
                            type="text"
                            value={input}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && input.trim() && !isPending) {
                                    sendMessage({text: input})
                                    inputRef.current?.focus();
                                }
                            }}
                            placeholder={"Type your message..."}
                            onChange={(e) => setInput(e.target.value)}
                            className={"px-3 md:px-4 py-3 md:py-3.5 text-xs md:text-base w-full focus:outline-none bg-transparent text-zinc-100 placeholder:text-zinc-600"}
                        />
                    </div>
                    <button
                        onClick={() => {
                            sendMessage({text: input});
                            inputRef.current?.focus();
                        }}
                        disabled={!input.trim() || isPending}
                        className={"w-16 text-xs md:text-sm md:w-32 py-3 md:py-3.5 border border-zinc-600 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed cursor-pointer transition-all duration-200 font-bold tracking-wide hover:scale-105 disabled:scale-100"}>
                        {isPending ? "SENDING..." : "SEND"}
                    </button>
                </div>
            </footer>
        </main>
    );
};

export default Page;