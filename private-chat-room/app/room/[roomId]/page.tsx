"use client"

import {useParams} from "next/dist/client/components/navigation";
import {useRef, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {api} from "@/lib/eden";
import {useUsername} from "@/hooks/UsernameHook";

const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const Page = () => {
    const [copied, setCopied] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(121)
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const {username} = useUsername()

    const {roomId} = useParams();

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
            // @ts-ignore
            await api.messages.post({sender: username, text}, {query: {roomId}});
        }
    })

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
                                className={"ring-2 border-none ring-transparent font-extrabold hover:ring-red-200 transition-all duration-300 ease-in-out cursor-pointer px-8 py-2 bg-red-500"}>DESTROY
                                NOW
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <section className={"flex-1"}>
                {/*    MESSAGING SECTION    */}
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
                                   if (e.key === "Enter" && input.trim()) {
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
                        className={"px-6 py-2 border border-zinc-400 bg-zinc-600 hover:bg-zinc-500 cursor-pointer transition-colors"}>SEND
                    </button>
                </div>
            </footer>
        </main>
    );
};

export default Page;