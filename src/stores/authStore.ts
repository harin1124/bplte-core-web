import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { removeToken } from '@/lib/auth';
import type { LoginUserInfo } from '@/lib/auth';

/**
 * 쿠키에서 특정 값 조회
 */
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

interface AuthState {
  user: LoginUserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (userInfo: LoginUserInfo) => void;
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
      login: (userInfo: LoginUserInfo) => {
        // Zustand persist가 자동으로 localStorage에 저장
        set({
          user: userInfo,
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

        // Zustand persist에서 복원된 상태 확인
        const state = useAuthStore.getState();
        
        // 쿠키 존재 여부와 저장된 사용자 정보로 인증 상태 확인
        const hasCookie = getCookie('accessToken') !== null;
        const hasUserInfo = state.user !== null;
        
        if (hasCookie && hasUserInfo) {
          set({
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // 인증 정보 제거
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
        // persist할 상태 선택 (사용자 정보도 함께 저장)
        isAuthenticated: state.isAuthenticated,
        user: state.user, // 사용자 정보도 auth-storage에 포함
      }),
    },
  ),
);

// 앱 초기화 시 인증 상태 복원
export const initializeAuth = () => {
  const { initialize } = useAuthStore.getState();
  initialize();
};
