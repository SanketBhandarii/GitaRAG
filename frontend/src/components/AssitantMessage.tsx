  import React, { useEffect, useState } from "react";
  import ReactMarkdown from "react-markdown";
  import VerseTile from "./VerseTile";

  interface AssistantMessageProps {
    content: string;
  }

  const parseMessage = (content: string) => {
    const blocks: any[] = [];
    
    const regex = /\[VERSE title="(.+?)"\]([\s\S]*?)\[\/VERSE\]/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        blocks.push({ type: "text", value: content.slice(lastIndex, match.index) });
      }
      blocks.push({
        type: "verse",
        title: match[1],
        value: match[2].trim(),
      });

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      blocks.push({ type: "text", value: content.slice(lastIndex) });
    }

    return blocks;
  };

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
          setDisplayedText(prev => prev + content[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 10);
        return () => clearTimeout(timeout);
      }
    }, [content, currentIndex]);

    const blocks = parseMessage(displayedText);

    return (
      <div className="flex justify-start">
        <div className="bg-zinc-900 rounded-2xl px-4 py-3 max-w-[85%]">

          {blocks.map((block, i) => {
            if (block.type === "verse") {
              return (
                <VerseTile key={i} title={block.title}>
                  {block.value}
                </VerseTile>
              );
            }

            return (
              <ReactMarkdown
                key={i}
                components={{
                  p: ({ children }) => (
                    <p className="text-white mb-3 leading-relaxed">{children}</p>
                  ),
                }}
              >
                {block.value}
              </ReactMarkdown>
            );
          })}

          {currentIndex < content.length && (
            <span className="inline-block w-1 h-4 bg-white animate-pulse ml-1" />
          )}
        </div>
      </div>
    );
  };

  export default AssistantMessage;
