// src/components/ChatInterface.tsx
import React, { useState, useRef } from "react";
import {
  PromptInput,
  PromptInputBody,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputSpeechButton,
  PromptInputButton,
} from "@/src/ai-elements/prompt-input";
import { ArrowUp, GlobeIcon, Square } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
}

interface ChatInterfaceProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ setMessages, setIsLoading }) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const stopGeneration = () => {
    abortControllerRef.current?.abort();
    setIsGenerating(false);
    setIsLoading(false);
  };

  const submitPrompt = async () => {
    if (!prompt.trim() || isGenerating) return;

    const userPrompt = prompt.trim();
    setMessages((prev) => [...prev, { role: "user", content: userPrompt, id: Date.now().toString() }]);
    setPrompt("");
    setIsGenerating(true);
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch(`${BACKEND_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_query: userPrompt }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      setPrompt("");
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer, id: (Date.now() + 1).toString() }]);
    } catch (error: any) {
      if (error.name !== "AbortError") {
        setMessages((prev) => [...prev, { role: "assistant", content: "Please try to refresh page", id: (Date.now() + 1).toString() }]);
      }
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  return (
    <PromptInputProvider>
      <PromptInput onSubmit={submitPrompt} className="bg-zinc-900 rounded-xl">
        <PromptInputBody className="bg-zinc-900">
          <PromptInputTextarea
            onChange={(e) => !isGenerating && setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && !isGenerating && (e.preventDefault(), submitPrompt())}
            value={prompt}
            disabled={isGenerating}
            placeholder={isGenerating ? "Generating..." : "Ask Krishna anything..."}
            className="bg-transparent text-white placeholder:text-zinc-500 resize-none min-h-[60px] disabled:opacity-50"
          />
        </PromptInputBody>
        <PromptInputFooter className="bg-zinc-900 rounded-xl">
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger
                className="text-zinc-400 hover:text-white"
                disabled={true}
              />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
            <PromptInputSpeechButton
              disabled={true}
              className="text-zinc-400 hover:bg-zinc-700 hover:text-white"
            />
            <PromptInputButton className="text-zinc-400 hover:bg-zinc-700 hover:text-white" disabled={true}>
              <GlobeIcon size={16} className="text-zinc-400" />
              <span className="">Search</span>
            </PromptInputButton>
          </PromptInputTools>
          {isGenerating ? (
            <button onClick={stopGeneration} className="bg-white text-black hover:bg-zinc-200 rounded-lg px-3 py-2">
              <Square className="w-4 h-4" fill="currentColor" />
            </button>
          ) : (
            <PromptInputSubmit disabled={!prompt.trim()} status="ready" className="bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-200">
              <ArrowUp className="w-5 h-5" />
            </PromptInputSubmit>
          )}
        </PromptInputFooter>
      </PromptInput>
    </PromptInputProvider>
  );
};

export default ChatInterface;