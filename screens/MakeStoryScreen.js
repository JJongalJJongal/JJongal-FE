// screens/MakeStoryScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import { fetchJwtToken } from '../utils/getJwtToken';
import { WS, API } from '../constants';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';



const MakeStoryScreen = ({ navigation }) => {
  const ws = useRef(null);
  const [aiText, setAiText] = useState('서버 연결 중...');
  const [jwtToken, setJwtToken] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const audioRecorderPlayerRef = useRef(new AudioRecorderPlayer());
  const timeoutRef = useRef(null);

  // TTS 오디오 재생 함수
  const playTTSAudio = async (text) => {
    try {
      // 이전 오디오 정지
      await stopAudio();
      
      console.log('🎵 TTS 오디오 생성 및 재생:', text);
      
      // JWT 토큰이 없거나 development_token이면 TTS 스킵
      if (!jwtToken || jwtToken === 'development_token') {
        console.log('⚠️ JWT 토큰이 없거나 개발 모드 - TTS 스킵');
        return;
      }
      
      // ❌ /api/v1/tts 엔드포인트는 존재하지 않음 - TTS API 호출 스킵
      console.log('⚠️ TTS API 엔드포인트 없음 - 텍스트만 표시');
      // TTS 오디오가 없어도 텍스트는 정상적으로 표시됨
      
    } catch (error) {
      console.warn('⚠️ TTS 오디오 재생 실패:', error);
    }
  };

  // 서버에서 받은 오디오 재생 함수
  const playServerAudio = async (base64Audio) => {
    try {
      // 이전 오디오 정지
      await stopAudio();
      
      console.log('🎵 서버 오디오 재생:', base64Audio.substring(0, 100) + '...');
      
      // base64 데이터 정리 (헤더 제거)
      const cleanBase64 = base64Audio.replace(/^data:audio\/[^;]+;base64,/, '');
      
      // 임시 파일로 저장
      const tempFilePath = `${RNFS.DocumentDirectoryPath}/server_audio_makestory.mp3`;
      await RNFS.writeFile(tempFilePath, cleanBase64, 'base64');

      const result = await audioRecorderPlayerRef.current.startPlayer(tempFilePath);
      console.log('✅ 서버 오디오 재생 시작됨:', result);

      audioRecorderPlayerRef.current.addPlayBackListener((e) => {
        if (e.currentPosition === e.duration) {
          // 재생 완료 후 파일 삭제
          RNFS.unlink(tempFilePath).catch(console.warn);
        }
      });

    } catch (error) {
      console.error('❌ 서버 오디오 재생 실패:', error);
      // 오디오 재생 실패해도 텍스트는 표시되도록 함
    }
  };

  // 오디오 정지 함수
  const stopAudio = async () => {
    try {
      await audioRecorderPlayerRef.current.stopPlayer();
      audioRecorderPlayerRef.current.removePlayBackListener();
    } catch (error) {
      console.warn('⚠️ 오디오 정지 중 오류:', error);
    }
  };



  useEffect(() => {
    // ✅ WebSocket 연결만으로 초기 인사 받기 (이미 구현되어 있음)
    return () => {
      stopAudio();
      // 임시 파일들 정리
      RNFS.unlink(`${RNFS.DocumentDirectoryPath}/server_audio_makestory.mp3`).catch(() => {});
    };
  }, []);

  useEffect(() => {
    // JWT 토큰 발급
    const getToken = async () => {
      const token = await fetchJwtToken();
      console.log('🔍 MakeStoryScreen 토큰 확인:', token);
      setJwtToken(token);
    };
    getToken();
  }, []);

  useEffect(() => {
    if (!jwtToken) return;
    
    // development_token일 때는 WebSocket 연결 스킵 (서버에서 검증 실패할 수 있음)
    if (jwtToken === 'development_token') {
      console.log('⚠️ development_token 사용 - WebSocket 연결 스킵');
      setAiText('안녕! 나는 부기야. 오늘은 어떤 이야기를 만들어볼까? (오프라인 모드)');
      setWsConnected(true);
      return;
    }
    
    // WebSocket 연결해서 초기 인사 받기
    const wsUrl = `${WS.BASE_URL}?child_name=${encodeURIComponent('상아')}&age=7&interests=${encodeURIComponent('공룡,로봇')}&token=${jwtToken}`;
    console.log('🔗 MakeStoryScreen WebSocket 연결 시도:', wsUrl);
    console.log('🔑 사용 토큰:', jwtToken?.substring(0, 20) + '...');
    
    let connectionTimeout = null;
    let greetingReceived = false;
    
    ws.current = new WebSocket(wsUrl);

    // 연결 타임아웃 설정 (30초) - 서버 초기화 시간 고려
    connectionTimeout = setTimeout(() => {
      if (!greetingReceived && ws.current) {
        console.log('⏰ 연결 타임아웃 - 30초 내 인사 메시지 없음');
        setAiText('서버 응답이 없습니다. 오프라인 모드로 진행합니다.');
        setWsConnected(true); // UI 진행을 위해 연결된 것으로 처리
        if (ws.current.readyState <= 1) {
          ws.current.close(1000, 'Connection timeout');
        }
      }
    }, 30000);

    ws.current.onopen = () => {
      console.log('✅ MakeStoryScreen WebSocket 연결됨');
      setAiText('서버에 연결되었습니다. 초기 메시지를 기다리는 중...');
    };
    
    ws.current.onerror = (error) => {
      console.error('🚨 WebSocket 에러 발생:', error);
      console.log('🔍 에러 시점 readyState:', ws.current?.readyState);
      
      // 연결 시도 중에만 에러로 처리
      if (ws.current?.readyState === WebSocket.CONNECTING) {
        console.log('🔴 연결 시도 중 에러 발생');
        setWsConnected(false);
        setAiText('서버 연결에 실패했습니다. 오프라인 모드로 진행합니다.');
        // 타임아웃 정리
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }
        // 오프라인 모드로 전환
        setTimeout(() => {
          setWsConnected(true);
          setAiText('안녕! 나는 부기야. 오늘은 어떤 이야기를 만들어볼까? (오프라인 모드)');
        }, 2000);
      }
    };

    ws.current.onclose = (event) => {
      console.log(`WebSocket 연결 종료: code=${event.code}, reason=${event.reason}`);
      console.log('🔍 종료 시점 greetingReceived:', greetingReceived);
      
      // 타임아웃 정리
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        connectionTimeout = null;
      }
      
      // 정상 종료 코드인지 확인
      if (event.code === 1000) {
        console.log('서버에서 정상 종료됨');
        if (!greetingReceived) {
          // 인사 메시지 없이 종료된 경우 오프라인 모드
          setAiText('안녕! 나는 부기야. 오늘은 어떤 이야기를 만들어볼까? (오프라인 모드)');
          setWsConnected(true);
        }
      } else if (event.code === 1001) {
        console.log('클라이언트 페이지 이동으로 종료됨'); 
      } else {
        console.warn('비정상 연결 종료:', event.code, event.reason);
        if (!greetingReceived) {
          setWsConnected(false);
          if (event.code === 1006) {
            setAiText('서버 연결이 끊어졌습니다. 오프라인 모드로 진행합니다.');
            // 오프라인 모드로 전환
            setTimeout(() => {
      setWsConnected(true);
              setAiText('안녕! 나는 부기야. 오늘은 어떤 이야기를 만들어볼까? (오프라인 모드)');
            }, 2000);
          }
        }
      }
      
      // 조금 늦게 ws.current를 null로 설정
      setTimeout(() => {
        ws.current = null;
      }, 1000);
    };
    
    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('📨 메시지 수신:', message);
        
        if (message.type === 'status') {
          if (message.status === 'partial') {
            setAiText(message.message);
            
            // 🎵 오디오 처리
            setTimeout(() => {
              if (message.audio) {
                console.log('🎵 서버 제공 오디오 재생');
                playServerAudio(message.audio);
              } else {
                playTTSAudio(message.message);
              }
            }, 500);
          } else if (message.status === 'connected') {
            setAiText(message.message);
            greetingReceived = true;
            setWsConnected(true);
            
            if (connectionTimeout) {
              clearTimeout(connectionTimeout);
              connectionTimeout = null;
            }
            
            // 🎵 연결 완료 메시지 오디오 처리
            setTimeout(() => {
              if (message.audio) {
                console.log('🎵 서버 제공 오디오 재생');
                playServerAudio(message.audio);
              } else {
                playTTSAudio(message.message);
              }
            }, 500);
            
            console.log('🎉 초기 인사 완료 - 연결 유지');
          }
        } else if (message.type === 'conversation_end') {
          console.log('📍 대화 종료:', message.message);
          if (message.message) {
            setAiText(message.message);
            
            setTimeout(() => {
              if (message.audio) {
                console.log('🎵 서버 제공 오디오 재생');
                playServerAudio(message.audio);
              } else {
                playTTSAudio(message.message);
              }
            }, 500);
          }
        } else if (message.type === 'story_id_assigned') {
          const storyId = message.story_id;
          console.log('📚 동화 생성 시작:', storyId);
          setAiText('동화를 만들고 있어요! 잠시만 기다려주세요...');
          
          setTimeout(() => {
            if (message.audio) {
              console.log('🎵 서버 제공 오디오 재생');
              playServerAudio(message.audio);
            } else {
              playTTSAudio('동화를 만들고 있어요! 잠시만 기다려주세요...');
            }
          }, 500);
        } else if (message.type === 'orchestrator_story_completed') {
          console.log('🎉 동화 완성!');
          setAiText('동화가 완성되었어요! 함께 읽어볼까요?');
          
          setTimeout(() => {
            if (message.audio) {
              console.log('🎵 서버 제공 오디오 재생');
              playServerAudio(message.audio);
            } else {
              playTTSAudio('동화가 완성되었어요! 함께 읽어볼까요?');
            }
          }, 500);
          
          if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.close(1000, 'Story generation completed');
          }
        } else if (message.type === 'ai_response' && !message.user_text) {
          greetingReceived = true;
          setWsConnected(true);
          setAiText(message.text);
          
          if (connectionTimeout) {
            clearTimeout(connectionTimeout);
            connectionTimeout = null;
          }
          
          setTimeout(() => {
            if (message.audio) {
              console.log('🎵 서버 제공 오디오 재생');
              playServerAudio(message.audio);
            } else {
              playTTSAudio(message.text);
            }
          }, 500);
          
          console.log('🎉 초기 인사 완료 (ai_response) - 연결 유지');
        } else if (message.type === 'ping') {
          console.log('🏓 ping 메시지 수신');
        } else {
          console.log('📄 기타 메시지:', message.type, message);
        }
      } catch (error) {
        console.error('❌ 메시지 파싱 실패:', error);
      }
    };
    
    return () => {
      console.log('🧹 MakeStoryScreen 컴포넌트 정리 시작');
      
      // 타임아웃 정리
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        connectionTimeout = null;
      }
      
      // WebSocket 정리
      if (ws.current && ws.current.readyState <= 1) {
        console.log('🧹 MakeStoryScreen WebSocket 정리');
        ws.current.close(1000, 'Component unmounting');
      }
      
      // 약간의 지연 후 참조 제거
      setTimeout(() => {
        ws.current = null;
      }, 500);
    };
  }, [jwtToken]);

  const handleAnswer = () => {
    if (!wsConnected) {
      Alert.alert('실패', '서버 연결이 아직 완료되지 않았습니다.');
      return;
    }
    navigation.navigate('Answer', {
      childName: '상아',
      age: 7,
      interests: ['공룡', '로봇'],
      jwtToken, // AnswerScreen에 토큰 전달
    });
  };

  return (
    <View style={styles.bg}>
      {/* 상단 흰색 영역 + 말풍선 */}
      <View style={styles.topWhite}>
        <View style={styles.bubbleWrap}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{aiText}</Text>
          </View>
        </View>
      </View>
      {/* 가운데 영역 */}
      <View style={styles.centerBg}>
        <View style={styles.container}>
          <Image source={require('../assets/num3.png')} style={styles.smallImage} />
        </View>
      </View>
      {/* 하단 흰색 영역 + 버튼 */}
      <View style={styles.bottomWhite}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('MakeStory2', { jwtToken })}
        >
          <Text style={styles.buttonText}>다음으로</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MakeStoryScreen;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topWhite: {
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 20, // 위아래 여백
    paddingBottom: 5, // 이미지와 거리
    minHeight: 80, // 최소 높이
    maxHeight: 200, // 최대 높이 (너무 길어지는 것 방지)
  },
  centerBg: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff  ', // 배경색 추가
    height: 100,
  },
  smallImage: {
    width: 300,
    height: 300,
    resizeMode: 'cover', // 이미지를 잘라서 정사각형에 맞춤
    borderRadius: 20, // 모서리 둥글게
    marginVertical: 0, // 위아래 여백 완전 제거
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1, // 이미지 위에 표시
    height: 100, 
  }, 
  bubbleWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
    marginLeft: 0,
    marginBottom: 0,
  },
  bubble: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#4B662B',
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: 50, // 최소 높이
  },
  bubbleText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    textAlign: 'left',
    lineHeight: 22, // 줄 간격
    flexWrap: 'wrap', // 텍스트 줄바꿈
  },
  bubbleArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#4B662B',
    alignSelf: 'flex-start',
    marginLeft: 34,
    marginBottom: -2,
  },
  bookImage: {
    width: 160,
    height: 120,
    resizeMode: 'contain',
    marginTop: 12,
    marginBottom: 0,
  },
  boogiImage: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
    marginTop: -16,
    marginBottom: 0,
  },
  bottomWhite: {
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 5, // 이미지와 버튼 거리 더 줄이기
    paddingBottom: 0,
    height: 100,
  },
  button: {
    backgroundColor: '#9ACA70',
    borderRadius: 14,
    paddingHorizontal: 44,
    paddingVertical: 10,
    minWidth: 180,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 2,
    textAlign: 'center',
    includeFontPadding: false,
    paddingVertical: 0,
  },
});