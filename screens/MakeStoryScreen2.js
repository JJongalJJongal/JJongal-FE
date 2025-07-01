// screens/MakeStoryScreen2.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ImageBackground, ScrollView } from 'react-native';
import { startRecording } from '../hooks/useRecorder';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { API } from '../constants';



const MakeStoryScreen2 = ({ navigation, route }) => {
  const aiResult = route.params?.aiResult;
  const serverResponse = route.params?.serverResponse; // 서버 응답 전체 데이터
  const storyCompleted = route.params?.storyCompleted;
  const storyId = route.params?.storyId;
  const jwtToken = route.params?.jwtToken;
  const [aiText, setAiText] = useState('부기가 답변을 준비 중이에요...');
  const audioRecorderPlayerRef = useRef(new AudioRecorderPlayer());
  const timeoutRef = useRef(null);
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  // WebSocket 연결 및 오디오 수신 (중복 방지)
  const connectWebSocket = async () => {
    try {
      console.log('🔑 JWT 토큰 상태:', jwtToken ? `토큰 있음 (${jwtToken.substring(0, 20)}...)` : '토큰 없음');
      
      if (!jwtToken || jwtToken === 'development_token') {
        console.log('⚠️ JWT 토큰이 없거나 개발 모드 - WebSocket 연결 스킵');
        return;
      }

      // 기존 연결이 열려있으면 연결하지 않음
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log('🔗 WebSocket 이미 연결됨 - 새 연결 스킵');
        return;
      }

      const { WS } = require('../constants');
      const wsUrl = `${WS.BASE_URL}?child_name=${encodeURIComponent('상아')}&age=7&interests=${encodeURIComponent('공룡,로봇')}&token=${jwtToken}`;
      
      console.log('🔌 WebSocket 연결 시도:', wsUrl);
      
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('✅ WebSocket 연결됨 (readyState:', wsRef.current.readyState, ')');
        setIsConnected(true);
      };
      
      wsRef.current.onmessage = (event) => {
        handleWebSocketMessage(event);
      };
      
      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket 에러:', error);
        setIsConnected(false);
      };
      
      wsRef.current.onclose = (event) => {
        console.log('🔌 WebSocket 연결 종료됨 (code:', event.code, ', reason:', event.reason, ')');
        setIsConnected(false);
        wsRef.current = null;
      };
      
    } catch (error) {
      console.error('❌ WebSocket 연결 실패:', error);
      setIsConnected(false);
    }
  };

  // WebSocket 메시지 처리 (바이너리 파싱 오류 수정)
  const handleWebSocketMessage = async (event) => {
    try {
      // JSON 메시지 처리
      if (typeof event.data === 'string') {
        let message;
        try {
          message = JSON.parse(event.data);
          console.log('📥 WebSocket JSON 메시지 수신:', message);
        } catch (parseError) {
          console.error('❌ JSON 파싱 실패:', parseError.message);
          console.log('⚠️ 원본 데이터:', event.data.substring(0, 100), '...');
          return;
        }
        
        switch (message.type) {
          case 'ai_response':
            console.log('🤖 AI 응답:', message.text);
            setAiText(message.text);
            
            if (message.audio) {
              console.log('🎵 base64 오디오 재생');
              await playBase64Audio(message.audio);
            }
            break;
            
          case 'conversation_response':
            console.log('💬 대화 응답:', message.text);
            setAiText(message.text);
            
            if (message.audio_method === 'websocket_binary') {
              console.log('🎵 바이너리 오디오가 곧 도착합니다');
              // 바이너리 오디오는 별도 메시지로 올 예정
            } else if (message.audio) {
              console.log('🎵 base64 오디오 재생');
              await playBase64Audio(message.audio);
            }
            break;
            
          case 'retry_request':
            console.log('🔄 재시도 요청:', message.text);
            setAiText(message.text);
            
            if (message.audio) {
              await playBase64Audio(message.audio);
            }
            break;
            
          case 'ready_for_story_generation':
            console.log('📚 스토리 생성 준비됨!');
            setAiText('충분한 정보를 수집했어요! 이제 동화를 만들어볼까요?');
            break;
            
          case 'audio_metadata':
            console.log('🎵 오디오 메타데이터 수신:', message);
            // 바이너리 오디오 파일 정보 - 다음에 올 바이너리 데이터 준비
            break;
            
          case 'status':
            console.log('📊 상태:', message.status, message.message);
            // AI 텍스트는 업데이트하지 않음 - 기존 대화 내용 유지
            break;
            
          case 'error':
            console.error('❌ 에러:', message.error_message);
            setAiText(`에러: ${message.error_message}`);
            break;
            
          default:
            console.log('🤔 알 수 없는 메시지:', message);
        }
      } else if (event.data instanceof Blob) {
        console.log('🎵 Blob 오디오 수신:', {
          size: event.data.size,
          type: event.data.type
        });
        await playBinaryAudio(event.data);
      } else if (event.data instanceof ArrayBuffer) {
        console.log('🎵 ArrayBuffer 오디오 수신:', {
          byteLength: event.data.byteLength
        });
        const blob = new Blob([event.data], { type: 'audio/wav' });
        await playBinaryAudio(blob);
      } else {
        console.log('⚠️ 처리되지 않은 데이터 타입:', {
          type: typeof event.data,
          constructor: event.data?.constructor?.name,
          length: event.data?.length,
          preview: event.data?.toString?.()?.substring(0, 50)
        });
      }
    } catch (error) {
      console.error('❌ WebSocket 메시지 처리 실패:', error);
    }
  };

  // 🎵 Base64 오디오 재생 (플랫폼별 최적화)
  const playBase64Audio = async (base64Audio) => {
    try {
      await stopAudio();
      
      const Platform = require('react-native').Platform;
      console.log('🎵 base64 오디오 재생 시작:', {
        platform: Platform.OS,
        base64Length: base64Audio.length,
        preview: base64Audio.substring(0, 100) + '...'
      });
      
      // base64 데이터 정리 (헤더 제거)
      const cleanBase64 = base64Audio.replace(/^data:audio\/[^;]+;base64,/, '');
      
      // 🔧 플랫폼별 확장자 결정
      const audioExtension = Platform.OS === 'android' ? 'mp3' : 'wav';
      
      // 🎯 다중 시도를 위한 파일 경로들
      const attempts = [
        { path: `${RNFS.DocumentDirectoryPath}/ws_audio_makestory2.${audioExtension}`, ext: audioExtension },
        { path: `${RNFS.DocumentDirectoryPath}/ws_audio_makestory2.mp3`, ext: 'mp3' },
        { path: `${RNFS.DocumentDirectoryPath}/ws_audio_makestory2.wav`, ext: 'wav' }
      ];
      
      let playSuccess = false;
      let lastError = null;
      
      for (const attempt of attempts) {
        try {
          console.log(`🎯 base64 오디오 시도 ${attempts.indexOf(attempt) + 1}: .${attempt.ext} 파일로 재생`);
          
          // 임시 파일로 저장
          await RNFS.writeFile(attempt.path, cleanBase64, 'base64');
          
          // 파일 검증
          const fileExists = await RNFS.exists(attempt.path);
          const fileStats = await RNFS.stat(attempt.path);
          
          console.log('🔍 base64 오디오 파일 검증:', {
            존재: fileExists,
            크기: fileStats.size + ' bytes',
            경로: attempt.path
          });
          
          if (!fileExists || fileStats.size === 0) {
            throw new Error('base64 오디오 파일 저장 실패');
          }
          
          // 재생 시도
          const result = await audioRecorderPlayerRef.current.startPlayer(attempt.path);
          console.log(`✅ base64 .${attempt.ext} 파일 재생 성공:`, result);
          
          // 재생 완료 리스너 등록
          audioRecorderPlayerRef.current.addPlayBackListener((e) => {
            if (e.currentPosition === e.duration && e.duration > 0) {
              console.log(`✅ base64 .${attempt.ext} 파일 재생 완료`);
              // 재생 완료 후 파일 삭제
              RNFS.unlink(attempt.path).catch(console.warn);
            }
          });
          
          playSuccess = true;
          break; // 성공하면 루프 종료
          
        } catch (attemptError) {
          console.warn(`⚠️ base64 .${attempt.ext} 재생 실패:`, attemptError.message);
          lastError = attemptError;
          
          // 실패한 파일 정리
          RNFS.unlink(attempt.path).catch(() => {});
          
          // 다음 시도를 위해 계속
          continue;
        }
      }
      
      if (!playSuccess) {
        console.error(`❌ base64 오디오 모든 형식 재생 실패. 마지막 오류: ${lastError?.message}`);
      }

    } catch (error) {
      console.error('❌ base64 오디오 재생 완전 실패:', error);
    }
  };

  // 🎵 바이너리 오디오 재생 (플랫폼별 최적화 + 대안 재생)
  const playBinaryAudio = async (audioBlob) => {
    try {
      await stopAudio();
      
      const Platform = require('react-native').Platform;
      console.log('🎵 바이너리 오디오 재생 시작:', {
        platform: Platform.OS,
        size: audioBlob.size,
        type: audioBlob.type,
        constructor: audioBlob.constructor.name
      });
      
      // AudioRecorderPlayer 인스턴스 새로 생성
      audioRecorderPlayerRef.current = new AudioRecorderPlayer();
      
      // ArrayBuffer로 변환
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      console.log('🔄 ArrayBuffer 크기:', arrayBuffer.byteLength, 'bytes');
      
      // 🔍 오디오 파일 형식 감지
      const isWavFile = uint8Array[0] === 0x52 && uint8Array[1] === 0x49 && uint8Array[2] === 0x46 && uint8Array[3] === 0x46; // RIFF
      const isMp3File = uint8Array[0] === 0xFF && (uint8Array[1] & 0xE0) === 0xE0; // MP3 sync header
      const isOggFile = uint8Array[0] === 0x4F && uint8Array[1] === 0x67 && uint8Array[2] === 0x67 && uint8Array[3] === 0x53; // OggS
      
      console.log('🔍 오디오 파일 형식 분석:', {
        'WAV(RIFF)': isWavFile,
        'MP3': isMp3File,
        'OGG': isOggFile,
        '첫 4바이트': Array.from(uint8Array.slice(0, 4)).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' ')
      });
      
      // 🔧 플랫폼별 최적 확장자 결정
      let audioExtension;
      if (Platform.OS === 'android') {
        // Android: MP3 우선, WAV는 호환성 문제 있음
        audioExtension = isMp3File ? 'mp3' : 'mp3'; // 모든 경우에 mp3로 저장
      } else {
        // iOS: WAV, MP3 모두 지원
        audioExtension = isWavFile ? 'wav' : isMp3File ? 'mp3' : 'wav';
      }
      
      console.log(`📱 ${Platform.OS} 플랫폼: .${audioExtension} 파일로 저장`);
      
      // 🔧 Buffer를 사용한 더 안정적인 base64 변환
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      
      console.log('🔄 Buffer 기반 base64 변환 완료:', base64.length, 'characters');
      
      // 🎯 다중 시도를 위한 파일 경로들
      const attempts = [
        { path: `${RNFS.DocumentDirectoryPath}/ws_binary_audio_makestory2.${audioExtension}`, ext: audioExtension },
        { path: `${RNFS.DocumentDirectoryPath}/ws_binary_audio_makestory2.mp3`, ext: 'mp3' },
        { path: `${RNFS.DocumentDirectoryPath}/ws_binary_audio_makestory2.wav`, ext: 'wav' }
      ];
      
      let playSuccess = false;
      let lastError = null;
      
      for (const attempt of attempts) {
        try {
          console.log(`🎯 시도 ${attempts.indexOf(attempt) + 1}: .${attempt.ext} 파일로 재생`);
          
          // 임시 파일로 저장
          await RNFS.writeFile(attempt.path, base64, 'base64');
          
          // 파일 검증
          const fileExists = await RNFS.exists(attempt.path);
          const fileStats = await RNFS.stat(attempt.path);
          
          console.log('🔍 파일 검증:', {
            존재: fileExists,
            크기: fileStats.size + ' bytes',
            경로: attempt.path
          });
          
          if (!fileExists || fileStats.size === 0) {
            throw new Error('파일 저장 실패');
          }
          
          // 재생 시도
          const result = await audioRecorderPlayerRef.current.startPlayer(attempt.path);
          console.log(`✅ .${attempt.ext} 파일 재생 성공:`, result);
          
          // 재생 완료 리스너 등록
          audioRecorderPlayerRef.current.addPlayBackListener((e) => {
            if (e.currentPosition === e.duration && e.duration > 0) {
              console.log(`✅ .${attempt.ext} 파일 재생 완료`);
              // 재생 완료 후 파일 삭제
              RNFS.unlink(attempt.path).catch(console.warn);
            }
          });
          
          playSuccess = true;
          break; // 성공하면 루프 종료
          
        } catch (attemptError) {
          console.warn(`⚠️ .${attempt.ext} 재생 실패:`, attemptError.message);
          lastError = attemptError;
          
          // 실패한 파일 정리
          RNFS.unlink(attempt.path).catch(() => {});
          
          // 다음 시도를 위해 계속
          continue;
        }
      }
      
      if (!playSuccess) {
        throw new Error(`모든 오디오 형식 재생 실패. 마지막 오류: ${lastError?.message}`);
      }

    } catch (error) {
      console.error('❌ 바이너리 오디오 재생 완전 실패:', error);
      console.error('❌ 에러 상세:', {
        message: error.message,
        stack: error.stack,
        audioBlob: audioBlob ? { size: audioBlob.size, type: audioBlob.type } : 'null'
      });
      
      // 🚨 사용자에게 오디오 재생 실패 알림 (선택사항)
      // Alert.alert('오디오 재생 실패', '음성을 재생할 수 없습니다. 텍스트를 확인해 주세요.');
    }
  };

  // 🎵 서버에서 받은 오디오 재생 함수 (플랫폼별 최적화)
  const playServerAudio = async (base64Audio) => {
    try {
      // 이전 오디오 정지
      await stopAudio();
      
      const Platform = require('react-native').Platform;
      console.log('🎵 서버 오디오 재생 시작:', {
        platform: Platform.OS,
        base64Length: base64Audio.length,
        preview: base64Audio.substring(0, 100) + '...'
      });
      
      // base64 데이터 정리 (헤더 제거)
      const cleanBase64 = base64Audio.replace(/^data:audio\/[^;]+;base64,/, '');
      
      // 🔧 플랫폼별 확장자 결정
      const audioExtension = Platform.OS === 'android' ? 'mp3' : 'wav';
      
      // 🎯 다중 시도를 위한 파일 경로들
      const attempts = [
        { path: `${RNFS.DocumentDirectoryPath}/server_audio_makestory2.${audioExtension}`, ext: audioExtension },
        { path: `${RNFS.DocumentDirectoryPath}/server_audio_makestory2.mp3`, ext: 'mp3' },
        { path: `${RNFS.DocumentDirectoryPath}/server_audio_makestory2.wav`, ext: 'wav' }
      ];
      
      let playSuccess = false;
      let lastError = null;
      
      for (const attempt of attempts) {
        try {
          console.log(`🎯 서버 오디오 시도 ${attempts.indexOf(attempt) + 1}: .${attempt.ext} 파일로 재생`);
          
          // 임시 파일로 저장
          await RNFS.writeFile(attempt.path, cleanBase64, 'base64');
          
          // 파일 검증
          const fileExists = await RNFS.exists(attempt.path);
          const fileStats = await RNFS.stat(attempt.path);
          
          console.log('🔍 서버 오디오 파일 검증:', {
            존재: fileExists,
            크기: fileStats.size + ' bytes',
            경로: attempt.path
          });
          
          if (!fileExists || fileStats.size === 0) {
            throw new Error('서버 오디오 파일 저장 실패');
          }
          
          // 재생 시도
          const result = await audioRecorderPlayerRef.current.startPlayer(attempt.path);
          console.log(`✅ 서버 .${attempt.ext} 파일 재생 성공:`, result);
          
          // 재생 완료 리스너 등록
          audioRecorderPlayerRef.current.addPlayBackListener((e) => {
            if (e.currentPosition === e.duration && e.duration > 0) {
              console.log(`✅ 서버 .${attempt.ext} 파일 재생 완료`);
              // 재생 완료 후 파일 삭제
              RNFS.unlink(attempt.path).catch(console.warn);
            }
          });
          
          playSuccess = true;
          break; // 성공하면 루프 종료
          
        } catch (attemptError) {
          console.warn(`⚠️ 서버 .${attempt.ext} 재생 실패:`, attemptError.message);
          lastError = attemptError;
          
          // 실패한 파일 정리
          RNFS.unlink(attempt.path).catch(() => {});
          
          // 다음 시도를 위해 계속
          continue;
        }
      }
      
      if (!playSuccess) {
        console.error(`❌ 서버 오디오 모든 형식 재생 실패. 마지막 오류: ${lastError?.message}`);
      }

    } catch (error) {
      console.error('❌ 서버 오디오 재생 완전 실패:', error);
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

  // 컴포넌트 마운트 시 WebSocket 연결 (중복 방지)
  useEffect(() => {
    // 이미 연결되어 있으면 새로 연결하지 않음
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log('🔗 기존 WebSocket 연결 유지');
      return;
    }
    
    // 기존 연결이 있으면 정리
    if (wsRef.current) {
      console.log('🧹 기존 WebSocket 연결 정리');
      wsRef.current.close();
      wsRef.current = null;
    }
    
    console.log('🔌 새 WebSocket 연결 시도');
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        console.log('🔌 컴포넌트 언마운트 - WebSocket 연결 종료');
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [jwtToken]);

  // AI 응답 텍스트 및 오디오 설정
  useEffect(() => {
    if (storyCompleted && storyId) {
      setAiText('동화가 완성되었어요! 함께 읽어볼까요?');
    } else if (route.params?.serverResponse) {
      const serverResponse = route.params.serverResponse;
      console.log('✅ AnswerScreen에서 받은 서버 응답:', serverResponse);
      
      if (serverResponse.text) {
        setAiText(serverResponse.text);
      }
      
      // 서버에서 제공한 오디오가 있으면 재생 (base64 오디오)
      if (serverResponse.audio) {
        console.log('🎵 서버 제공 base64 오디오 재생 시작');
        playServerAudio(serverResponse.audio);
      }
      
      // WebSocket 바이너리 오디오가 오는 경우 대기
      if (serverResponse.audio_method === 'websocket_binary') {
        console.log('🎵 WebSocket 바이너리 오디오 대기 중...');
        // WebSocket을 통해 바이너리 오디오가 곧 도착할 예정
      }
    } else if (aiResult) {
      console.log('✅ AnswerScreen에서 받은 AI 응답:', aiResult);
      setAiText(aiResult);
    } else {
      fetchDefaultMessage();
    }
  }, [aiResult, storyCompleted, storyId, route.params]);

  const fetchDefaultMessage = async () => {
    if (!aiResult) {
      setAiText('지금부터 너의 이야기를 들려줄래?');
    }
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      console.log('🧹 MakeStoryScreen2 정리 시작');
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        console.log('⏰ 타임아웃 정리 완료');
      }
      
      stopAudio();
      
      // WebSocket 연결 종료
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log('🔌 WebSocket 연결 종료 중...');
        wsRef.current.close(1000, 'Component unmounting');
        wsRef.current = null;
      }
      
      // 임시 파일들 정리 (모든 확장자 포함)
      const tempFiles = [
        'server_audio_makestory2.wav',
        'server_audio_makestory2.mp3',
        'ws_audio_makestory2.wav',
        'ws_audio_makestory2.mp3',
        'ws_binary_audio_makestory2.wav',
        'ws_binary_audio_makestory2.mp3'
      ];
      
      tempFiles.forEach(filename => {
        RNFS.unlink(`${RNFS.DocumentDirectoryPath}/${filename}`)
          .then(() => console.log('🗑️ 임시 파일 삭제:', filename))
          .catch(() => {}); // 파일이 없어도 무시
      });
      
      console.log('✅ MakeStoryScreen2 정리 완료');
    };
  }, []);

  const handleAnswer = async () => {
    try {
      console.log('🎤 MakeStoryScreen2에서 녹음 시작');
      const result = await startRecording();
      
      if (result && result.path) {
        console.log('✅ 녹음 시작 성공:', result);
        console.log('📁 녹음 파일 경로:', result.path);
        console.log('📝 파일명:', result.fileName);
        
        navigation.navigate('Answer', {
          childName: '상아',
          age: 7,
          interests: ['공룡', '로봇'],
          recordingStarted: true,
          recordingPath: result.path,
          recordingFileName: result.fileName,
          jwtToken
        });
      } else {
        console.error('🔴 녹음 시작 실패: result가 null');
        Alert.alert('실패', '녹음을 시작할 수 없습니다.');
      }
    } catch (error) {
      console.error('🔴 녹음 시작 에러:', error);
      Alert.alert('실패', '녹음을 시작하는 데 실패했습니다.');
    }
  };

  const handleComplete = async () => {
    console.log('📚 완성하기 버튼 클릭 - conversation_finish 전송');
    
    try {
      // WebSocket을 통해 conversation_finish 메시지 전송
      if (jwtToken && jwtToken !== 'development_token') {
        const { WS } = require('../constants');
        const wsUrl = `${WS.BASE_URL}?child_name=${encodeURIComponent('상아')}&age=7&interests=${encodeURIComponent('공룡,로봇')}&token=${jwtToken}`;
        
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('✅ conversation_finish 전송을 위한 WebSocket 연결됨');
          
          // conversation_finish 메시지 전송
          const finishMessage = {
            type: 'conversation_finish'
          };
          
          ws.send(JSON.stringify(finishMessage));
          console.log('📤 conversation_finish 메시지 전송됨');
          
          // 메시지 전송 후 연결 종료
          setTimeout(() => {
            ws.close(1000, 'Conversation finished');
          }, 1000);
        };
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('📥 conversation_finish 응답 받음:', data);
            
            if (data.type === 'conversation_finished' || data.type === 'orchestrator_ready') {
              console.log('✅ 백엔드에서 대화 종료 확인됨');
              ws.close(1000, 'Conversation finished confirmed');
            }
          } catch (error) {
            console.log('📥 conversation_finish 응답 파싱 실패:', error);
          }
        };
        
        ws.onerror = (error) => {
          console.error('❌ conversation_finish WebSocket 에러:', error);
          // 에러가 발생해도 스토리 생성은 진행 (3초 후)
          setTimeout(() => {
            navigateToStoryPartial();
          }, 3000);
        };
        
        ws.onclose = () => {
          console.log('🔌 conversation_finish WebSocket 연결 종료됨');
          // 백엔드가 준비될 시간을 주고 스토리 생성으로 진행 (3초 후)
          setTimeout(() => {
            navigateToStoryPartial();
          }, 3000);
        };
        
        // 8초 타임아웃 설정 (백엔드 준비 시간 고려)
        setTimeout(() => {
          if (ws.readyState <= 1) {
            console.log('⏰ conversation_finish WebSocket 타임아웃');
            ws.close(1000, 'Timeout');
            // 타임아웃 시에도 3초 후 이동
            setTimeout(() => {
              navigateToStoryPartial();
            }, 3000);
          }
        }, 8000);
        
      } else {
        console.log('⚠️ development_token 또는 토큰 없음 - conversation_finish 스킵');
        // 개발 모드에서도 백엔드가 준비될 시간을 줌 (2초 후)
        setTimeout(() => {
          navigateToStoryPartial();
        }, 2000);
      }
    } catch (error) {
      console.error('❌ conversation_finish 전송 실패:', error);
      // 에러 시에도 백엔드 준비 시간을 줌 (3초 후)
      setTimeout(() => {
        navigateToStoryPartial();
      }, 3000);
    }
  };

  const navigateToStoryPartial = () => {
    console.log('📚 StoryPartial로 이동');
    console.log('🔑 JWT 토큰 전달:', jwtToken ? `${jwtToken.substring(0, 20)}...` : '없음');
    
    navigation.navigate('StoryPartial', {
      childProfile: {
        name: '상아',
        age: 7,
        age_group: 'elementary', // 필수 파라미터 추가
        interests: ['공룡', '로봇'],
        language_level: 'basic'
      },
      jwtToken: jwtToken // JWT 토큰 전달
    });
  };

  return (
    <View style={styles.bg}>
      {/* 상단 흰색 영역 + 말풍선 */}
      <View style={styles.topWhite}>
        <View style={styles.bubbleWrap}>
          <View style={styles.bubble}>
            <ScrollView 
              style={styles.bubbleScroll}
              contentContainerStyle={styles.bubbleScrollContent}
              showsVerticalScrollIndicator={true}
              indicatorStyle="dark"
              nestedScrollEnabled={true}
            >
              <Text style={styles.bubbleText}>{aiText}</Text>
            </ScrollView>
          </View>
        </View>
      </View>
      {/* 가운데 영역 */}
      <View style={styles.centerBg}>
        <View style={styles.container}>
          <Image source={require('../assets/num3.png')} style={styles.smallImage} />
        </View>
      </View>
      {/* 하단 흰색 영역 + 버튼 2개 */}
      <View style={styles.bottomWhite}>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleAnswer}
          >
            <Text style={styles.buttonText}>대답하기</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleComplete}
          >
            <Text style={styles.buttonText}>완성하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
    minHeight: 120, // 최소 높이 증가
    maxHeight: 280, // 최대 높이 증가 (긴 텍스트 대응)
  },
  centerBg: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // 배경색 추가
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
  },
  bubbleWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 0,
    marginLeft: 0,
    marginBottom: 0,
    flex: 1, // 유연한 크기 조정
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
    justifyContent: 'flex-start', // center에서 flex-start로 변경
    minHeight: 80, // 최소 높이 증가
    maxHeight: 200, // 최대 높이 설정 (스크롤 활성화)
  },
  bubbleScroll: {
    width: '100%',
    maxHeight: '100%', // 부모 컨테이너 크기에 맞춤
  },
  bubbleScrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingVertical: 2, // 약간의 패딩으로 텍스트가 잘리지 않게
  },
  bubbleText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    textAlign: 'left',
    lineHeight: 24, // 줄 간격 약간 증가
    flexWrap: 'wrap', // 텍스트 줄바꿈
    width: '100%', // 전체 너비 사용
  },
  bubbleArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderTopWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#4B662B',
    alignSelf: 'flex-start',
    marginLeft: 34,
    marginTop: -2,
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
    paddingBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  button: {
    backgroundColor: '#9ACA70',
    borderRadius: 14,
    paddingHorizontal: 32,
    paddingVertical: 10,
    minWidth: 120,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
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

export default MakeStoryScreen2;