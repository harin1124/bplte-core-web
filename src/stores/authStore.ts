import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getToken, getCurrentUser, setToken, removeToken, isAuthenticated } from '@/lib/auth';
import type { User } from '@/lib/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (token: string) => void;
  logout: () => void;
  initialize: () => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // 상태
      user: null,
      isAuthenticated: false,
      isLoading: true,

      // 액션들
      login: (token: string) => {
        setToken(token);
        const currentUser = getCurrentUser();
        set({
          user: currentUser,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        removeToken();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      initialize: () => {
        set({ isLoading: true });
        
        const token = getToken();
        if (token && isAuthenticated()) {
          const currentUser = getCurrentUser();
          set({
            user: currentUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // 만료된 토큰 제거
          removeToken();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage', // localStorage 키
      partialize: (state) => ({
        // persist할 상태만 선택 (토큰은 auth.ts에서 별도 관리)
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// 앱 초기화 시 인증 상태 복원
export const initializeAuth = () => {
  const { initialize } = useAuthStore.getState();
  initialize();
};
