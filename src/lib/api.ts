import axios from 'axios';
import { removeToken } from '@/lib/auth';

// Axios 인스턴스 생성
const coreApi = axios.create({
  baseURL: 'http://localhost:8080/bplte/core',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 자동 포함
});

// 요청 인터셉터: 쿠키는 자동으로 포함되므로 토큰 헤더 추가 불필요
coreApi.interceptors.request.use(
  (config) => {
    // withCredentials: true로 설정했으므로 쿠키가 자동으로 포함됨
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
    // 401 Unauthorized 응답 시 토큰 제거
    if (error.response?.status === 401) {
      removeToken();
      // 로그인 페이지로 리다이렉트하지 않고 에러를 그대로 전달하여
      // 각 컴포넌트에서 Alert 등으로 처리할 수 있도록 함
    }

    return Promise.reject(error);
  },
);

export default coreApi;
