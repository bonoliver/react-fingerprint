"use client";
import { useEffect, useState } from "react";
import { useFingerprint } from "./useFingerprint";
import { CheckIcon, FingerprintIcon } from "lucide-react";
import { cn } from "./utils";

interface FingerprintProps {
  defaultFingerprint?: string;
  onFingerprintChange?: (fingerprint: string) => void;
  copyMode?: boolean;
}

export default function Fingerprint({
  defaultFingerprint = "",
  onFingerprintChange,
  copyMode = false,
}: FingerprintProps) {
  const {
    fingerprintGrid,
    setFingerprintGrid,
    handlePaste,
    focusedCell,
    setFocusedCell,
    handleInput,
    handleKeydown,
  } = useFingerprint(defaultFingerprint, onFingerprintChange);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (defaultFingerprint) {
      const chars = defaultFingerprint.split("");
      setFingerprintGrid(
        Array(4)
          .fill(null)
          .map((_, i) => chars.slice(i * 4, (i + 1) * 4))
      );
    }
  }, [defaultFingerprint]);

  function handleCopy() {
    navigator.clipboard.writeText(fingerprintGrid.flat().join(""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      role="group"
      aria-label="Fingerprint"
      className="relative group"
    >
      <fieldset className="flex flex-col gap-2.5 border-0 m-0 p-0">
        <legend className="sr-only">Enter fingerprint code</legend>
        {fingerprintGrid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2.5">
            {row.map((cell, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`}>
                <label
                  htmlFor={`cell-${rowIndex}-${colIndex}`}
                  className="sr-only"
                >
                  Character {rowIndex * 4 + colIndex + 1} of fingerprint
                </label>
                <input
                  type="text"
                  maxLength={1}
                  className={cn(
                    "w-[60px] h-[60px] text-center text-lg bg-neutral-950 border focus:outline-none transition-colors hover:bg-taostats/20 duration-150 ease-in-out caret-transparent",
                    focusedCell[0] === rowIndex && focusedCell[1] === colIndex
                      ? "border-taostats bg-taostats/20"
                      : "border-neutral-800"
                  )}
                  id={`cell-${rowIndex}-${colIndex}`}
                  value={fingerprintGrid[rowIndex][colIndex]}
                  onChange={(e) => handleInput(e, rowIndex, colIndex)}
                  onKeyDown={(e) => handleKeydown(e, rowIndex, colIndex)}
                  onPaste={(e) => handlePaste(e, rowIndex, colIndex)}
                  onClick={() => setFocusedCell([rowIndex, colIndex])}
                  inputMode="text"
                />
              </div>
            ))}
          </div>
        ))}
      </fieldset>
      {copyMode && (
        <button
          onClick={() => handleCopy()}
          className={cn(
            "absolute opacity-0 flex flex-col items-center justify-center group-hover:opacity-100 transition-opacity duration-150 ease-in-out top-0 left-0 w-full h-full bg-neutral-900 border border-neutral-800",
            copied ? "opacity-100" : ""
          )}
        >
          {copied ? (
            <CheckIcon className="size-8" />
          ) : (
            <FingerprintIcon className="size-8" />
          )}
        </button>
      )}
    </form>
  );
}
