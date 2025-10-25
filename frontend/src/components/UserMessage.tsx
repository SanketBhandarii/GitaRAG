// src/components/UserMessage.tsx
import React from "react";

interface UserMessageProps {
  content: string;
}

const UserMessage: React.FC<UserMessageProps> = ({ content }) => (
  <div className="flex justify-end">
    <div className="bg-zinc-800 rounded-2xl px-4 py-3 max-w-[80%]">
      <p className="text-white whitespace-pre-wrap">{content}</p>
    </div>
  </div>
);

export default UserMessage;