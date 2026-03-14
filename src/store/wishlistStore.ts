import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WishlistState = {
  ids: Record<string, true>;
  toggle: (id: string) => void;
  isWishlisted: (id: string) => boolean;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: {},

      toggle: (id: string) =>
        set((state) => {
          const next = { ...state.ids };
          next[id] ? delete next[id] : (next[id] = true);
          return { ids: next };
        }),

      isWishlisted: (id: string) => !!get().ids[id],
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
