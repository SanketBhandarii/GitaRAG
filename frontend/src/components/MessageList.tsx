// src/components/MessageList.tsx
import React, { useEffect, useRef } from "react";
import UserMessage from "./UserMessage";
import AssistantMessage from "./AssitantMessage";
import { Shimmer } from '@/src/ai-elements/shimmer';
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-6">
      
      {messages.map((message) => (
        <div key={message.id}>
          {message.role === "user" ? <UserMessage content={message.content} /> : <AssistantMessage content={message.content} />}
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-zinc-900 rounded-2xl px-4 py-3">
            <div className="flex space-x-2">
              <Shimmer>Generating the response</Shimmer>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;