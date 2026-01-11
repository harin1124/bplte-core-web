import axios from 'axios';
import { getToken, removeToken, isAuthenticated } from '@/lib/auth';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8080/bplte/core',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 모든 요청에 JWT 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    // 토큰이 있고 유효한 경우에만 헤더에 추가
    if (token && isAuthenticated()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 시 자동 로그아웃
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 Unauthorized 응답 시 토큰 제거 및 로그인 페이지로 리다이렉트
    if (error.response?.status === 401) {
      removeToken();
      // 현재 페이지가 로그인 페이지가 아닌 경우에만 리다이렉트
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
