// src/components/AssistantMessage.tsx
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

interface AssistantMessageProps {
  content: string;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({ content }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [content]);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + content[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [content, currentIndex]);

  return (
    <div className="flex justify-start">
      <div className="bg-zinc-900 rounded-2xl px-4 py-3 max-w-[85%]">
        <ReactMarkdown
       
          components={{
            p: ({ children }) => <p className="text-white mb-3 leading-relaxed">{children}</p>,
            strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
            blockquote: ({ children }) => <blockquote className="border-l-4 border-orange-500 pl-4 italic text-zinc-200 my-3 bg-zinc-800 py-2 rounded-r">{children}</blockquote>,
          }}
        >
          {displayedText}
        </ReactMarkdown>
        {currentIndex < content.length && <span className="inline-block w-1 h-4 bg-white animate-pulse ml-1" />}
      </div>
    </div>
  );
};

export default AssistantMessage;