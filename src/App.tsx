import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Join from './pages/Join.tsx';
import Login from '@/pages/Login.tsx';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { AlertProvider } from '@/contexts/AlertContext';
import { SidebarProvider } from '@/components/ui/sidebar.tsx';
import AppSidebar from '@/components/ui/app-sidebar.tsx';
import PostList from '@/pages/PostList.tsx';

function App() {
  return (
    <AlertProvider>
      <Routes>
        {/* 공개 라우트들 */}
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />

        {/* 보호된 라우트들 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SidebarProvider>
                <AppSidebar />
                <Home />
              </SidebarProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/postList"
          element={
            <ProtectedRoute>
              <SidebarProvider>
                <AppSidebar />
                <PostList />
              </SidebarProvider>
            </ProtectedRoute>
          }
        />

        {/* 404 처리 */}
        <Route path="*" element={<div>404 - 페이지를 찾을 수 없습니다</div>} />
      </Routes>
    </AlertProvider>
  );
}

export default App;
