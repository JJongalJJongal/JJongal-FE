import { API } from '../constants';

// 실제 서버 연동이 아니라면, 개발용 토큰을 바로 반환
export const fetchJwtToken = async () => {
  try {
    // nginx 프록시를 통해 접속 (포트 제거)
    const response = await fetch(`${API.BASE_URL}/api/v1/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) throw new Error('토큰 발급 실패');
    
    const data = await response.json();
    
    // 백엔드 응답 구조에 맞게 수정
    if (data.success && data.data && data.data.token) {
      return data.data.token;
    }
    
    throw new Error('토큰이 응답에 없습니다');
    
  } catch (e) {
    console.error('JWT 토큰 발급 에러:', e);
    // 실패 시 개발용 토큰 반환
    return "development_token";
  }
};
