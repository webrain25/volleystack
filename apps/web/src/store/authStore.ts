import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
  memberships: Array<{
    id: string;
    teamId: string;
    team: { id: string; name: string };
    roles: Array<{ role: string }>;
  }>;
}

interface AuthState {
  token: string | null;
  user: User | null;
  currentTeamId: string | null;
  setAuth: (token: string, user: User) => void;
  setCurrentTeam: (teamId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      currentTeamId: null,
      setAuth: (token, user) => set({ token, user }),
      setCurrentTeam: (currentTeamId) => set({ currentTeamId }),
      logout: () => set({ token: null, user: null, currentTeamId: null }),
    }),
    {
      name: 'volleystack-auth',
    }
  )
);
