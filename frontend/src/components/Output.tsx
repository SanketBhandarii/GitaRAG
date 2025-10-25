import React, { useEffect, useState } from "react";
import { Response } from "../ai-elements/response";

interface OutputProps {
  res: string;
  isLoading: boolean;
}

const Output: React.FC<OutputProps> = ({ res, isLoading }) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (!res) {
      setDisplayedText("");
      setCurrentIndex(0);
      return;
    }

    if (currentIndex < res.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + res[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 20);

      return () => clearTimeout(timeout);
    }
  }, [res, currentIndex]);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [res]);

  if (!res && !isLoading) return null;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
      <div className="text-white">
        {displayedText}
        {isLoading && !res && (
          <span className="inline-block w-2 h-4 bg-white animate-pulse ml-1" />
        )}
      </div>
    </div>
  );
};

export default Output;