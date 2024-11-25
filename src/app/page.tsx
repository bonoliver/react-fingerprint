"use client";

import { useState } from "react";
import Fingerprint from "./Fingerprint";

export default function Home() {
  const [copyMode, setCopyMode] = useState(false);

  function toggleCopyMode() {
    setCopyMode(!copyMode);
  }

  return (
    <section className="h-screen gap-10 flex items-center justify-center flex-col">
      <h3 className="text-2xl font-bold tracking-tighter">Fingerprint</h3>
      <div className="flex justify-center items-center">
        <Fingerprint copyMode={copyMode} />
      </div>
      <button
        onClick={toggleCopyMode}
        className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-md"
      >
        {copyMode ? "Disable" : "Enable"} Copy Mode
      </button>
    </section>
  );
}
