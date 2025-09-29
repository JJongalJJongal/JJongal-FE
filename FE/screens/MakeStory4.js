// AITalkScreen.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import RNFS from 'react-native-fs';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const { width, height } = Dimensions.get('window');

export default function AITalkScreen({ navigation, route }) {
  // ====== 상태 ======
  // 서버에서 받아온 메시지 목록 [{ text: string, audio?: { object:"file", url?:string, base64?:string, expiry_time?:string } }]
  const [aiMessages, setAiMessages] = useState([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [aiMessage, setAiMessage] = useState('');
  const [aiImage, setAiImage] = useState('library');
  const [aiName, setAiName] = useState('쫑이');
  const [isMessageComplete, setIsMessageComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // 재생기 & 임시 파일 경로
  const playerRef = useRef(new AudioRecorderPlayer());
  const tempPathRef = useRef(null);

  // 배경 이미지 (기존 유지)
  const backgroundImages = [
    require('../assets/temp/bg1.png'),
    require('../assets/temp/bg2.png'),
    require('../assets/temp/bg3.png'),
  ];
  const [currentBackground, setCurrentBackground] = useState(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    return randomIndex;
  });

  // ====== 오디오 재생/정지 ======
  const stopAudio = useCallback(async () => {
    try {
      await playerRef.current.stopPlayer();
      playerRef.current.removePlayBackListener();
    } catch {}
    setIsPlaying(false);
    // 임시 파일 삭제
    if (tempPathRef.current) {
      RNFS.unlink(tempPathRef.current).catch(() => {});
      tempPathRef.current = null;
    }
  }, []);

  const playAudioForCurrentMessage = useCallback(async () => {
    const msg = aiMessages[currentMessageIndex];
    if (!msg) return;

    // 오디오가 없으면 패스 (텍스트만)
    const audio = msg.audio;
    if (!audio) return;

    // 일단 기존 재생 중지
    await stopAudio();

    try {
      // 1) URL 우선 (서명 URL)
      if (audio.url && (audio.url.startsWith('http://') || audio.url.startsWith('https://'))) {
        const result = await playerRef.current.startPlayer(audio.url);
        setIsPlaying(true);
        playerRef.current.addPlayBackListener((e) => {
          if (e.currentPosition >= e.duration) {
            playerRef.current.removePlayBackListener();
            setIsPlaying(false);
          }
        });
        return result;
      }

      // 2) base64가 있는 경우 임시 파일로 저장 후 재생
      if (audio.base64) {
        const clean = audio.base64.replace(/^data:audio\/[^;]+;base64,/, '');
        const p = `${RNFS.DocumentDirectoryPath}/ai_talk_${Date.now()}.mp3`;
        await RNFS.writeFile(p, clean, 'base64');
        tempPathRef.current = p;

        const result = await playerRef.current.startPlayer(p);
        setIsPlaying(true);
        playerRef.current.addPlayBackListener((e) => {
          if (e.currentPosition >= e.duration) {
            playerRef.current.removePlayBackListener();
            setIsPlaying(false);
            if (tempPathRef.current) {
              RNFS.unlink(tempPathRef.current).catch(() => {});
              tempPathRef.current = null;
            }
          }
        });
        return result;
      }
    } catch (e) {
      // 재생 실패해도 텍스트는 표시됨
      // console.warn('Audio play failed', e);
      setIsPlaying(false);
    }
  }, [aiMessages, currentMessageIndex, stopAudio]);

  // ====== 서버 메시지 수신 반영 ======
  useEffect(() => {
    // MakeStory3(또는 이전 화면)에서 받아온 최신 서버 메시지들을 params로 전달했다고 가정
    // route.params.serverMessages 또는 route.params.aiEvents 형태를 지원
    const fromParams =
      route?.params?.serverMessages ||
      route?.params?.aiEvents ||
      []; // 없으면 빈 배열

    if (!Array.isArray(fromParams) || fromParams.length === 0) {
      // 아무것도 못 받았으면(개발/오프라인용) 안내
      setAiMessages([{ text: '서버 응답이 아직 없어요. 방금 한 대화가 끝나면 여기에 나타납니다.' }]);
      setCurrentMessageIndex(0);
      setAiMessage('서버 응답이 아직 없어요. 방금 한 대화가 끝나면 여기에 나타납니다.');
      setIsMessageComplete(true); // 다음 버튼 대신 대답/완성 버튼 노출
      return;
    }

    // 정상 수신: 목록 반영
    setAiMessages(fromParams);
    setCurrentMessageIndex(0);
    setAiMessage(fromParams[0]?.text || '');
    // 메시지가 1개뿐이면 즉시 완료 상태로 전환
    setIsMessageComplete(fromParams.length <= 1);
  }, [route?.params]);

  // 현재 인덱스가 바뀌면 텍스트 반영
  useEffect(() => {
    const msg = aiMessages[currentMessageIndex];
    setAiMessage(msg?.text || '');
    // 인덱스 바뀔 때 자동 재생(원하면 주석 해제)
    // playAudioForCurrentMessage();
  }, [currentMessageIndex, aiMessages /*, playAudioForCurrentMessage*/]);

  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  // ====== 버튼 핸들러 ======
  const togglePlayPause = async () => {
    // 재생 중이면 정지
    if (isPlaying) {
      await stopAudio();
      return;
    }
    // 재생 시작
    await playAudioForCurrentMessage();
  };

  const handleNext = async () => {
    // 다음 메시지로
    const next = currentMessageIndex + 1;
    if (next < aiMessages.length) {
      await stopAudio();
      setCurrentMessageIndex(next);
      // 남은 게 마지막이면 완료 상태 전환
      if (next === aiMessages.length - 1) {
        setIsMessageComplete(true);
      }
    } else {
      // 이미 마지막 → 완료 상태
      setIsMessageComplete(true);
    }
  };

  const handleAnswer = () => {
    navigation.navigate('MakeStory3', {
      aiName: aiName,
      aiImage: aiImage,
      background: currentBackground,
    });
  };

  const handleComplete = () => {
    navigation.navigate('MakeStory5', {
      aiName: aiName,
      aiImage: aiImage,
      background: currentBackground,
    });
  };

  const handleViewConversation = () => {
    console.log('대화 기록 보기');
  };

  // ====== 렌더 ======
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />

      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>동화책 만들기</Text>
        <TouchableOpacity style={styles.homeButton}>
          <Image
            source={require('../assets/temp/icon_home3.png')}
            style={styles.homeIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 메인 콘텐츠 영역 */}
      <View style={styles.mainContent}>
        <Image
          source={backgroundImages[currentBackground]}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        {/* 재생/정지 버튼들 */}
        <View style={styles.controlButtons}>
          <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
            <Image
              // isPlaying 상태에 따라 아이콘을 교체하려면 필요시 분기
              source={require('../assets/temp/icon_pause.jpg')}
              style={styles.playIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.stopButton} onPress={stopAudio}>
            <Image
              source={require('../assets/temp/icon_play.jpg')}
              style={styles.stopIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* 대화보기 버튼 */}
        <TouchableOpacity
          style={styles.conversationButton}
          onPress={handleViewConversation}
        >
          <Text style={styles.conversationText}>대화보기</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 대화 영역 */}
      <View style={styles.bottomSection}>
        {/* AI 이름 라벨 */}
        <View style={styles.nameLabel}>
          <Text style={styles.nameText}>{aiName}</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </View>

        {/* AI 메시지 */}
        <View style={styles.messageContainer}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.messageText}>{aiMessage}</Text>
          </ScrollView>
        </View>

        {/* 액션 버튼들 */}
        {!isMessageComplete ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>다음</Text>
          </TouchableOpacity>
        ) : (
          <View className="actionButtonsContainer" style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.answerButton} onPress={handleAnswer}>
              <Text style={styles.answerButtonText}>대답하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.completeButtonText}>완성하기</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },

  header: {
    backgroundColor: '#FFF1A1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 40, // UserTalkScreen과 동일
    paddingBottom: 20,
    zIndex: 2,
  },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  homeButton: { padding: 8 },
  homeIcon: { width: 36, height: 36 },

  mainContent: {
    flex: 1, // ✅ UserTalkScreen과 동일
    position: 'relative',
  },

  controlButtons: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  playButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playIcon: { width: 20, height: 20 },
  stopButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stopIcon: { width: 20, height: 20 },

  conversationButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conversationText: { fontSize: 14, color: '#000' },

  bottomSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 40,
    minHeight: height * 0.36,
  },
  nameLabel: {
    backgroundColor: '#FFF1A1',
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

  messageContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 25,
    minHeight: 150, // 높이 증가
    maxHeight: 180, // 최대 높이 증가
  },
  messageText: { fontSize: 16, color: '#000', lineHeight: 24, textAlign: 'center' },
  scrollContent: {
    flexGrow: 1, // ScrollView의 내용이 컨테이너를 채우도록 함
  },

  nextButton: {
    backgroundColor: '#FFF1A1',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000' },

  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  answerButton: {
    backgroundColor: '#FFF1A1',
    borderRadius: 10,
    paddingVertical: 15,
    flex: 0.48,
    alignItems: 'center',
  },
  answerButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  completeButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 15,
    flex: 0.48,
    alignItems: 'center',
  },
  completeButtonText: { fontSize: 18, fontWeight: 'bold', color: '#666' },
});
