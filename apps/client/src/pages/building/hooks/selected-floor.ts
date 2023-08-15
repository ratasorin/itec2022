import { create } from 'zustand';

interface SelectedFloorStore {
  floor: number;
  changeSelectedFloor: (newSelectedFloor: number) => void;
}

export const useSelectedFloor = create<SelectedFloorStore>()((set) => ({
  floor: 1,
  changeSelectedFloor: (newSelectedFloor) => {
    set({ floor: newSelectedFloor });
  },
}));
