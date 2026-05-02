import { create } from 'zustand';
import { JwtResponse, ClientProfileDTO } from '../../clients/fNAPlatformAPIClient/models';

interface AppState {
  isAuthenticated: boolean;
  user: JwtResponse | null;
  profile: ClientProfileDTO | null;
  login: (user: JwtResponse) => void;
  logout: () => void;
  setProfile: (profile: ClientProfileDTO) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  user: null,
  profile: null,
  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null, profile: null }),
  setProfile: (profile) => set({ profile }),
}));
