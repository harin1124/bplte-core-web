/**
 * JWT 토큰 관리 유틸리티 (HttpOnly 쿠키 기반)
 */

export interface LoginUserInfo {
  userId: string;
  userName: string;
}

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

/**
 * 토큰 삭제는 서버의 /auth/logout API를 호출해야 함
 */
export const removeToken = (): void => {
  // HttpOnly 쿠키는 JavaScript에서 삭제할 수 없음
  // 실제 로그아웃은 서버 API를 통해 처리됨
  console.warn('HttpOnly 쿠키는 서버 API(/auth/logout)를 통해 삭제해야 합니다.');
};

/**
 * 현재 사용자가 인증되어 있는지 확인
 * HttpOnly 쿠키 존재 여부로 판단 (사용자 정보는 authStore에서 관리)
 */
export const isAuthenticated = (): boolean => {
  return getCookie('accessToken') !== null;
};
