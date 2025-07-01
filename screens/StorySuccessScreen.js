// screens/StorySuccessScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ArrowImg from '../assets/arrow.png';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { API } from '../constants';

export default function StorySuccessScreen({ route }) {
  const navigation = useNavigation();
  const { storyId, storyData, completionProgress } = route.params || {};
  
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentText, setCurrentText] = useState('');
  const [audioFiles, setAudioFiles] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showConversation, setShowConversation] = useState(false);
  const [storyChapters, setStoryChapters] = useState([]);
  const [currentChapterTitle, setCurrentChapterTitle] = useState('');
  const audioRecorderPlayerRef = useRef(new AudioRecorderPlayer());
  const [listenerRegistered, setListenerRegistered] = useState(false);
  
  // 동화 데이터에서 이미지와 텍스트 추출 + 자동 재생
  useEffect(() => {
    if (storyData && storyData.multimedia_assets && storyData.generated_story) {
      console.log('📖 동화 데이터 처리 시작:', storyData.metadata?.title);
      
      // 이미지 URL 처리 (nginx 프록시를 통한 접근)
      const images = storyData.multimedia_assets.images || [];
      const processedImages = images.map(image => {
        const imagePath = image.url.replace('/app', ''); // /app 제거
        const imageUrl = `${API.BASE_URL}:8001${imagePath}`;
        return {
          ...image,
          processedUrl: imageUrl
        };
      });
      
      // 오디오 파일 URL 처리 및 상세 로깅
      const audioFiles = storyData.multimedia_assets.audio_files || [];
      console.log('🎵 원본 오디오 데이터:', audioFiles);
      
      const processedAudio = audioFiles.map(audio => {
        const audioPath = audio.path ? audio.path.replace('/app', '') : '';
        const audioUrl = audioPath ? `${API.BASE_URL}:8001${audioPath}` : '';
        
        console.log('🎵 오디오 처리:', {
          원본경로: audio.path,
          처리된경로: audioPath,
          최종URL: audioUrl,
          파일명: audio.filename,
          전체데이터: audio
        });
        
        return {
          ...audio,
          processedUrl: audioUrl
        };
      });
      
      console.log('🖼️ 처리된 이미지들:', processedImages);
      console.log('🎵 처리된 오디오들:', processedAudio);
      console.log('🎵 오디오 파일 개수:', processedAudio.length);
      
      setAudioFiles(processedAudio);
      
      // 첫 번째 챕터 표시
      if (processedImages.length > 0) {
        setCurrentImage(processedImages[0].processedUrl);
      }
      
      // story.txt 파일에서 챕터 내용 로드
      if (storyId) {
        fetchStoryText(storyId);
      }
      
      // 🎵 오디오 확인 및 첫 번째 챕터 자동 재생 (1초 후)
      if (processedAudio.length > 0) {
        console.log('🎵 오디오 파일 발견, 자동 재생 예약');
        setTimeout(() => {
          console.log('🎵 첫 번째 챕터 자동 재생 시작');
          playAudio(0);
        }, 1000);
      } else {
        console.warn('⚠️ 처리된 오디오 파일이 없습니다. TTS 대체 재생 시도...');
        // TTS를 통한 대체 오디오 재생 시도
        setTimeout(() => {
          console.log('🎵 TTS 대체 재생 시작');
          playTTSForChapter(0);
        }, 1000);
      }
    }
     }, [storyData]);

  // 스토리 데이터 가져오기 (새로운 API 스펙 사용)
  useEffect(() => {
    if (storyId) {
      fetchStoryDataFromAPI();
    }
  }, [storyId]);

  const fetchStoryDataFromAPI = async () => {
    try {
      console.log('📖 스토리 데이터 가져오기 시작:', storyId);
      
      // 1단계: 먼저 storyId로 상태 조회해서 실제 UUID 얻기
      let actualUuid = null;
      try {
        console.log('🔍 UUID 조회를 위한 상태 체크 시도...');
        const statusResponse = await fetch(`${API.BASE_URL}/api/v1/stories/${storyId}/status`);
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          actualUuid = statusData.data?.uuid_story_id;
          console.log('✅ 상태 조회에서 UUID 추출:', actualUuid);
        }
      } catch (statusError) {
        console.warn('⚠️ 상태 조회 실패, 원본 ID로 진행:', statusError);
      }
      
      // 2단계: UUID가 있으면 UUID로, 없으면 원본 ID로 스토리 데이터 조회
      const queryId = actualUuid || storyId;
      console.log('🎯 최종 스토리 조회 ID:', queryId);
      
      const response = await fetch(`${API.BASE_URL}/api/v1/stories/${queryId}`);
      
      if (!response.ok) {
        throw new Error(`스토리 조회 실패: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ 스토리 API 응답:', result);
      
      if (result.success && result.data) {
        const storyApiData = result.data;
        
        // 챕터 데이터 처리
        if (storyApiData.generated_story?.chapters) {
          const chapters = storyApiData.generated_story.chapters.map(chapter => ({
            title: `챕터 ${chapter.chapter_number}`,
            content: chapter.narration,
            dialogues: chapter.dialogues || []
          }));
          
          setStoryChapters(chapters);
          
          if (chapters.length > 0) {
            setCurrentText(chapters[0].content);
            setCurrentChapterTitle(chapters[0].title);
          }
          
          console.log('📚 챕터 데이터 설정 완료:', chapters.length, '개 챕터');
        }
        
        // 대화 내역을 챕터의 dialogues에서 추출하여 표시
        const allDialogues = [];
        if (storyApiData.generated_story?.chapters) {
          storyApiData.generated_story.chapters.forEach(chapter => {
            if (chapter.dialogues) {
              chapter.dialogues.forEach(dialogue => {
                allDialogues.push({
                  type: dialogue.speaker === '내레이터' ? 'ai' : 'user',
                  content: dialogue.text
                });
              });
            }
          });
        }
        
        if (allDialogues.length > 0) {
          setConversationHistory(allDialogues);
          setShowConversation(true);
          console.log('💬 대화 내역 설정 완료:', allDialogues.length, '개 대화');
        }
        
        // 🎵 스토리 완성 시 완성된 오디오 파일도 조회
        if (storyApiData.metadata?.status === 'completed') {
          console.log('✅ 완성된 스토리 감지, 완성된 오디오 파일 조회 시도...');
          await fetchCompletedStoryAudio(queryId);
        }
        
      } else {
        throw new Error('스토리 데이터 형식 오류');
      }
    } catch (error) {
      console.warn('⚠️ 스토리 API 가져오기 실패:', error);
      // 실패하면 기존 story.txt 방식으로 폴백 (UUID 시도)
      console.log('📄 story.txt 파일로 폴백 시도...');
      
      // UUID가 있으면 UUID로도 시도해보기
      let storyTextFound = false;
      
      // 1. 먼저 상태 조회로 UUID 얻기 시도
      try {
        const statusResponse = await fetch(`${API.BASE_URL}/api/v1/stories/${storyId}/status`);
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          const actualUuid = statusData.data?.uuid_story_id;
          if (actualUuid) {
            console.log('📄 UUID로 story.txt 시도:', actualUuid);
            try {
              // UUID도 story_상아_ 형태로 시도
              const uuidStoryId = actualUuid.includes('story_') ? actualUuid : `story_상아_${actualUuid}`;
              await fetchStoryText(uuidStoryId);
              storyTextFound = true;
            } catch (uuidError) {
              console.warn('⚠️ UUID로 story.txt 실패:', uuidError);
            }
          }
        }
      } catch (statusError) {
        console.warn('⚠️ 상태 조회 실패:', statusError);
      }
      
      // 2. UUID로 실패했으면 원본 ID로 시도
      if (!storyTextFound) {
        console.log('📄 원본 ID로 story.txt 시도:', storyId);
        try {
          await fetchStoryText(storyId);
        } catch (originalError) {
          console.warn('⚠️ 원본 ID로도 story.txt 실패:', originalError);
        }
      }
      
      setShowConversation(false);
    }
  };

  // story.txt 파일에서 동화 내용 가져오기
  const fetchStoryText = async (storyId) => {
    try {
      console.log('📖 story.txt 파일 가져오기 시작:', storyId);
      
      // storyId 형태에 따라 URL 생성
      let storyUrl;
      if (storyId.includes('story_')) {
        // 이미 story_상아_숫자 형태인 경우
        storyUrl = `${API.BASE_URL}/output/stories/${storyId}/story.txt`;
      } else {
        // 숫자만 있는 경우 story_상아_ 접두사 추가
        storyUrl = `${API.BASE_URL}/output/stories/story_상아_${storyId}/story.txt`;
      }
      
      console.log('📍 요청 URL:', storyUrl);
      
      const response = await fetch(storyUrl);
      
      if (!response.ok) {
        throw new Error(`story.txt 파일 조회 실패: ${response.status}`);
      }

      const storyText = await response.text();
      console.log('✅ story.txt 내용 가져오기 성공');
      console.log('📄 원본 파일 내용:');
      console.log('=====================================');
      console.log(storyText);
      console.log('=====================================');
      console.log('📏 파일 길이:', storyText.length, '글자');
      
      // 챕터별로 파싱
      const chapters = parseStoryChapters(storyText);
      setStoryChapters(chapters);
      
      if (chapters.length > 0) {
        setCurrentText(chapters[0].content);
        setCurrentChapterTitle(chapters[0].title);
        console.log('✅ 첫 번째 챕터 설정:', chapters[0].title);
      } else {
        console.warn('⚠️ 파싱된 챕터가 없습니다.');
        setCurrentText(storyText); // 파싱 실패 시 전체 텍스트 표시
        setCurrentChapterTitle('전체 이야기');
      }
      
    } catch (error) {
      console.warn('⚠️ story.txt 가져오기 실패:', error);
      setCurrentText('동화 내용을 불러오는 데 실패했습니다.');
    }
  };

  // story.txt 내용을 챕터별로 파싱
  const parseStoryChapters = (storyText) => {
    console.log('🔍 챕터 파싱 시작...');
    const chapters = [];
    
    // **제목** 패턴으로 챕터 분리
    console.log('📝 정규식 분리 시도: /\\*\\*(.*?)\\*\\*/');
    const chapterSections = storyText.split(/\*\*(.*?)\*\*/);
    console.log('🔪 분리된 섹션 수:', chapterSections.length);
    console.log('📋 분리된 섹션들:');
    
    chapterSections.forEach((section, index) => {
      console.log(`  [${index}]: "${section.substring(0, 50)}${section.length > 50 ? '...' : ''}"`);
    });
    
    for (let i = 1; i < chapterSections.length; i += 2) {
      const title = chapterSections[i] ? chapterSections[i].trim() : '';
      const content = chapterSections[i + 1] ? chapterSections[i + 1].trim() : '';
      
      console.log(`\n📖 챕터 ${Math.floor(i/2) + 1} 처리:`);
      console.log(`  제목: "${title}"`);
      console.log(`  내용 길이: ${content.length}글자`);
      console.log(`  내용 미리보기: "${content.substring(0, 100)}${content.length > 100 ? '...' : ''}"`);
      
      if (title && content) {
        chapters.push({
          title: title,
          content: content
        });
        console.log(`  ✅ 챕터 추가됨: "${title}"`);
      } else {
        console.log(`  ⚠️ 챕터 스킵됨 - 제목: ${!!title}, 내용: ${!!content}`);
      }
    }
    
    console.log(`\n🎉 파싱 완료: ${chapters.length}개 챕터`);
    console.log('📚 최종 챕터 목록:', chapters.map((ch, idx) => `${idx + 1}. ${ch.title}`));
    
    return chapters;
  };

  // WebSocket을 통한 실시간 TTS 요청
  const playTTSForChapter = async (chapterIndex) => {
    try {
      console.log(`🎙️ TTS 재생 시작: 챕터 ${chapterIndex + 1}`);
      
      if (!storyChapters || storyChapters.length === 0) {
        console.warn('⚠️ 스토리 챕터 데이터가 없음');
        return;
      }
      
      const chapter = storyChapters[chapterIndex];
      if (!chapter || !chapter.content) {
        console.warn(`⚠️ 챕터 ${chapterIndex + 1} 내용이 없음`);
        return;
      }
      
      setIsPlaying(true);
      
      // WebSocket을 통한 TTS 요청
      try {
        await requestTTSFromServer(chapter.content, chapterIndex);
      } catch (ttsError) {
        console.warn('⚠️ 서버 TTS 요청 실패, 로컬 시뮬레이션으로 대체:', ttsError);
        
        // 서버 TTS 실패 시 로컬 시뮬레이션
        console.log(`🎙️ TTS 텍스트: "${chapter.content.substring(0, 50)}..."`);
        setTimeout(() => {
          console.log('🎙️ TTS 재생 완료 (시뮬레이션)');
          setIsPlaying(false);
        }, 3000);
      }
      
    } catch (error) {
      console.error('❌ TTS 재생 오류:', error);
      setIsPlaying(false);
    }
  };

  // 서버에서 TTS 오디오 요청
  const requestTTSFromServer = async (text, chapterIndex) => {
    try {
      console.log('🎙️ 서버 TTS 요청 시작:', text.substring(0, 50) + '...');
      
      // HTTP API를 통한 TTS 요청 (WebSocket 대신)
      const response = await fetch(`${API.BASE_URL}:8001/api/v1/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice_id: 'korean_female', // 기본 한국어 여성 음성
          chapter_index: chapterIndex
        })
      });
      
      if (!response.ok) {
        throw new Error(`TTS API 요청 실패: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.audio) {
        console.log('✅ 서버 TTS 오디오 수신');
        await playServerTTSAudio(result.audio);
      } else {
        throw new Error('TTS 응답에 오디오 데이터 없음');
      }
      
    } catch (error) {
      console.error('❌ 서버 TTS 요청 실패:', error);
      throw error; // 상위에서 처리하도록 에러 재발생
    }
  };

  // 서버 TTS 오디오 재생
  const playServerTTSAudio = async (base64Audio) => {
    try {
      // 이전 오디오 정지
      await stopAudio();
      
      console.log('🎵 서버 TTS 오디오 재생 시작');
      
      // base64 데이터 정리 (헤더 제거)
      const cleanBase64 = base64Audio.replace(/^data:audio\/[^;]+;base64,/, '');
      
      // 임시 파일로 저장
      const tempFilePath = `${RNFS.DocumentDirectoryPath}/tts_audio_story.wav`;
      await RNFS.writeFile(tempFilePath, cleanBase64, 'base64');

      // 새 AudioRecorderPlayer 인스턴스 생성
      audioRecorderPlayerRef.current = new AudioRecorderPlayer();
      
      const result = await audioRecorderPlayerRef.current.startPlayer(tempFilePath);
      console.log('✅ 서버 TTS 오디오 재생 시작됨:', result);

      audioRecorderPlayerRef.current.addPlayBackListener((e) => {
        if (e.currentPosition === e.duration && e.duration > 0) {
          console.log('✅ 서버 TTS 오디오 재생 완료');
          setIsPlaying(false);
          // 재생 완료 후 파일 삭제
          RNFS.unlink(tempFilePath).catch(console.warn);
        }
      });

    } catch (error) {
      console.error('❌ 서버 TTS 오디오 재생 실패:', error);
      setIsPlaying(false);
    }
  };

  // 완성된 스토리 오디오 파일 조회
  const fetchCompletedStoryAudio = async (storyId) => {
    try {
      console.log('🔍 완성된 스토리 오디오 조회 시작:', storyId);
      
      // 1. 완성된 스토리 멀티미디어 파일 조회
      const completionResponse = await fetch(`${API.BASE_URL}/api/v1/stories/${storyId}/completion`);
      if (completionResponse.ok) {
        const completionData = await completionResponse.json();
        if (completionData.success && completionData.data?.multimedia_files?.audio) {
          const completedAudioFiles = completionData.data.multimedia_files.audio.map(audio => ({
            filename: audio.filename,
            path: audio.url,
            processedUrl: `${API.BASE_URL}:8001${audio.url}`,
            type: audio.type,
            chapter: audio.chapter
          }));
          
          console.log('🎵 완성된 오디오 파일 발견:', completedAudioFiles);
          setAudioFiles(prev => [...prev, ...completedAudioFiles]);
          return;
        }
      }
      
      // 2. 대체 방법: ElevenLabs TTS API로 직접 오디오 생성 요청
      console.log('🎙️ 완성된 오디오 파일 없음, TTS로 생성 요청...');
      
      if (storyChapters.length > 0) {
        // 모든 챕터에 대해 TTS 오디오 생성 요청
        for (let i = 0; i < storyChapters.length; i++) {
          const chapter = storyChapters[i];
          if (chapter && chapter.content) {
            try {
              const ttsResponse = await fetch(`${API.BASE_URL}:8001/api/v1/tts`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  text: chapter.content,
                  voice_id: 'korean_female',
                  chapter_index: i,
                  story_id: storyId
                })
              });
              
              if (ttsResponse.ok) {
                const ttsResult = await ttsResponse.json();
                if (ttsResult.success && ttsResult.file_path) {
                  const ttsAudioFile = {
                    filename: `tts_chapter_${i + 1}.wav`,
                    path: ttsResult.file_path,
                    processedUrl: `${API.BASE_URL}:8001${ttsResult.file_path}`,
                    type: 'narration',
                    chapter: i + 1
                  };
                  
                  console.log(`🎵 TTS 오디오 생성됨: 챕터 ${i + 1}`);
                  setAudioFiles(prev => [...prev, ttsAudioFile]);
                }
              }
            } catch (ttsError) {
              console.warn(`⚠️ 챕터 ${i + 1} TTS 생성 실패:`, ttsError);
            }
          }
        }
      }
      
    } catch (error) {
      console.error('❌ 완성된 스토리 오디오 조회 실패:', error);
    }
  };

  // 서버에서 실제 생성된 오디오 파일 구조 확인
  const fetchServerAudioFiles = async (storyId) => {
    try {
      console.log(`🔍 서버 오디오 파일 조회 시작: ${storyId}`);
      
      // 서버 API를 통해 스토리별 임시 파일 조회
      const response = await fetch(`${API.BASE_URL}:8001/api/v1/temp/by-story/${storyId}`);
      
      if (!response.ok) {
        console.warn(`⚠️ 서버 파일 조회 실패: ${response.status}`);
        return [];
      }
      
      const result = await response.json();
      console.log('🔍 서버 응답:', result);
      
      if (result.success && result.data) {
        const audioFiles = result.data.files_by_type?.audio || [];
        console.log(`🎵 서버에서 발견된 오디오 파일: ${audioFiles.length}개`);
        
        // 서버 파일을 클라이언트 형식으로 변환
        const processedAudioFiles = audioFiles.map(file => ({
          filename: file.filename,
          path: file.file_path,
          processedUrl: `${API.BASE_URL}:8001/api/v1/temp/${file.file_path}`,
          size: file.size,
          type: file.extension
        }));
        
        console.log('🎵 변환된 오디오 파일들:', processedAudioFiles);
        return processedAudioFiles;
      }
      
      return [];
    } catch (error) {
      console.error('❌ 서버 오디오 파일 조회 오류:', error);
      return [];
    }
  };

  // 챕터별 오디오 파일들을 순차적으로 재생하는 함수
  const playAudio = async (chapterIndex = currentChapterIndex) => {
    try {
      console.log(`🎵 오디오 재생 시작: 챕터 ${chapterIndex + 1}`);
      
      // 🔄 AudioRecorderPlayer 인스턴스 완전히 새로 생성 (스택 오버플로우 방지)
      if (audioRecorderPlayerRef.current) {
        try {
          await audioRecorderPlayerRef.current.stopPlayer();
          audioRecorderPlayerRef.current.removePlayBackListener();
        } catch (e) {
          console.warn('⚠️ 기존 플레이어 정지 실패 (무시):', e);
        }
      }
      
      // 완전히 새 인스턴스 생성
      audioRecorderPlayerRef.current = new AudioRecorderPlayer();

      // 🎵 1단계: 기존 방식으로 오디오 파일 찾기
      let chapterAudioFiles = findChapterAudioFiles(chapterIndex + 1);
      console.log(`🔍 기존 방식 오디오 파일: ${chapterAudioFiles.length}개`);
      
      // 🎵 2단계: 기존 방식에서 찾지 못했으면 서버에서 직접 조회
      if (chapterAudioFiles.length === 0 && storyId) {
        console.log('🔍 서버에서 오디오 파일 재조회 시도...');
        const serverAudioFiles = await fetchServerAudioFiles(storyId);
        
        if (serverAudioFiles.length > 0) {
          // 서버에서 가져온 파일들을 audioFiles 상태에 업데이트
          setAudioFiles(serverAudioFiles);
          
          // 챕터별 필터링 다시 시도
          chapterAudioFiles = serverAudioFiles.filter(audio => {
            const filename = audio.filename || '';
            const chapterNumber = chapterIndex + 1;
            
            // 다양한 패턴으로 챕터 오디오 파일 찾기
            return filename.includes(`ch${chapterNumber}`) || 
                   filename.includes(`chapter${chapterNumber}`) ||
                   filename.includes(`chapter_${chapterNumber}`) ||
                   filename.includes(`${chapterNumber}_`);
          });
          
          console.log(`🔍 서버 조회 후 챕터 ${chapterIndex + 1} 오디오 파일: ${chapterAudioFiles.length}개`);
        }
      }
      
      // 🎵 3단계: 여전히 찾지 못했으면 TTS 대체 재생
      if (chapterAudioFiles.length === 0) {
        console.warn(`⚠️ 챕터 ${chapterIndex + 1}의 오디오 파일을 찾을 수 없음. TTS 대체 재생...`);
        await playTTSForChapter(chapterIndex);
        return;
      }

      console.log(`🎵 챕터 ${chapterIndex + 1} 오디오 재생 시작:`, chapterAudioFiles.map(f => f.filename || f.path));
      
      setIsPlaying(true);
      
      // 🎶 순차적으로 오디오 파일들 재생
      await playAudioSequence(chapterAudioFiles, chapterIndex);

    } catch (error) {
      console.error('❌ 오디오 재생 오류:', error);
      setIsPlaying(false);
      // TTS 대체 재생 시도
      console.log('🎙️ 오류 발생으로 TTS 대체 재생 시도...');
      await playTTSForChapter(chapterIndex);
    }
  };

  // 특정 챕터의 모든 오디오 파일 찾기 및 정렬 (개선된 패턴 매칭)
  const findChapterAudioFiles = (chapterNumber) => {
    console.log(`🔍 챕터 ${chapterNumber} 오디오 파일 검색 시작...`);
    console.log(`🔍 전체 오디오 파일 개수: ${audioFiles.length}`);
    console.log(`🔍 전체 오디오 파일 목록:`, audioFiles.map(f => f.filename || f.path));
    
    const chapterFiles = audioFiles.filter(audio => {
      const path = audio.path || audio.filename || '';
      const lowerPath = path.toLowerCase();
      
      console.log(`🔍 파일 검사: "${path}" (소문자: "${lowerPath}")`);
      
      // 다양한 패턴으로 챕터 오디오 파일 찾기
      const patterns = [
        `narration_ch${chapterNumber}_`,
        `dialogue_ch${chapterNumber}_`,
        `chapter_${chapterNumber}_`,
        `ch${chapterNumber}_`,
        `chapter${chapterNumber}_`,
        `${chapterNumber}_`,
        `scene_${chapterNumber - 1}`, // scene_0, scene_1, ... (0 기반 인덱스)
        `scene${chapterNumber - 1}`,
      ];
      
      let matched = false;
      for (const pattern of patterns) {
        if (lowerPath.includes(pattern.toLowerCase())) {
          console.log(`✅ 패턴 매칭: "${path}" ← "${pattern}"`);
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        console.log(`❌ 매칭 실패: "${path}"`);
      }
      
      return matched;
    });

    // 파일 순서 정렬: narration 먼저, 그 다음 dialogue_0, dialogue_1, ...
    chapterFiles.sort((a, b) => {
      const pathA = (a.path || a.filename || '').toLowerCase();
      const pathB = (b.path || b.filename || '').toLowerCase();
      
      // narration이 dialogue보다 먼저
      if (pathA.includes('narration') && pathB.includes('dialogue')) return -1;
      if (pathA.includes('dialogue') && pathB.includes('narration')) return 1;
      
      // dialogue 끼리는 숫자 순서대로
      if (pathA.includes('dialogue') && pathB.includes('dialogue')) {
        const numA = extractDialogueNumber(pathA);
        const numB = extractDialogueNumber(pathB);
        return numA - numB;
      }
      
      // 파일명 알파벳 순
      return pathA.localeCompare(pathB);
    });

    console.log(`🔍 챕터 ${chapterNumber} 오디오 파일 정렬 결과 (${chapterFiles.length}개):`, 
                chapterFiles.map(f => f.filename || f.path));
    return chapterFiles;
  };

  // dialogue 파일에서 번호 추출 (dialogue_ch1_0_ -> 0)
  const extractDialogueNumber = (path) => {
    const match = path.match(/dialogue_ch\d+_(\d+)_/);
    return match ? parseInt(match[1]) : 0;
  };

  // 오디오 파일들을 순차적으로 재생
  const playAudioSequence = async (audioFilesList, chapterIndex) => {
    for (let i = 0; i < audioFilesList.length; i++) {
      const audioFile = audioFilesList[i];
      const isLastFile = i === audioFilesList.length - 1;
      
      console.log(`🎵 재생 중 (${i + 1}/${audioFilesList.length}):`, audioFile.filename || audioFile.path);
      
      try {
        // 원격 URL에서 파일 다운로드
        const response = await fetch(audioFile.processedUrl);
        if (!response.ok) {
          throw new Error(`오디오 파일 다운로드 실패: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
        // 임시 파일로 저장
        const tempFilePath = `${RNFS.DocumentDirectoryPath}/story_audio_${chapterIndex}_${i}.wav`;
        await RNFS.writeFile(tempFilePath, base64, 'base64');

        // 파일 재생 및 완료 대기
        await playAndWaitForCompletion(tempFilePath, isLastFile);
        
        // 임시 파일 삭제
        RNFS.unlink(tempFilePath).catch(console.warn);
        
      } catch (error) {
        console.error(`❌ 오디오 파일 ${i + 1} 재생 실패:`, error);
        // 에러가 있어도 다음 파일 계속 재생
      }
    }
  };

  // 단일 오디오 파일 재생 및 완료 대기 (스택 오버플로우 방지)
  const playAndWaitForCompletion = (filePath, isLastFile) => {
    return new Promise(async (resolve) => {
      try {
        console.log('🎵 파일 재생 시작 시도:', filePath);
        const result = await audioRecorderPlayerRef.current.startPlayer(filePath);
        console.log('✅ 파일 재생 시작 성공:', result);

        // 리스너가 이미 등록되어 있지 않을 때만 등록
        let listenerResolved = false;
        
        const playbackListener = (e) => {
          if (listenerResolved) return; // 중복 호출 방지
          
          if (e.currentPosition === e.duration && e.duration > 0) {
            console.log('🎵 파일 재생 완료');
            listenerResolved = true;
            
            // 리스너 제거
            try {
              audioRecorderPlayerRef.current.removePlayBackListener();
            } catch (removeError) {
              console.warn('⚠️ 리스너 제거 실패:', removeError);
            }
            
            if (isLastFile) {
              setIsPlaying(false);
              console.log('🎉 챕터 전체 재생 완료');
            }
            
            resolve();
          }
        };

        audioRecorderPlayerRef.current.addPlayBackListener(playbackListener);
        
        // 타임아웃 안전장치 (10초)
        setTimeout(() => {
          if (!listenerResolved) {
            console.warn('⚠️ 재생 타임아웃 - 강제 완료');
            listenerResolved = true;
            try {
              audioRecorderPlayerRef.current.removePlayBackListener();
            } catch (e) {}
            resolve();
          }
        }, 10000);
        
      } catch (error) {
        console.error('❌ 파일 재생 시작 실패:', error);
        resolve();
      }
    });
  };

  // 오디오 정지 (안전한 방식)
  const stopAudio = async () => {
    try {
      if (audioRecorderPlayerRef.current) {
        await audioRecorderPlayerRef.current.stopPlayer();
        audioRecorderPlayerRef.current.removePlayBackListener();
        console.log('🛑 오디오 정지됨');
      }
    } catch (error) {
      console.warn('⚠️ 오디오 정지 오류 (무시):', error);
    }
    setIsPlaying(false);
  };

  // 이전 챕터로 이동
  const goToPreviousChapter = () => {
    if (storyChapters.length === 0) return;
    
    const newIndex = Math.max(0, currentChapterIndex - 1);
    if (newIndex !== currentChapterIndex) {
      setCurrentChapterIndex(newIndex);
      updateChapterContent(newIndex);
    }
  };

  // 다음 챕터로 이동
  const goToNextChapter = () => {
    if (storyChapters.length === 0) return;
    
    const maxIndex = storyChapters.length - 1;
    const newIndex = Math.min(maxIndex, currentChapterIndex + 1);
    if (newIndex !== currentChapterIndex) {
      setCurrentChapterIndex(newIndex);
      updateChapterContent(newIndex);
    }
  };

  // 챕터 내용 업데이트 + 자동 오디오 재생
  const updateChapterContent = (chapterIndex) => {
    // 📖 story.txt에서 파싱한 챕터 텍스트 업데이트
    if (storyChapters.length > chapterIndex) {
      const chapter = storyChapters[chapterIndex];
      setCurrentText(chapter.content);
      setCurrentChapterTitle(chapter.title);
    }

    // 해당 챕터의 이미지 찾기 (scene_0, scene_1, ...)
    if (storyData?.multimedia_assets?.images) {
      const chapterImage = storyData.multimedia_assets.images.find(image => 
        image.description?.includes(`scene_${chapterIndex}`) || 
        image.url?.includes(`scene_${chapterIndex}`)
      );
      
      if (chapterImage) {
        const imagePath = chapterImage.url.replace('/app', '');
        const imageUrl = `${API.BASE_URL}:8001${imagePath}`;
        setCurrentImage(imageUrl);
        console.log(`🖼️ 챕터 ${chapterIndex + 1} 이미지 업데이트:`, imageUrl);
      }
    }

    // 🎵 챕터 변경 시 자동 오디오 재생 (0.5초 후)
    setTimeout(() => {
      console.log(`🎵 챕터 ${chapterIndex + 1} 자동 재생 시작`);
      playAudio(chapterIndex);
    }, 500);
  };

  // 컴포넌트 언마운트 시 오디오 정리 (안전한 방식)
  useEffect(() => {
    return () => {
      console.log('🧹 StorySuccessScreen 정리 시작');
      
      // 오디오 정리
      stopAudio();
      
      // AudioRecorderPlayer 완전 정리
      if (audioRecorderPlayerRef.current) {
        try {
          audioRecorderPlayerRef.current.removePlayBackListener();
          audioRecorderPlayerRef.current = null;
        } catch (error) {
          console.warn('⚠️ AudioRecorderPlayer 정리 오류:', error);
        }
      }
      
      // 임시 오디오 파일들 정리
      RNFS.readDir(RNFS.DocumentDirectoryPath)
        .then(files => {
          const tempAudioFiles = files.filter(file => 
            file.name.startsWith('temp_audio_') || 
            file.name.startsWith('story_audio_') ||
            file.name.startsWith('tts_audio_') ||
            file.name.startsWith('ws_audio_') ||
            file.name.startsWith('ws_binary_audio_')
          );
          tempAudioFiles.forEach(file => {
            RNFS.unlink(file.path).catch(console.warn);
          });
        })
        .catch(console.warn);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* 상단 회색 영역 + 홈으로 돌아가기 버튼 */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Main')}>
          <Text style={styles.homeBtnText}>홈으로 돌아가기</Text>
        </TouchableOpacity>
        {/* 챕터 표시 */}
        <View style={styles.chapterSection}>
          <Text style={styles.chapterText}>
            {storyChapters.length > 0 ? 
              `챕터 ${currentChapterIndex + 1} / ${storyChapters.length}` : 
              '챕터 1 / 1'
            }
          </Text>
          {currentChapterTitle && (
            <Text style={styles.chapterTitle}>{currentChapterTitle}</Text>
          )}
          {isPlaying && (
            <Text style={styles.playingIndicator}>🎵 재생 중...</Text>
          )}
        </View>
      </View>
      
      {/* 메인 이미지 + 텍스트 */}
      <ScrollView style={styles.contentSection} contentContainerStyle={styles.contentContainer}>
        <View style={styles.imageWrap}>
          {currentImage ? (
            <Image 
              source={{ uri: currentImage }} 
              style={styles.storyImage}
              onError={(error) => {
                console.warn('⚠️ 이미지 로드 실패:', error.nativeEvent.error);
              }}
            />
          ) : (
            <View style={[styles.storyImage, styles.placeholderImg]}>
              <Text style={styles.placeholderText}>이미지 로딩 중...</Text>
            </View>
          )}
        </View>
        
        <View style={styles.textSection}>
          {currentText ? (
            <ScrollView 
              style={styles.storyScroll} 
              contentContainerStyle={styles.storyContainer}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.storyText}>{currentText}</Text>
            </ScrollView>
          ) : (
            <Text style={styles.storyText}>동화 내용을 불러오는 중...</Text>
          )}
        </View>
      </ScrollView>
      
      {/* 하단 회색 영역 + 좌우 화살표 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.arrowBtn, currentChapterIndex === 0 && styles.arrowBtnDisabled]}
          onPress={goToPreviousChapter}
          disabled={currentChapterIndex === 0}
        >
          <Image 
            source={ArrowImg} 
            style={[
              { width: 64, height: 64, transform: [{ rotate: '180deg' }], resizeMode: 'contain' },
              currentChapterIndex === 0 && styles.arrowDisabled
            ]} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.arrowBtn, 
            storyChapters.length > 0 && 
            currentChapterIndex >= storyChapters.length - 1 && 
            styles.arrowBtnDisabled
          ]}
          onPress={goToNextChapter}
          disabled={
            storyChapters.length > 0 && 
            currentChapterIndex >= storyChapters.length - 1
          }
        >
          <Image 
            source={ArrowImg} 
            style={[
              { width: 64, height: 64, transform: [{ rotate: '0deg' }], resizeMode: 'contain' },
              storyChapters.length > 0 && 
              currentChapterIndex >= storyChapters.length - 1 && 
              styles.arrowDisabled
            ]} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F6',
    justifyContent: 'space-between',
  },
  topBar: {
    backgroundColor: '#fff',
    paddingTop: 18,
    paddingBottom: 12,
    alignItems: 'center',
  },
  homeBtn: {
    backgroundColor: '#FEF8E4',
    borderColor: '#46613B',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 8,
  },
  homeBtnText: {
    color: '#46613B',
    fontWeight: 'bold',
    fontSize: 18,
  },
  chapterSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  chapterText: {
    fontSize: 18,
    color: '#46613B',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chapterTitle: {
    fontSize: 16,
    color: '#2D4A1F',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  playingIndicator: {
    fontSize: 14,
    color: '#9ACA70',
    fontWeight: '600',
  },
  contentSection: {
    flex: 1,
    backgroundColor: '#F7F8F6',
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
  },
  imageWrap: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  storyImage: {
    width: 300,
    height: 300,
    borderRadius: 20,
    backgroundColor: '#eee',
    resizeMode: 'cover', // 이미지를 잘라서 정사각형에 맞춤
  },
  placeholderImg: {
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
  },
  textSection: {
    marginTop: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  storyText: {
    fontSize: 18,
    color: '#222',
    lineHeight: 28,
    textAlign: 'left',
    fontWeight: '400',
    paddingHorizontal: 10,
  },
  storyScroll: {
    maxHeight: 300,
    width: '100%',
  },
  storyContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  conversationScroll: {
    maxHeight: 300,
    width: '100%',
  },
  conversationContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  conversationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#46613B',
    textAlign: 'center',
    marginBottom: 16,
  },
  conversationItem: {
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 12,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: '#9ACA70',
  },
  userLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#46613B',
    marginBottom: 4,
  },
  userText: {
    fontSize: 16,
    color: '#222',
    lineHeight: 22,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 12,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: '#87CEEB',
  },
  aiLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4682B4',
    marginBottom: 4,
  },
  aiText: {
    fontSize: 16,
    color: '#222',
    lineHeight: 22,
  },
  bottomBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 10,
  },
  arrowBtn: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    flexDirection: 'row',
  },
  arrowBtnDisabled: {
    opacity: 0.3,
  },
  arrowDisabled: {
    opacity: 0.3,
  },
  arrowIcon: {
    fontSize: 32,
    color: '#24704F',
    fontWeight: 'bold',
    lineHeight: 38,
  },
});