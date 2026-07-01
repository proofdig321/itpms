import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PlanningState {
  selectedProjectCode: string;
  setSelectedProjectCode: (code: string) => void;
}

export const usePlanningStore = create<PlanningState>()(
  persist(
    (set) => ({
      selectedProjectCode: "",
      setSelectedProjectCode: (code) => set({ selectedProjectCode: code }),
    }),
    { name: "planning-project" },
  ),
);
