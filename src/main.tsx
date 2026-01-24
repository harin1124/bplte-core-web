import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeAuth } from '@/stores/authStore';

// 앱 시작 시 인증 상태 초기화
initializeAuth();

createRoot(document.getElementById('root')!).render(
  <App />,
)
