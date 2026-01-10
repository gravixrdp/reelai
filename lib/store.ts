import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  setUser: (user) => {
    set({ user });
    if (user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(user));
      }
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("user");
      }
    }
  },
  setToken: (token) => {
    set({ token });
    if (token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem("authToken", token);
      }
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("authToken");
      }
    }
  },
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    }
  },
  initialize: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");
      if (userStr && token) {
        const user = JSON.parse(userStr);
        set({ user, token });
      }
    }
  },
}));

interface ReelsStore {
  reels: any[];
  selectedReel: any | null;
  isProcessing: boolean;
  setReels: (reels: any[]) => void;
  addReel: (reel: any) => void;
  selectReel: (reel: any | null) => void;
  setProcessing: (processing: boolean) => void;
}

export const useReelsStore = create<ReelsStore>((set) => ({
  reels: [],
  selectedReel: null,
  isProcessing: false,
  setReels: (reels) => set({ reels }),
  addReel: (reel) => set((state) => ({ reels: [...state.reels, reel] })),
  selectReel: (reel) => set({ selectedReel: reel }),
  setProcessing: (processing) => set({ isProcessing: processing }),
}));

interface UIStore {
  sidebarOpen: boolean;
  theme: "light" | "dark" | "system";
  toggleSidebar: () => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  theme: "system",
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", theme);
    }
  },
}));
