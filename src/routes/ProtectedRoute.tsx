import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore.ts';
import { SidebarProvider } from '@/components/ui/sidebar.tsx';
import AppSidebar from '@/components/ui/app-sidebar.tsx';
import { Toaster } from 'sonner';

/**
 * 보호된 라우트 컴포넌트
 * 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 * 권한이 없는 사용자는 접근 거부
 */
export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const location = useLocation();

  // 인증 상태 로딩 중
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩중...</div>
      </div>
    );
  }

  // 인증되지 않은 사용자
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <Toaster style={{ textAlign: 'left' }} />
      <Outlet />
    </SidebarProvider>
  );
};
