import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

// Axios 인스턴스 생성
const coreApi = axios.create({
  baseURL: 'http://localhost:8081/bplte/core',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 자동 포함
});

// 요청 인터셉터: 쿠키 자동 포함 + FormData 시 boundary를 위해 JSON Content-Type 제거
coreApi.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData && config.headers) {
      if (typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type');
      } else {
        delete (config.headers as Record<string, unknown>)['Content-Type'];
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터: 401 에러 처리
coreApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 Unauthorized 응답 시 인증 제거
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  },
);

export default coreApi;
