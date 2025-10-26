"use client";

import React, { useState } from "react";
import ChatInterface from "../components/ChatInterface";
import MessageList from "../components/MessageList";
import Image from "next/image";
import { SparklesCore } from "../components/ui/sparkles";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white relativ overflow-hiddene">
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          particleColor="#FFFFFF"
          className="w-full h-full"
        />
      </div>
      <div className="max-w-3xl mx-auto flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto px-4 py-8 scrollbar-hide">
          {messages.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <Image
                src="/krish.jpg"
                alt="Krishna"
                width={100}
                height={100}
                className="rounded-full"
              />
              <h1 className="text-4xl font-bold text-center">
                Talk with <span className="text-indigo-400">Bhagavad Gita</span>
                , find clarity
              </h1>
              <p className="text-zinc-400 text-center">
                Answers for life’s questions, straight from the Gita
              </p>
            </div>
          ) : (
            <MessageList messages={messages} isLoading={isLoading} />
          )}
        </div>
        <div className="px-4 py-6">
          <ChatInterface
            setMessages={setMessages}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    </div>
  );
}
