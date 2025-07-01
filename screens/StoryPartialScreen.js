// screens/PartialScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { API } from '../constants';
import { fetchJwtToken } from '../utils/getJwtToken';
import RNFS from 'react-native-fs';

const images = [
  require('../assets/partial-1.png'),
  require('../assets/partial-2.png'),
  require('../assets/partial-3.png'),
  require('../assets/partial-4.png'),
  require('../assets/partial-5.png'),
];

const StoryPartialScreen = ({ navigation, route }) => {
  const { storyId: routeStoryId, jwtToken: routeJwtToken, childProfile } = route.params || {};
  const [imgIdx, setImgIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completionProgress, setCompletionProgress] = useState(0);
  const [statusText, setStatusText] = useState('동화 생성을 시작하고 있어요...');
  const [downloadedFiles, setDownloadedFiles] = useState(null);
  const [storyId, setStoryId] = useState(routeStoryId);
  const [jwtToken, setJwtToken] = useState(routeJwtToken);

  useEffect(() => {
    if (!loading) {
      setImgIdx(images.length - 1); // partial-5로 고정
      return;
    }
    const interval = setInterval(() => {
      setImgIdx(prev => (prev + 1) % images.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  // 동화 생성 프로세스 시작
  useEffect(() => {
    const initializeStoryGeneration = async () => {
      try {
        // 1. JWT 토큰이 없으면 가져오기
        if (!jwtToken) {
          console.log('🔑 JWT 토큰 가져오는 중...');
          setStatusText('인증 토큰을 가져오는 중...');
          const token = await fetchJwtToken();
          setJwtToken(token);
          
          if (token === 'development_token') {
            // 개발 모드에서는 5초 후 임시로 완성 처리
            setStatusText('개발 모드 - 임시 동화 생성 중...');
            const timer = setTimeout(() => {
              setLoading(false);
              setCompletionProgress(100);
              setStatusText('동화가 완성되었어요!');
            }, 5000);
            return;
          }
        }

        // 2. storyId가 없으면 동화 생성 API 호출
        if (!storyId && jwtToken && jwtToken !== 'development_token') {
          console.log('📚 동화 생성 API 호출 중...');
          setStatusText('부기가 그림을 그리는 중...');
          
          // 🔧 연령에 맞는 age_group 계산
          const age = childProfile?.age || 7;
          let ageGroupValue;
          if (age <= 5) {
            ageGroupValue = 'PRESCHOOL';
          } else if (age <= 8) {
            ageGroupValue = 'EARLY_ELEMENTARY';  
          } else if (age <= 11) {
            ageGroupValue = 'LATE_ELEMENTARY';
          } else {
            ageGroupValue = 'MIDDLE_SCHOOL';
          }
          
          const apiUrl = `${API.BASE_URL}/api/v1/stories`;
          const requestBody = {
            child_profile: {
              name: childProfile?.name || '상아',
              age: age,
              age_group: ageGroupValue, // 서버 enum과 호환되는 값 사용
              interests: childProfile?.interests || ['공룡', '로봇'],
              language_level: childProfile?.language_level || 'basic'
            }
          };
          
          console.log('🔍 API 요청 상세 정보:');
          console.log('  URL:', apiUrl);
          console.log('  Method: POST');
          console.log('  Headers: Content-Type, Authorization');
          console.log('  Body:', JSON.stringify(requestBody, null, 2));
          console.log('  JWT Token:', jwtToken ? `${jwtToken.substring(0, 30)}...` : 'None');
          console.log('  연령 그룹 매핑:', `${age}세 → ${ageGroupValue}`);
          
          let response;
          let newStoryId = null;
          let actualUuid = null;
          
          try {
            response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
              },
              body: JSON.stringify(requestBody)
            });
          } catch (fetchError) {
            console.error('❌ 네트워크 연결 실패:', fetchError);
            throw new Error(`네트워크 연결 실패: ${fetchError.message}. 인터넷 연결을 확인해주세요.`);
          }

          console.log('📊 API 응답 상태:', response.status, response.statusText);
          console.log('📊 응답 헤더:', Object.fromEntries(response.headers.entries()));
          
          if (!response.ok) {
            let errorText;
            try {
              errorText = await response.text();
              console.error('❌ API 에러 응답 상세:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                body: errorText,
                url: apiUrl
              });
            } catch (parseError) {
              errorText = `응답 파싱 실패: ${parseError.message}`;
            }
            
            // 🔄 스토리 생성 실패 시 기존 스토리 목록에서 가져오기 시도
            console.log('🔄 스토리 생성 실패로 기존 스토리 목록 조회 시도...');
            setStatusText('기존 동화를 찾고 있어요...');
            
            try {
              const storiesListResponse = await fetch(`${API.BASE_URL}/api/v1/stories`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${jwtToken}`
                }
              });
              
              if (storiesListResponse.ok) {
                const storiesList = await storiesListResponse.json();
                console.log('📚 기존 스토리 목록:', storiesList);
                
                if (storiesList.success && storiesList.data && storiesList.data.length > 0) {
                  // 가장 최근 스토리 선택
                  const latestStory = storiesList.data[0];
                  const fallbackStoryId = latestStory.story_id || latestStory.id || latestStory.uuid;
                  const fallbackUuid = latestStory.uuid_story_id || latestStory.actual_uuid;
                  
                  console.log('✅ 기존 스토리 발견:', {
                    title: latestStory.title,
                    storyId: fallbackStoryId,
                    uuid: fallbackUuid,
                    status: latestStory.status
                  });
                  
                  newStoryId = fallbackStoryId;
                  actualUuid = fallbackUuid;
                  setStatusText('기존 동화를 불러왔어요!');
                } else {
                  console.warn('⚠️ 기존 스토리 목록이 비어있음');
                }
              }
            } catch (fallbackError) {
              console.warn('⚠️ 기존 스토리 목록 조회도 실패:', fallbackError);
            }
            
            // 대안도 실패했으면 에러 발생
            if (!newStoryId) {
              // 🔍 특정 에러 코드별 처리
              if (response.status === 404) {
                throw new Error(`API 엔드포인트를 찾을 수 없습니다. URL을 확인해주세요: ${apiUrl}`);
              } else if (response.status === 401) {
                throw new Error(`인증 실패. JWT 토큰을 확인해주세요: ${jwtToken?.substring(0, 20)}...`);
              } else if (response.status === 400) {
                throw new Error(`잘못된 요청. 요청 데이터를 확인해주세요: ${errorText}`);
              } else if (response.status >= 500) {
                throw new Error(`서버 오류 (${response.status}). 나중에 다시 시도해주세요: ${errorText}`);
              } else {
                throw new Error(`API 호출 실패 (${response.status}): ${errorText}`);
              }
            }
          } else {
            // 성공적인 응답 처리
            const data = await response.json();
            console.log('✅ API 응답 전체 데이터:', JSON.stringify(data, null, 2));
            
            // 🔍 다양한 경로로 스토리 ID 추출 시도
            newStoryId = data.data?.story_id || 
                        data.story_id || 
                        data.data?.id ||
                        data.id ||
                        data.data?.uuid ||
                        data.uuid;
            
            actualUuid = data.data?.actual_uuid || 
                        data.actual_uuid ||
                        data.data?.uuid_story_id ||
                        data.uuid_story_id;
            
            console.log('🔍 추출된 ID 정보:', {
              newStoryId,
              actualUuid,
              '원본 data 구조': Object.keys(data),
              'data.data 구조': data.data ? Object.keys(data.data) : 'null'
            });
            
            if (!newStoryId) {
              console.error('❌ 스토리 ID 추출 실패:', {
                '응답 전체': data,
                '시도한 경로들': [
                  'data.data?.story_id', 
                  'data.story_id', 
                  'data.data?.id',
                  'data.id',
                  'data.data?.uuid',
                  'data.uuid'
                ]
              });
              throw new Error(`스토리 ID를 받지 못했습니다. 응답 구조: ${JSON.stringify(data, null, 2)}`);
            }
          }

          if (newStoryId) {
            console.log('✅ 동화 생성 시작됨, 스토리 ID:', newStoryId);
            console.log('📍 실제 UUID:', actualUuid);
            
            // 실제 UUID가 있으면 그것을 사용, 없으면 기존 ID 사용
            const finalStoryId = actualUuid || newStoryId;
            setStoryId(finalStoryId);
            console.log('🎯 최종 사용할 스토리 ID:', finalStoryId);
            setStatusText('부기가 창작을 시작했어요!');
          }
        }

        // 3. storyId가 있으면 폴링 시작
        if (storyId && jwtToken && jwtToken !== 'development_token') {
          console.log('📊 동화 완성 상태 폴링 시작, 스토리 ID:', storyId);
          setStatusText('부기가 열심히 작업하고 있어요...');
          checkStoryCompletion();
        }

      } catch (error) {
        console.error('❌ 동화 생성 초기화 실패:', error);
        console.error('❌ 에러 상세 정보:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
          jwtToken: jwtToken ? `${jwtToken.substring(0, 20)}...` : 'None',
          storyId,
          childProfile,
          apiUrl: `${API.BASE_URL}/api/v1/stories`
        });
        
        // 🔍 서버 AgeGroup.from_age 에러 특별 처리
        if (error.message.includes('from_age') || 
            error.message.includes('AgeGroup') ||
            error.message.includes('AttributeError')) {
          console.log('🔧 서버 AgeGroup 에러 감지, 기존 스토리 찾기 재시도...');
          setStatusText('서버 설정을 확인하고 있어요...');
          
          try {
            // 기존 스토리 목록에서 가져오기 재시도
            const storiesListResponse = await fetch(`${API.BASE_URL}/api/v1/stories`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${jwtToken}`
              }
            });
            
            if (storiesListResponse.ok) {
              const storiesList = await storiesListResponse.json();
              if (storiesList.success && storiesList.data && storiesList.data.length > 0) {
                const latestStory = storiesList.data[0];
                const fallbackStoryId = latestStory.story_id || latestStory.id || latestStory.uuid;
                const fallbackUuid = latestStory.uuid_story_id || latestStory.actual_uuid;
                
                if (fallbackStoryId) {
                  console.log('✅ AgeGroup 에러 후 기존 스토리 발견:', fallbackStoryId);
                  const finalId = fallbackUuid || fallbackStoryId;
                  setStoryId(finalId);
                  setStatusText('기존 동화를 불러왔어요!');
                  // 폴링 시작
                  setTimeout(() => checkStoryCompletion(), 1000);
                  return;
                }
              }
            }
          } catch (retryError) {
            console.warn('⚠️ 재시도도 실패:', retryError);
          }
        }
        
        // 🔍 에러 타입별 사용자 메시지
        let userMessage = '동화 생성에 실패했습니다.';
        if (error.message.includes('네트워크')) {
          userMessage = '네트워크 연결을 확인해주세요.';
        } else if (error.message.includes('404')) {
          userMessage = 'API 서버에 연결할 수 없습니다.';
        } else if (error.message.includes('401')) {
          userMessage = '인증에 실패했습니다. 다시 로그인해주세요.';
        } else if (error.message.includes('스토리 ID를 받지 못했습니다')) {
          userMessage = '서버 응답에 문제가 있습니다. 잠시 후 다시 시도해주세요.';
        } else if (error.message.includes('from_age') || error.message.includes('AgeGroup')) {
          userMessage = '서버 설정에 문제가 있습니다. 개발자에게 문의해주세요.';
        }
        
        setStatusText(userMessage);
        Alert.alert('알림', `${userMessage}\n\n기술적 오류: ${error.message}`);
      }
    };

    initializeStoryGeneration();
  }, [storyId, jwtToken, childProfile]);

  const checkStoryCompletion = async () => {
    try {
      // 동화 상태 확인 API 사용
      const response = await fetch(`${API.BASE_URL}/api/v1/stories/${storyId}/status`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      if (response.status === 404) {
        // 404는 서버에서 아직 스토리가 준비되지 않았을 수 있음 - 계속 대기
        console.log('⏳ 스토리가 아직 준비되지 않음 (404) - 계속 대기 중...');
        setStatusText('부기가 마법을 준비하고 있어요...');
        setTimeout(() => checkStoryCompletion(), 3000); // 3초로 단축
        return;
      }

      if (!response.ok) {
        // 404가 아닌 다른 에러는 일시적일 수 있으니 계속 시도
        console.warn(`⚠️ API 응답 에러 ${response.status} - 계속 시도 중...`);
        setStatusText('연결을 다시 시도하고 있어요...');
        setTimeout(() => checkStoryCompletion(), 3000);
        return;
      }

      const statusData = await response.json();
      console.log('📊 상태 조회 응답 전체:', JSON.stringify(statusData, null, 2));
      
      const progress = statusData.data?.completion_percentage || 0;
      const currentStage = statusData.data?.current_stage || '준비 중';
      
      if (statusData.success && currentStage === 'completion') {
        // 🎉 동화 완성! 전체 동화 데이터 조회
        console.log('🎉 동화 완성! current_stage가 completion으로 완료됨!');
        console.log('📍 상태 데이터 구조:', statusData.data);
        console.log('📍 UUID 추출 시도 1:', statusData.data?.uuid_story_id);
        console.log('📍 UUID 추출 시도 2:', statusData.data?.story_data?.metadata?.story_id);
        console.log('📍 UUID 추출 시도 3:', statusData.uuid_story_id);
        
        setCompletionProgress(100);
        setStatusText('동화가 완성되었어요! 데이터를 가져오는 중...');
        
        // 여러 방법으로 UUID 추출 시도
        const actualUuid = statusData.data?.uuid_story_id || 
                           statusData.data?.story_data?.metadata?.story_id ||
                           statusData.uuid_story_id;
        const queryId = actualUuid || storyId;
        console.log('🎯 최종 추출된 UUID:', actualUuid);
        console.log('🎯 데이터 조회에 사용할 ID:', queryId);
        
        await fetchCompletedStory(queryId);
        
      } else {
        // 아직 진행중, 진행률 업데이트하고 3초 후 재체크
        setCompletionProgress(progress);
        
        // 다양한 메시지를 순환하도록 설정 (퍼센트 완전 제거)
        const messages = [
          '부기가 그림을 그리는 중...',
          '캐릭터 디자인을 만들고 있어요...',
          '스토리를 작성하고 있어요...',
          '아름다운 배경을 그리는 중...',
          '마법같은 이야기를 만들어가고 있어요...',
          '부기가 열심히 창작 중이에요...',
          '동화 속 세상을 만드는 중...',
          '캐릭터들이 움직이기 시작해요...'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        // 퍼센트나 단계 정보 없이 순수 메시지만 설정
        setStatusText(randomMessage);
        
        console.log(`📊 진행률: ${progress}% - 단계: ${currentStage}`);
        
        setTimeout(() => checkStoryCompletion(), 3000);
      }
      
    } catch (error) {
      // 네트워크 에러 등도 일시적일 수 있으니 계속 시도
      console.warn('⚠️ 네트워크 에러 발생 - 계속 시도 중:', error.message);
      setStatusText('연결을 다시 시도하고 있어요...');
      setTimeout(() => checkStoryCompletion(), 3000);
    }
  };

  const fetchCompletedStory = async (queryStoryId = storyId) => {
    try {
      console.log('📖 동화 데이터 조회 시작');
      console.log('🎯 기본 스토리 ID:', queryStoryId);
      console.log('🔑 사용 토큰:', jwtToken?.substring(0, 20) + '...');
      
      // 🔄 여러 ID 형태로 시도할 목록 생성
      const possibleIds = [];
      
      // 1. 기본 queryStoryId
      if (queryStoryId) {
        possibleIds.push(queryStoryId);
      }
      
      // 2. story_상아_ 접두사가 없으면 추가
      if (queryStoryId && !queryStoryId.includes('story_')) {
        possibleIds.push(`story_상아_${queryStoryId}`);
      }
      
      // 3. story_상아_ 접두사가 있으면 제거
      if (queryStoryId && queryStoryId.includes('story_상아_')) {
        const cleanId = queryStoryId.replace('story_상아_', '');
        possibleIds.push(cleanId);
      }
      
      // 4. 기본 storyId도 추가 (다를 경우)
      if (storyId && storyId !== queryStoryId) {
        possibleIds.push(storyId);
        if (!storyId.includes('story_')) {
          possibleIds.push(`story_상아_${storyId}`);
        }
      }
      
      // 중복 제거
      const uniqueIds = [...new Set(possibleIds)];
      console.log('🔍 시도할 ID 목록:', uniqueIds);
      
      let lastError = null;
      
      // 🔄 각 ID로 순차적으로 시도
      for (let i = 0; i < uniqueIds.length; i++) {
        const currentId = uniqueIds[i];
        const apiUrl = `${API.BASE_URL}/api/v1/stories/${currentId}`;
        
        console.log(`📞 API 호출 ${i + 1}/${uniqueIds.length}:`, apiUrl);
        
        try {
          const response = await fetch(apiUrl, {
            headers: {
              'Authorization': `Bearer ${jwtToken}`
            }
          });

          console.log(`📊 응답 상태 (${currentId}):`, response.status);

          if (response.ok) {
            const result = await response.json();
            console.log('✅ API 응답 성공:', result);
            
            if (result.success) {
              const story = result.data;
              console.log('📖 동화 데이터 조회 완료:', story.metadata?.title);
              console.log('📊 챕터 수:', story.generated_story?.chapters?.length);
              console.log('🎬 멀티미디어 파일들:', story.multimedia_assets);
              
              setDownloadedFiles(story);
              setLoading(false);
              setStatusText('동화가 완성되었어요!');
              return; // 성공했으므로 루프 종료
              
            } else {
              console.warn(`⚠️ API 응답 success가 false (${currentId}):`, result);
              lastError = new Error(`동화 데이터 조회 실패: ${result.message || '알 수 없는 오류'}`);
            }
          } else if (response.status === 404) {
            console.log(`⏳ 스토리 없음 (${currentId}) - 다음 ID 시도...`);
            lastError = new Error(`스토리를 찾을 수 없음: ${currentId}`);
          } else {
            const errorText = await response.text();
            console.warn(`❌ API 에러 (${currentId}):`, response.status, errorText);
            lastError = new Error(`API 호출 실패 (${response.status}): ${errorText}`);
          }
        } catch (fetchError) {
          console.error(`❌ 네트워크 에러 (${currentId}):`, fetchError);
          lastError = fetchError;
        }
      }
      
      // 모든 ID로 시도했지만 실패
      console.error('❌ 모든 ID로 시도했지만 동화 데이터 조회 실패');
      console.error('❌ 마지막 에러:', lastError);
      
      // 🔄 대안: 스토리 목록에서 가장 최근 완성된 스토리 찾기
      console.log('🔄 스토리 목록에서 최근 완성된 스토리 찾기 시도...');
      setStatusText('다른 동화를 찾고 있어요...');
      
      try {
        const storiesListResponse = await fetch(`${API.BASE_URL}/api/v1/stories`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          }
        });
        
        if (storiesListResponse.ok) {
          const storiesList = await storiesListResponse.json();
          console.log('📚 스토리 목록 조회 결과:', storiesList);
          
          if (storiesList.success && storiesList.data && storiesList.data.length > 0) {
            // 완성된 스토리 중 가장 최근 것 찾기
            const completedStories = storiesList.data.filter(story => 
              story.status === 'completed' || 
              story.current_stage === 'completion' ||
              story.completion_percentage >= 100
            );
            
            if (completedStories.length > 0) {
              const latestCompletedStory = completedStories[0];
              const fallbackStoryId = latestCompletedStory.story_id || 
                                    latestCompletedStory.id || 
                                    latestCompletedStory.uuid;
              
              console.log('✅ 완성된 대안 스토리 발견:', {
                title: latestCompletedStory.title,
                id: fallbackStoryId,
                status: latestCompletedStory.status
              });
              
              // 대안 스토리로 재귀 호출 (1회만)
              if (fallbackStoryId && fallbackStoryId !== queryStoryId) {
                console.log('🔄 대안 스토리로 재시도:', fallbackStoryId);
                await fetchCompletedStory(fallbackStoryId);
                return;
              }
            }
          }
        }
      } catch (listError) {
        console.warn('⚠️ 스토리 목록 조회도 실패:', listError);
      }
      
      // 모든 대안이 실패한 경우
      throw lastError || new Error('알 수 없는 오류로 동화를 가져올 수 없습니다.');
      
    } catch (error) {
      console.error('❌ 동화 데이터 조회 최종 실패:', error);
      console.error('❌ 에러 상세:', {
        message: error.message,
        stack: error.stack,
        storyId,
        queryStoryId,
        jwtToken: jwtToken?.substring(0, 20) + '...'
      });
      
      setStatusText('동화를 불러오는데 실패했어요...');
      Alert.alert('오류', `동화를 불러올 수 없습니다.\n\n${error.message}`);
    }
  };

  const handleComplete = () => {
    console.log('🎉 완료 버튼 클릭 - StorySuccess로 이동');
    navigation.navigate('StorySuccess', {
      storyId,
      storyData: downloadedFiles, // 전체 동화 데이터 전달
      completionProgress
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerImageWrap}>
        <Image source={images[imgIdx]} style={styles.centerImage} />
      </View>
      <Text style={styles.centerText}>{statusText}</Text>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleComplete}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? '대기중...' : '완료'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StoryPartialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f3c2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
  },
  centerImageWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  centerImage: {
    width: 220,
    height: 260,
    resizeMode: 'contain',
    marginTop: 40,
    marginBottom: 0,
  },
  centerText: {
    fontSize: 18,
    color: '#4B662B',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 100,
  },
  button: {
    backgroundColor: '#9ACA70',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 14,
    marginBottom: 70,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});