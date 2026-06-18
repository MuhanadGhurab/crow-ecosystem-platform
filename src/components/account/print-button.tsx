"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="text-sm text-cyan-400 hover:text-cyan-300"
    >
      Print
    </button>
  );
}
