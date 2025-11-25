import React from "react";

interface VerseTileProps {
  title: string;
  children: string;
}

const VerseTile: React.FC<VerseTileProps> = ({ title, children }) => {
  return (
    <div className="my-3 p-4 bg-zinc-800 border border-indigo-500 rounded-xl">
      <p className="text-indigo-300 font-semibold mb-1">📜 {title}</p>
      <p className="text-zinc-200 italic">{children}</p>
    </div>
  );
};

export default VerseTile;
