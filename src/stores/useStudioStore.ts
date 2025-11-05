import { create } from "zustand";

type Format = "instagram-post" | "instagram-reel" | "linkedin" | "tiktok";
type Step = 0 | 1 | 2 | 3; // 0 Preset, 1 Ideia, 2 Texto, 3 Visual

interface StudioState {
  format: Format;
  step: Step;
  idea: string;
  caption: string;
  hashtags: string[];
  setFormat: (f: Format) => void;
  next: () => void;
  prev: () => void;
  setIdea: (v: string) => void;
  setCaption: (v: string) => void;
  setHashtags: (v: string[]) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  format: "instagram-post",
  step: 0,
  idea: "",
  caption: "",
  hashtags: [],
  setFormat: (format) => set({ format }),
  next: () => set((s) => ({ step: (Math.min(3, s.step + 1) as Step) })),
  prev: () => set((s) => ({ step: (Math.max(0, s.step - 1) as Step) })),
  setIdea: (idea) => set({ idea }),
  setCaption: (caption) => set({ caption }),
  setHashtags: (hashtags) => set({ hashtags }),
}));

