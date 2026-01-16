"use client"

import {useMutation} from "@tanstack/react-query";
import {api} from "@/lib/eden";
import {useRouter, useSearchParams} from "next/dist/client/components/navigation";
import {useUsername} from "@/hooks/UsernameHook";
import {Suspense, useEffect} from "react";

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

    // Auto-redirect to clean URL after 3 seconds
    useEffect(() => {
        if (wasDestroyed || error) {
            const timer = setTimeout(() => {
                router.push("/");
            }, 3500); // Extended to allow for fade-out animation

            return () => clearTimeout(timer);
        }
    }, [wasDestroyed, error, router]);

    const {mutate: createRoom, isPending} = useMutation({
        mutationFn: async () => {
            const res = await api.room.create.post()

            if (res.status === 200) {
                router.push(`/room/${res.data?.roomId}`)
            }
        }
    })

    return (
        <main className="min-h-screen w-full bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950">
            <div className={"px-4 md:px-10 lg:px-0 md:flex md:items-center md:justify-center min-h-screen"}>
                <div className={"absolute w-70 md:w-auto top-14 md:top-20 left-1/2 -translate-x-1/2 z-10"}>
                    {wasDestroyed &&
                        <div
                            className={"bg-red-950/80 backdrop-blur-sm border border-red-800/50 p-4 rounded-lg shadow-lg shadow-red-900/20 animate-[slideDown_0.3s_ease-out,fadeOut_0.5s_ease-in_3s_forwards]"}>
                            <div className={"flex items-center justify-center gap-2 mb-2"}>
                                <span className={"text-xl"}>⚠️</span>
                                <p className={"text-red-400 text-sm md:text-base font-bold tracking-wide"}>ROOM
                                    DESTROYED</p>
                            </div>
                            <p className={"text-zinc-400 text-xs md:text-sm text-center leading-relaxed"}>
                                All messages are permanently deleted.
                                <br/>
                                Create another room below
                            </p>
                        </div>
                    }
                    {error === "room-not-found" &&
                        <div
                            className={"bg-red-950/80 backdrop-blur-sm border border-red-800/50 p-4 rounded-lg shadow-lg shadow-red-900/20 animate-[slideDown_0.3s_ease-out,fadeOut_0.5s_ease-in_3s_forwards]"}>
                            <div className={"flex items-center justify-center gap-2 mb-2"}>
                                <span className={"text-xl"}>❌</span>
                                <p className={"text-red-400 text-sm md:text-base font-bold tracking-wide"}>ROOM NOT
                                    FOUND</p>
                            </div>
                            <p className={"text-zinc-400 text-xs md:text-sm text-center leading-relaxed"}>
                                Room may have expired or never existed.
                                <br/>
                                Create another room below
                            </p>
                        </div>
                    }
                    {error === "room-full" &&
                        <div
                            className={"bg-red-950/80 backdrop-blur-sm border border-red-800/50 p-4 rounded-lg shadow-lg shadow-red-900/20 animate-[slideDown_0.3s_ease-out,fadeOut_0.5s_ease-in_3s_forwards]"}>
                            <div className={"flex items-center justify-center gap-2 mb-2"}>
                                <span className={"text-xl"}>🚫</span>
                                <p className={"text-red-400 text-sm md:text-base font-bold tracking-wide"}>ROOM FULL</p>
                            </div>
                            <p className={"text-zinc-400 text-xs md:text-sm text-center leading-relaxed"}>
                                Room is at its maximum capacity.
                                <br/>
                                Create a new one below
                            </p>
                        </div>
                    }
                </div>

                <div className={"min-h-screen flex items-center justify-center"}>
                    <div className={"max-w-md w-full"}>
                        <div className={"text-center mb-10"}>
                            <div className={"mb-4"}>
                                <div className={"text-5xl md:text-6xl mb-4"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"
                                         viewBox="0 0 88 99.998" className={"mx-auto"}>
                                        <path fill="#F1C40E"
                                              d="M4 39.997h80a4 4 0 0 1 4 4v52a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-52a4 4 0 0 1 4-4z"/>
                                        <path fill="#FFF55C"
                                              d="M4 35.997h80a4 4 0 0 1 4 4v5a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-5a4 4 0 0 1 4-4z"/>
                                        <path fill="#364B5E"
                                              d="M73 38.997c-4.418 0-8 1.567-8 3.5c0 1.934 3.582 3.5 8 3.5s8-1.567 8-3.5s-3.582-3.5-8-3.5zm-58 0c-4.418 0-8 1.567-8 3.5c0 1.934 3.582 3.5 8 3.5s8-1.567 8-3.5s-3.582-3.5-8-3.5z"/>
                                        <path fill="#EBEDEE"
                                              d="M44 0C24.701 0 9 14.709 9 34.019v7.978c0 .553 2.687 2 6 2s6-1.447 6-2l-.021-.071v-7.907c0-12.701 10.327-22.034 23.021-22.034c12.693 0 23.021 9.333 23.021 22.034v7.907l-.021.071c0 .553 2.688 2 6 2s6-1.447 6-2v-7.978C79 14.709 63.299 0 44 0z"/>
                                        <path fill="#BDC3C7"
                                              d="M44 5.999c-15.99 0-29 13.091-29 29.183v8.815c3.313 0 6-1.447 6-2l-.021-.071v-7.907c0-12.701 10.327-22.034 23.021-22.034c12.693 0 23.021 9.333 23.021 22.034v7.907l-.021.071c0 .553 2.688 2 6 2v-8.815C73 19.091 59.99 5.999 44 5.999z"/>
                                        <path fill="#D8B00C" d="M0 95.998a4 4 0 0 0 4 4h80a4 4 0 0 0 4-4v-3H0v3z"/>
                                        <path fill="#E5BA0D"
                                              d="M4 48.997a3.99 3.99 0 0 1-3.858-3H0v50a4 4 0 0 0 4 4h40v-51H4z"/>
                                        <path fill="#CDA70C" d="M0 92.998v3a4 4 0 0 0 4 4h40v-7H0z"/>
                                    </svg>
                                </div>
                            </div>
                            <h1 className={"text-green-400 text-xl md:text-3xl mb-3 font-mono font-bold tracking-wide"}>
                                {">_ "}private_chat_room
                            </h1>
                            <p className={"text-sm md:text-base text-zinc-400 tracking-wide"}>
                                A self-destructive and secure chat room
                            </p>
                            <div
                                className={"flex items-center justify-center gap-3 mt-4 text-xs md:text-sm text-zinc-500"}>
                        <span className={"flex items-center gap-1"}>
                            <span className={"text-green-400"}>✓</span> End-to-end secure
                        </span>
                                <span>•</span>
                                <span className={"flex items-center gap-1"}>
                            <span className={"text-green-400"}>✓</span> Auto-destruct
                        </span>
                            </div>
                        </div>

                        <div
                            className="w-full border border-zinc-700/50 backdrop-blur-md bg-zinc-800/30 rounded-lg p-6 md:p-8 space-y-6 shadow-2xl">
                            <div>
                                <h2 className={"text-center text-sm md:text-base text-zinc-300 font-semibold tracking-wider mb-4"}>
                                    YOUR IDENTITY
                                </h2>
                                <div className={"bg-black/60 border border-zinc-700/50 rounded-lg overflow-hidden"}>
                                    <div className={"flex items-center px-4 py-3"}>
                                        <span className={"text-green-400 font-mono text-sm mr-2"}>~$</span>
                                        <p className={"text-center text-sm md:text-base text-green-400 font-mono font-semibold flex-1"}>
                                            {username}
                                        </p>
                                    </div>
                                </div>
                                <p className={"text-xs text-zinc-500 text-center mt-2"}>
                                    This is your anonymous identifier for this session
                                </p>
                            </div>

                            <button
                                className={"bg-green-600 text-sm md:text-base text-white w-full py-3.5 rounded-lg hover:bg-green-500 transition-all duration-200 cursor-pointer font-bold tracking-wide shadow-lg hover:shadow-green-500/30 hover:scale-[1.02] disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:scale-100"}
                                onClick={() => createRoom()}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <span className={"flex items-center justify-center gap-2"}>
                                <span className={"animate-spin"}>⚙️</span>
                                CREATING...
                            </span>
                                ) : (
                                    <span className={"flex items-center justify-center gap-2"}>
                                <span>🔐</span>
                                CREATE SECURE ROOM
                            </span>
                                )}
                            </button>
                        </div>

                        <div className={"mt-8 text-center text-xs text-zinc-600"}>
                            <p>Messages are encrypted and automatically destroyed</p>
                            <p className={"mt-1"}>No logs • No tracking • No storage</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideDown {
                    from {
                        transform: translateY(-100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes fadeOut {
                    from {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                }
            `}</style>
        </main>
    );
}