/**
 * JWT 토큰 관리 유틸리티
 */

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

export interface User {
  userId: string;
  roles: string[];
}

/**
 * 토큰을 localStorage에 저장
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * localStorage에서 토큰 조회
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 토큰 삭제 (로그아웃)
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * JWT 토큰에서 페이로드 추출
 */
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('토큰 디코딩 실패:', error);
    return null;
  }
};

/**
 * 토큰이 만료되었는지 확인
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * 현재 사용자가 인증되어 있는지 확인
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) {
    return false;
  }
  
  return !isTokenExpired(token);
};

/**
 * 토큰에서 사용자 정보 추출
 */
export const getUserFromToken = (token: string): User | null => {
  const decoded = decodeToken(token);
  if (!decoded) {
    return null;
  }
  
  return {
    userId: decoded.sub,
    roles: decoded.roles || [],
  };
};

/**
 * 현재 로그인된 사용자 정보 조회
 */
export const getCurrentUser = (): User | null => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    return null;
  }
  
  return getUserFromToken(token);
};
