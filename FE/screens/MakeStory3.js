// UserTalkScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import { Buffer } from 'buffer';

const { width, height } = Dimensions.get('window');

// 오디오 관련 상수
const SAMPLE_RATE = 16000;
const ENCODING = 'pcm_s16le';

export default function UserTalkScreen({ navigation, route }) {
  const [userName, setUserName] = useState('정우');
  const [isListening, setIsListening] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  // 오디오 관련 refs
  const wsRef = useRef(null);               // WebSocket
  const chunksRef = useRef([]);             // 녹음된 PCM 청크 모음
  const jwtRef = useRef(null);              // JWT 캐시
  const [wsReady, setWsReady] = useState(false);

  const backgroundImages = [
    require('../assets/temp/bg1.png'),
    require('../assets/temp/bg2.png'),
    require('../assets/temp/bg3.png'),
  ];

  const [currentBackground, setCurrentBackground] = useState(() => {
    if (route?.params?.background !== undefined) {
      return route.params.background;
    }
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    return randomIndex;
  });

  // AudioRecord 초기화 useEffect
  useEffect(() => {
    (async () => {
      // JWT 준비 (임시로 null 설정, 실제 구현 시 토큰 가져오기)
      try {
        // const tok = await fetchJwtToken();
        jwtRef.current = 'temp-jwt-token'; // 임시 토큰
      } catch (e) { 
        console.log('JWT 토큰 가져오기 실패:', e);
      }

      // AudioRecord 설정 (안드로이드 전용)
      try {
        await AudioRecord.init({
          sampleRate: SAMPLE_RATE,
          channels: 1,
          bitsPerSample: 16,
          audioSource: 6, // VOICE_RECOGNITION
          wavFile: 'ignore.wav', // 파일 저장 안씀(스트리밍/버퍼용)
        });

        // data 콜백: base64 → Buffer 로 변환해서 메모리에 쌓기(녹음 중에만 호출됨)
        AudioRecord.on('data', (base64Chunk) => {
          if (!isListening) return; // 사용자 상태와 연동
          const bytes = Buffer.from(base64Chunk, 'base64'); // PCM 16LE
          chunksRef.current.push(bytes);
        });
      } catch (e) {
        console.log('AudioRecord 초기화 실패:', e);
      }
    })();

    return () => {
      try { 
        AudioRecord.stop(); 
      } catch (e) {
        console.log('AudioRecord 정리 중 에러:', e);
      }
      if (wsRef.current && wsRef.current.readyState <= 1) {
        wsRef.current.close(1000, 'unmount');
      }
    };
  }, []);

  const handleMicrophonePress = async () => {
    if (isListening) {
      // 이미 듣는 중 → 녹음 중지 + 상태 끔
      try { 
        await AudioRecord.stop(); 
      } catch (e) {
        console.log('녹음 중지 실패:', e);
      }
      setIsListening(false);
    } else {
      // 듣기 시작 → 청크 초기화 후 녹음 시작
      chunksRef.current = [];
      setIsWaiting(false);
      setIsListening(true);
      try {
        await AudioRecord.start();
      } catch (e) {
        console.log('녹음 시작 실패:', e);
        setIsListening(false);
      }
    }
  };

  const handleCompleteAnswer = async () => {
    // 중복 클릭 방지
    if (isWaiting) return;

    // 녹음 중이면 종료
    if (isListening) {
      try { 
        await AudioRecord.stop(); 
      } catch (e) {
        console.log('녹음 중지 실패:', e);
      }
      setIsListening(false);
    }

    // 적재된 PCM 없으면 무시
    const frames = chunksRef.current;
    if (!frames || frames.length === 0) {
      console.log('녹음된 데이터가 없습니다.');
      return;
    }

    setIsWaiting(true);

    try {
      // 1) WebSocket 오픈 (없으면 생성)
      if (!wsRef.current || wsRef.current.readyState > 1) {
        // 임시 WebSocket URL (실제 구현 시 환경변수에서 가져오기)
        const base = 'wss://your-api-server.com'; // 실제 서버 URL로 변경 필요
        const url = `${base}/wss/v1/audio?token=${encodeURIComponent(jwtRef.current)}`;
        wsRef.current = new WebSocket(url);

        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('WS timeout')), 12000);
          wsRef.current.onopen = () => { 
            clearTimeout(timer); 
            resolve(); 
          };
          wsRef.current.onerror = (e) => { 
            clearTimeout(timer); 
            reject(e); 
          };
        });
        setWsReady(true);
      }

      // 2) start_conversation
      wsRef.current.send(JSON.stringify({
        event: 'start_conversation',
        payload: { audio_config: { sample_rate: SAMPLE_RATE, encoding: ENCODING } },
      }));

      // 3) 녹음된 PCM을 덩어리로 전송 (너무 큰 버퍼는 분할)
      //    16KB 단위로 분할 전송 (네트워크 안정성)
      const big = Buffer.concat(frames);
      const CHUNK = 16 * 1024;
      for (let o = 0; o < big.length; o += CHUNK) {
        const piece = big.subarray(o, Math.min(o + CHUNK, big.length));
        wsRef.current.send(piece); // 바이너리 프레임
      }

      // 4) end_conversation
      wsRef.current.send(JSON.stringify({ event: 'end_conversation', payload: {} }));

      // (선택) 서버 응답 수신 대기 → "생각중" 문구 표시 유지
      // wsRef.current.onmessage = (evt) => { ... AI 응답 표시/오디오 재생 ... };

      // 2초 대기 후 다음 화면으로 이동
      setTimeout(() => {
        navigation.navigate('MakeStory4', { background: currentBackground });
      }, 2000);

    } catch (e) {
      console.log('WebSocket 전송 실패:', e);
      // 실패 시 UI 원복
      setIsWaiting(false);
    } finally {
      // 한 번 전송 끝 → 버퍼 비우기
      chunksRef.current = [];
    }
  };

  const handleGoHome = () => navigation.navigate('Main');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />

      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>동화책 만들기</Text>
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Image
            source={require('../assets/temp/icon_home3.png')}
            style={styles.homeIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 메인 콘텐츠 (이미지 영역) */}
      <View style={styles.mainContent}>
        <Image
          source={backgroundImages[currentBackground]}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </View>

      {/* 하단 대화 영역 */}
      <View style={styles.bottomSection}>
        {/* 사용자 이름 라벨 */}
        <View style={styles.nameLabel}>
          <Text style={styles.nameText}>{userName}</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </View>

        {/* 프롬프트 텍스트 */}
        <Text style={styles.promptText}>
          {isListening ? '... 쫑이가 이야기를 듣는중 ...' : '버튼을 눌러 이야기 해주세요!'}
        </Text>

        {/* 마이크 버튼 */}
        <TouchableOpacity
          style={[styles.microphoneButton, isListening && styles.microphoneButtonListening]}
          onPress={handleMicrophonePress}
        >
          <Image
            source={
              isListening
                ? require('../assets/temp/icon_mike2.png')
                : require('../assets/temp/icon_mike1.png')
            }
            style={styles.microphoneIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* 대답완료 버튼 */}
        <TouchableOpacity 
          style={[styles.completeButton, isWaiting && styles.completeButtonWaiting]} 
          onPress={handleCompleteAnswer}
          disabled={isWaiting}
        >
          <Text style={[styles.completeButtonText, isWaiting && styles.completeButtonTextWaiting]}>
            {isWaiting ? '쫑이가 생각하고 있어요' : '대답완료'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    backgroundColor: '#FFF1A1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 40, // AITalkScreen과 동일
    paddingBottom: 20,
    zIndex: 2,
  },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  homeButton: { padding: 8 },
  homeIcon: { width: 36, height: 36 },

  mainContent: {
    flex: 1, // 🔥 세로 비율 동일하게 맞춤
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },

  bottomSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  nameLabel: {
    backgroundColor: '#FFF1A1', // AITalkScreen과 동일
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: { fontSize: 14, fontWeight: '600', color: '#000', marginRight: 8 },
  dropdownIcon: { fontSize: 12, color: '#000' },

  promptText: { fontSize: 16, color: '#000', textAlign: 'center', marginBottom: 25, lineHeight: 24 },

  microphoneButton: {
    width: 80,
    height: 80,
    backgroundColor: 'transparent',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 25,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  microphoneButtonListening: { backgroundColor: '#FFFBE5', borderColor: '#FFA500' },
  microphoneIcon: { width: 48, height: 48 },

  completeButton: {
    backgroundColor: '#FFF1A1',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  completeButtonWaiting: {
    backgroundColor: '#FFE0B2', // 대기 상태 배경색
    borderColor: '#FFCC80', // 대기 상태 테두리 색
  },
  completeButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  completeButtonTextWaiting: {
    color: '#FF9800', // 대기 상태 텍스트 색
  },
});