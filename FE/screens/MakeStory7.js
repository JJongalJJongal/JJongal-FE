// StoryDetailScreen.js (JS 부분만 교체; styles는 그대로 유지)
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  StatusBar,
  Alert,
} from 'react-native';

// ⬇️ 오디오 재생 & 임시 파일 저장(서명 URL/베이스64 모두 지원)
import RNFS from 'react-native-fs';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

// ⬇️ 프로젝트 유틸/상수 경로에 맞게 조정
// import { API } from '../constants';               // 예: API.BASE_URL
// import { fetchJwtToken } from '../utils/getJwtToken';

const { width, height } = Dimensions.get('window');

export default function StoryDetailScreen({ navigation, route }) {
  // ─────────────────────────────────────────────────────────────
  // 1) 화면 상태
  // ─────────────────────────────────────────────────────────────
  const [aiName, setAiName] = useState(route.params?.aiName || '쫑이');
  const [currentPage, setCurrentPage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 로딩/에러 상태
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // 서버에서 받은 동화 데이터 (챕터 배열)
  // chapter: { id, title, content(string), image(File), audio(File) }
  const [chapters, setChapters] = useState([]);

  // 오디오 재생기/임시 파일 경로
  const playerRef = useRef(new AudioRecorderPlayer());
  const tempPathRef = useRef(null);

  // ─────────────────────────────────────────────────────────────
  // 2) 정적 더미 데이터는 전부 주석처리 (요청사항)
  // ─────────────────────────────────────────────────────────────
  // const storyPages = [ ... 기존 더미 ... ];  // ❌ 사용 안 함 (주석 처리)

  // ─────────────────────────────────────────────────────────────
  // 3) 챕터 가공: content(string)을 줄 단위 배열로
  // ─────────────────────────────────────────────────────────────
  const pageList = useMemo(() => {
    return (chapters || []).map((ch) => {
      // content가 문자열이면 \n 기준으로 분리
      const lines = typeof ch?.content === 'string'
        ? ch.content.split(/\r?\n/).filter(Boolean)
        : Array.isArray(ch?.content) ? ch.content : [];

      // 이미지/오디오 File Object는 그대로 보존 (url 또는 base64)
      return {
        id: ch?.id,
        title: ch?.title || '',
        contentLines: lines,
        image: ch?.image || null,   // { object:"file", url, expiry_time, ... }
        audio: ch?.audio || null,   // { object:"file", url or base64, ... }
      };
    });
  }, [chapters]);

  const totalPages = pageList.length;
  const currentStoryPage = pageList[currentPage];

  // ─────────────────────────────────────────────────────────────
  // 4) 서버에서 데이터 가져오기
  // - 우선순위: (A) route.params.story OR storyPages → 그대로 사용
  //            (B) route.params.storyId → /api/v1/stories/{id} GET
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const useFromParamsIfExists = async () => {
      // A-1) 이미 전 화면에서 잘려진 챕터 배열을 넘겨준 경우
      if (Array.isArray(route?.params?.storyPages) && route.params.storyPages.length > 0) {
        if (!mounted) return;
        setChapters(route.params.storyPages);
        setIsLoading(false);
        return true;
      }

      // A-2) Story 객체 전체를 넘겨준 경우: story.chapters 사용
      if (route?.params?.story?.chapters && Array.isArray(route.params.story.chapters)) {
        if (!mounted) return;
        setChapters(route.params.story.chapters);
        setIsLoading(false);
        return true;
      }

      return false;
    };

    const fetchByIdIfNeeded = async () => {
      const storyId = route?.params?.storyId;
      if (!storyId) {
        // 뭘 받지도 못했는데 ID도 없는 경우 → 에러
        if (!mounted) return;
        setLoadError('동화 데이터를 찾을 수 없어요.');
        setIsLoading(false);
        return;
      }

      try {
        // 임시로 더미 데이터 사용 (실제 구현 시 API 호출)
        const dummyChapters = [
          {
            id: '1',
            title: '정우와 시금치 요정의 만남',
            content: '오늘 점심, 정우는 시금치가 정말 먹기 싫었어요.\n초록색 나물은 왠지 맛이 없을 것만 같았죠.\n"에이, 안 먹어!"\n정우는 젓가락으로 시금치를 식판 구석으로 밀어냈어요.\n바로 그때, 시금치 속에서 초록빛이 반짝이며 작은 요정이 뿅 나타났어요!',
            image: null,
            audio: null
          },
          {
            id: '2',
            title: '슈퍼 파워의 비밀',
            content: '깜짝 놀란 정우에게 요정이 귀엽게 윙크하며 말했어요.\n"안녕? 난 슈퍼 파워 요정, \'초록이\'야!"\n요정은 정우의 귓가에 작은 목소리로 속삭였어요.\n"날 먹으면, 누구보다 튼튼하고 빨라지는 비밀의 힘을 얻을 수 있어!"\n정우는 잠시 고민했지만, \'슈퍼 파워\'라는 말에 용기를 내기로 했어요.',
            image: null,
            audio: null
          },
          {
            id: '3',
            title: '정우의 슈퍼 파워',
            content: '정우는 눈을 꼭 감고 시금치를 한입에 꿀꺽 삼켰어요.\n그러자 정말 몸에서 힘이 불끈 솟는 기분이 들었어요!\n그날 오후, 정우는 놀이터에서 그 누구보다 빠르게 달리며 신나게 놀았답니다.\n"와, 정우 정말 빠르다!"\n친구들의 칭찬에 정우는 이제 시금치가 나오는 날이 기다려졌어요.',
            image: null,
            audio: null
          }
        ];
        
        if (!mounted) return;
        setChapters(dummyChapters);
        setIsLoading(false);
      } catch (e) {
        if (!mounted) return;
        setLoadError(e?.message || '동화를 불러오지 못했어요.');
        setIsLoading(false);
      }
    };

    (async () => {
      const ok = await useFromParamsIfExists();
      if (!ok) await fetchByIdIfNeeded();
    })();

    return () => { mounted = false; };
  }, [route?.params]);

  // ─────────────────────────────────────────────────────────────
  // 5) 오디오 재생/정지
  //  - File Object의 url(서명 URL) 우선, base64 있으면 임시 파일 재생
  // ─────────────────────────────────────────────────────────────
  const stopAudio = useCallback(async () => {
    try {
      await playerRef.current.stopPlayer();
      playerRef.current.removePlayBackListener();
    } catch {}
    setIsPlaying(false);
    if (tempPathRef.current) {
      RNFS.unlink(tempPathRef.current).catch(() => {});
      tempPathRef.current = null;
    }
  }, []);

  const playAudioForPage = useCallback(async (page) => {
    if (!page?.audio) return;
    await stopAudio();

    const audio = page.audio;
    try {
      // 1) URL(서명 URL) 재생
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

      // 2) base64 재생
      if (audio.base64) {
        const clean = audio.base64.replace(/^data:audio\/[^;]+;base64,/, '');
        const p = `${RNFS.DocumentDirectoryPath}/story_${Date.now()}.mp3`;
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
      setIsPlaying(false);
    }
  }, [stopAudio]);

  // 언마운트 시 오디오 정리
  useEffect(() => {
    return () => { stopAudio(); };
  }, [stopAudio]);

  // ─────────────────────────────────────────────────────────────
  // 6) 버튼/네비게이션 핸들러
  // ─────────────────────────────────────────────────────────────
  const togglePlayPause = async () => {
    if (!currentStoryPage?.audio) return;
    if (isPlaying) {
      await stopAudio();
      return;
    }
    await playAudioForPage(currentStoryPage);
  };

  const goToPreviousPage = async () => {
    if (currentPage > 0) {
      await stopAudio();
      setCurrentPage((p) => p - 1);
    }
  };

  const goToNextPage = async () => {
    if (currentPage < totalPages - 1) {
      await stopAudio();
      setCurrentPage((p) => p + 1);
    }
  };

  const handleGoHome = async () => {
    await stopAudio();
    navigation.navigate('Main');
  };

  // ─────────────────────────────────────────────────────────────
  // 7) 렌더 (기존 CSS 그대로 사용)
  //   - 삽화: page.image(File) → url 있으면 <Image source={{uri: url}} />
  //           (없는 경우 기존 예시 이미지를 fallback로 사용)
  // ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <ScrollView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />
        <View style={styles.titleBar}>
          <Text style={styles.titleText}>동화책</Text>
          <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
            <Image source={require('../assets/temp/icon_home.jpg')} style={styles.homeIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <View style={styles.mainContent}>
          <View style={styles.illustrationContainer}>
            <View style={styles.illustrationFrame}>
              <Image
                source={require('../assets/temp/ex1.png')}
                style={styles.illustrationImage}
                resizeMode="cover"
              />
            </View>
          </View>
          <View style={styles.textContainer}>
            <View style={styles.storyContent}>
              <Text style={styles.storyText}>동화를 불러오는 중이에요...</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (loadError) {
    return (
      <ScrollView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />
        <View style={styles.titleBar}>
          <Text style={styles.titleText}>동화책</Text>
          <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
            <Image source={require('../assets/temp/icon_home.jpg')} style={styles.homeIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <View style={styles.mainContent}>
          <View style={styles.textContainer}>
            <View style={styles.storyContent}>
              <Text style={styles.storyText}>{loadError}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />

      {/* 제목 바 */}
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>동화책</Text>
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Image
            source={require('../assets/temp/icon_home.jpg')}
            style={styles.homeIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 메인 콘텐츠 영역 */}
      <View style={styles.mainContent}>
        {/* 삽화 영역 */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationFrame}>
            {currentStoryPage?.image?.url ? (
              <Image
                source={{ uri: currentStoryPage.image.url }}
                style={styles.illustrationImage}
                resizeMode="cover"
              />
            ) : (
              <Image
                // 이미지가 없으면 기존 예시 이미지로 대체
                source={
                  currentPage % 3 === 0
                    ? require('../assets/temp/ex1.png')
                    : currentPage % 3 === 1
                    ? require('../assets/temp/ex2.png')
                    : require('../assets/temp/ex3.png')
                }
                style={styles.illustrationImage}
                resizeMode="cover"
              />
            )}
          </View>
        </View>

        {/* 텍스트 영역 */}
        <View style={styles.textContainer}>
          {/* 상단 정보 바 (오디오 컨트롤) */}
          <View style={styles.infoBar}>
            <View style={styles.audioControls}>
              <TouchableOpacity style={styles.audioButton} onPress={togglePlayPause}>
                <Image
                  source={
                    isPlaying
                      ? require('../assets/temp/icon_pause.jpg')
                      : require('../assets/temp/icon_play.jpg')
                  }
                  style={styles.audioIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* 동화 내용 */}
          <View style={styles.storyContent}>
            {currentStoryPage?.contentLines?.length
              ? currentStoryPage.contentLines.map((line, idx) => (
                  <Text key={idx} style={styles.storyText}>{line}</Text>
                ))
              : <Text style={styles.storyText}>내용이 아직 없어요.</Text>
            }
          </View>
        </View>
      </View>

      {/* 하단 페이지네이션 */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentPage === 0 && styles.navButtonDisabled]}
          onPress={goToPreviousPage}
          disabled={currentPage === 0}
        >
          <Image source={require('../assets/temp/icon_left.jpg')} style={styles.navIcon} resizeMode="contain" />
        </TouchableOpacity>

        <View style={styles.pageIndicator}>
          <Text style={styles.pageText}>
            {totalPages === 0 ? '-' : currentPage + 1} / {totalPages || '-'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.navButton, currentPage >= totalPages - 1 && styles.navButtonDisabled]}
          onPress={goToNextPage}
          disabled={currentPage >= totalPages - 1}
        >
          <Image source={require('../assets/temp/icon_right.jpg')} style={styles.navIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // 제목 바 스타일
  titleBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  
  // 삭제: backButton, backIcon 사용 안 함
  
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  
  homeButton: {
    padding: 10,
  },
  
  homeIcon: {
    width: 36,
    height: 36,
  },
  
  // 메인 콘텐츠 영역 스타일
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  // 삽화 영역 스타일
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  
  illustrationFrame: {
    width: width * 0.9,
    height: height * 0.4,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  
  // 텍스트 영역 스타일
  textContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginBottom: 20,
  },
  
  // 정보 바 스타일
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  characterName: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  
  characterNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  
  // 오디오 컨트롤 스타일
  audioControls: {
    flexDirection: 'row',
  },
  
  audioButton: {
    width: 35,
    height: 35,
    backgroundColor: '#fff',
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  
  audioIcon: {
    width: 20, // Adjust as needed for icon size
    height: 20, // Adjust as needed for icon size
  },
  
  // 동화 내용 스타일
  storyContent: {
    marginBottom: 10,
  },
  
  storyText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
    marginBottom: 8,
  },
  
  // 페이지네이션 스타일
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  
  navButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  
  navButtonDisabled: {
    opacity: 0.4,
  },
  
  navIcon: {
    width: 36,
    height: 36,
  },
  
  pageIndicator: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  
  pageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  
  // 제스처 네비게이션 바 스타일
  gestureBar: {
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
    alignSelf: 'center',
    width: 40,
    marginBottom: 20,
  },
}); 