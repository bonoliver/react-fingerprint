import { useState, useCallback } from "react";
import { Grid } from "./types";
import { ClipboardEvent, KeyboardEvent, ChangeEvent } from "react";

export const useFingerprint = (
  initialFingerprint: string = "",
  onFingerprintChange?: (fingerprint: string) => void
) => {
  const [fingerprintGrid, setFingerprintGrid] = useState<Grid>(() => {
    if (initialFingerprint) {
      const chars = initialFingerprint.split("");
      return Array(4)
        .fill(null)
        .map((_, i) => chars.slice(i * 4, (i + 1) * 4));
    }
    return Array(4)
      .fill(null)
      .map(() => Array(4).fill(""));
  });
  const [focusedCell, setFocusedCell] = useState<[number, number]>([0, 0]);

  const updateFingerprint = useCallback(
    (newGrid: Grid) => {
      const newFingerprint = newGrid.flat().join("");
      onFingerprintChange?.(newFingerprint);
    },
    [onFingerprintChange]
  );

  const handleInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>, row: number, col: number) => {
      const input = event.target.value.slice(-1);

      if (/^[A-Za-z0-9]$/.test(input)) {
        const newFingerprint = structuredClone(fingerprintGrid);
        newFingerprint[row][col] = input;
        setFingerprintGrid(newFingerprint);
        updateFingerprint(newFingerprint);
        moveFocus(row, col, 1);
      }
    },
    [fingerprintGrid]
  );

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLInputElement>, row: number, col: number) => {
      event.preventDefault();
      const pastedText = event.clipboardData?.getData("text") || "";
      const cleanedText = pastedText.replace(/[^A-Za-z0-9]/gi, "");
      const chars = cleanedText.slice(0, 16).split("");

      const newFingerprint = [...fingerprintGrid];
      chars.forEach((char, index) => {
        const targetRow = Math.floor(index / 4);
        const targetCol = index % 4;
        if (targetRow < 4 && targetCol < 4) {
          newFingerprint[targetRow][targetCol] = char;
        }
      });

      setFingerprintGrid(newFingerprint);
      updateFingerprint(newFingerprint);

      const nextIndex = Math.min(chars.length, 15);
      const nextRow = Math.floor(nextIndex / 4);
      const nextCol = nextIndex % 4;
      setFocusedCell([nextRow, nextCol]);
    },
    [fingerprintGrid, updateFingerprint]
  );

  const moveFocus = useCallback(
    (row: number, col: number, direction: number) => {
      let newRow = row;
      let newCol = col + direction;

      if (newCol < 0) {
        newRow--;
        newCol = 3;
      } else if (newCol > 3) {
        newRow++;
        newCol = 0;
      }

      if (newRow >= 0 && newRow < 4 && newCol >= 0 && newCol < 4) {
        setFocusedCell([newRow, newCol]);
        setTimeout(() => {
          const element = document.getElementById(`cell-${newRow}-${newCol}`);
          if (element instanceof HTMLInputElement) {
            element.focus();
          }
        }, 0);
      }
    },
    []
  );

  const handleKeydown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
      if (event.key.length === 1 && /^[A-Za-z0-9]$/.test(event.key)) {
        event.preventDefault();
        const newFingerprint = structuredClone(fingerprintGrid);
        newFingerprint[row][col] = event.key;
        setFingerprintGrid(newFingerprint);
        updateFingerprint(newFingerprint);
        moveFocus(row, col, 1);
        return;
      }

      switch (event.key) {
        case "ArrowRight":
          moveFocus(row, col, 1);
          break;
        case "ArrowLeft":
          moveFocus(row, col, -1);
          break;
        case "ArrowUp":
          moveFocus(row - 1, col, 0);
          break;
        case "ArrowDown":
          moveFocus(row + 1, col, 0);
          break;
        case "Backspace":
          const newFingerprint = structuredClone(fingerprintGrid);
          newFingerprint[row][col] = "";
          setFingerprintGrid(newFingerprint);
          updateFingerprint(newFingerprint);
          moveFocus(row, col, -1);
          break;
      }
    },
    [fingerprintGrid, updateFingerprint, moveFocus]
  );

  return {
    fingerprintGrid,
    setFingerprintGrid,
    focusedCell,
    setFocusedCell,
    handlePaste,
    moveFocus,
    updateFingerprint,
    handleInput,
    handleKeydown,
  };
};
