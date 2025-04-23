// helpers/useGachaStyle.ts
import { useState, useEffect } from "react";

export type Style = "blue" | "green" | "glass" | "toon" | "rainbow";
const STYLES: Style[] = ["blue", "green", "glass", "toon", "rainbow"];

export function useGachaStyle(capsuleId?: string) {
  // default to blue
  const [style, setStyle] = useState<Style>("blue");

  useEffect(() => {
    // if no capsuleId, just keep "blue" and don’t fetch
    if (!capsuleId) return;

    fetch(`/api/capsules/${capsuleId}`)
      .then((r) => r.json())
      .then((data: { style: Style }) => setStyle(data.style))
      .catch(() => {
        /* on error we’ll just leave it as whatever it was */
      });
  }, [capsuleId]);

  const nextStyle = () => {
    // don’t attempt to patch if there’s no capsuleId
    if (!capsuleId) return;

    const idx = STYLES.indexOf(style);
    const next = STYLES[(idx + 1) % STYLES.length];
    fetch(`/api/capsules/${capsuleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ style: next }),
    }).then((r) => {
      if (r.ok) setStyle(next);
    });
  };

  return { style, nextStyle };
}
