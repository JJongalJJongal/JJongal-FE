// LoadingScreen.js (JS 부분만 교체)
// ⬇️ 기존 import 유지 + 추가 import 2개(API, fetchJwtToken)만 맞춰주세요.
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// ⚠️ 프로젝트 유틸/상수에 맞춰 경로 조정
import { API } from '../constants';             // 예: API.BASE_URL
import { fetchJwtToken } from '../utils/getJwtToken';

export default function LoadingScreen({ navigation, route }) {
  const navigationHook = useNavigation();

  // 로딩 이미지(기존과 동일)
  const loadingImages = [
    require('../assets/temp/loading1.jpg'),
    require('../assets/temp/loading2.jpg'),
    require('../assets/temp/loading3.jpg'),
    require('../assets/temp/loading4.jpg'),
  ];

  // 화면 상태
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // 전달받은 스토리 ID (이전 화면에서 story_id_assigned 이벤트 후 넘겨주세요)
  const storyId = route?.params?.storyId;

  // 타이머/플래그
  const imageTimerRef = useRef(null);
  const progressTimerRef = useRef(null);
  const pollTimerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const isUnmountedRef = useRef(false);

  // === 애니메이션: 이미지 순환(1초마다) ===
  useEffect(() => {
    imageTimerRef.current = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev >= loadingImages.length - 1 ? 0 : prev + 1
      );
    }, 1000);

    return () => {
      clearInterval(imageTimerRef.current);
    };
  }, []);

  // === 애니메이션: 진행바 무한 루프(시각적 용도) ===
  useEffect(() => {
    // 0→100 천천히 채우고 다시 0으로 (로딩 동안 반복)
    progressTimerRef.current = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 2)); // 0.1s마다 +2
    }, 100);

    return () => {
      clearInterval(progressTimerRef.current);
    };
  }, []);

  // === 폴링: 서버 상태 주기 조회 ===
  useEffect(() => {
    if (!storyId) {
      // storyId 없으면 바로 다음 화면으로 넘기거나 에러 처리
      // 필요 시 안내 후 홈 이동
      navigationHook.navigate('MakeStory6'); // 임시
      return;
    }

    const POLL_INTERVAL_MS = 2000;     // 2초마다 조회
    const FETCH_TIMEOUT_MS = 8000;      // 개별 요청 타임아웃 8초
    const MAX_WAIT_MS = 5 * 60 * 1000;  // 최대 5분 대기 후 탈출

    const pollOnce = async () => {
      try {
        const token = await fetchJwtToken();

        const controller = new AbortController();
        const to = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        const res = await fetch(
          `${API.BASE_URL}/api/v1/stories/${encodeURIComponent(storyId)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          },
        );
        clearTimeout(to);

        if (!res.ok) {
          // 404/401 등 → 잠시 후 재시도 (명세 공통 에러코드에 따라 처리 가능)
          // 필요 시 특정 코드 분기 가능
          return;
        }

        // 명세 상 응답은 Story Object 또는 { success, data: Story } 둘 다 가능성을 고려
        const body = await res.json().catch(() => ({}));
        const story = body?.object === 'story' ? body : body?.data ?? body;

        const status = story?.status; // pending | in_progress | completed | failed
        if (status === 'completed') {
          // 완료: 다음 화면으로 이동
          safeNavigateAfterLoading();
          return 'done';
        }
        if (status === 'failed') {
          // 실패 처리: 필요 시 실패 화면/알림
          safeNavigateAfterLoading({ failed: true });
          return 'done';
        }
        // 그 외: 계속 폴링
        return 'keep';
      } catch {
        // 네트워크/타임아웃 → 다음 턴에 재시도
        return 'keep';
      }
    };

    const loop = async () => {
      // 최대 대기 시간 체크
      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed > MAX_WAIT_MS) {
        // 타임아웃: 적절한 화면으로 이동
        safeNavigateAfterLoading({ timeout: true });
        return;
      }

      const r = await pollOnce();
      if (r === 'done' || isUnmountedRef.current) return;

      // 다음 턴 예약
      pollTimerRef.current = setTimeout(loop, POLL_INTERVAL_MS);
    };

    // 최초 1회 시작
    loop();

    return () => {
      isUnmountedRef.current = true;
      clearTimeout(pollTimerRef.current);
    };
  }, [storyId, navigationHook]);

  // === 안전 이동 헬퍼 ===
  const safeNavigateAfterLoading = (opts = {}) => {
    if (isUnmountedRef.current) return;
    // 필요 시 완성 화면에 storyId 전달
    if (opts.failed) {
      // 실패 화면이 따로 있다면 거기로 라우팅
      navigationHook.replace('MakeStory6', { storyId, status: 'failed' });
      return;
    }
    if (opts.timeout) {
      navigationHook.replace('MakeStory6', { storyId, status: 'timeout' });
      return;
    }
    navigationHook.replace('MakeStory6', { storyId, status: 'completed' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />

      {/* 상단 로딩바 */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* 메인 콘텐츠 영역 */}
      <View style={styles.mainContent}>
        {/* 로딩 이미지 순환 */}
        <Image
          source={loadingImages[currentImageIndex]}
          style={styles.loadingImage}
          resizeMode="contain"
        />

        {/* 로딩 점(기존 유지) */}
        <View style={styles.loadingDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* 메시지 */}
        <Text style={styles.loadingText}>쫑이가 그림을 그리는 중...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // 상단 로딩바 스타일
  progressBarContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: '#666',
    borderRadius: 4,
  },
  
  // 메인 콘텐츠 영역 스타일
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  
  // 로딩 이미지 스타일
  loadingImage: {
    width: width * 0.8,
    height: height * 0.5,
    marginBottom: 30,
  },
  
  // 로딩 점들 스타일
  loadingDots: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  
  // 로딩 메시지 스타일
  loadingText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // 하단 홈 인디케이터 스타일
  homeIndicator: {
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
    alignSelf: 'center',
    width: 40,
    marginBottom: 20,
  },
}); 