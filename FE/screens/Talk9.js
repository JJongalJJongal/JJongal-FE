// StoryDetailScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function StoryDetailScreen({ navigation, route }) {
  // AI 이름 상태 (StoryCompleteScreen에서 전달받은 데이터)
  const [aiName, setAiName] = useState(route.params?.aiName || '쫑이');
  
  // 현재 페이지 상태
  const [currentPage, setCurrentPage] = useState(0);
  
  // 재생/정지 상태
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 동화 내용 (나중에 백엔드에서 받아올 데이터)
  const storyPages = [
    {
      id: 1,
      title: '정우와 시금치 요정의 만남',
      content: [
        '오늘 점심, 정우는 시금치가 정말 먹기 싫었어요.',
        '초록색 나물은 왠지 맛이 없을 것만 같았죠.',
        '"에이, 안 먹어!"',
        '정우는 젓가락으로 시금치를 식판 구석으로 밀어냈어요.',
        '바로 그때, 시금치 속에서 초록빛이 반짝이며 작은 요정이 뿅 나타났어요!'
      ],
      image: 'page1'
    },
    {
      id: 2,
      title: '슈퍼 파워의 비밀',
      content: [
        '깜짝 놀란 정우에게 요정이 귀엽게 윙크하며 말했어요.',
        '"안녕? 난 슈퍼 파워 요정, \'초록이\'야!"',
        '요정은 정우의 귓가에 작은 목소리로 속삭였어요.',
        '"날 먹으면, 누구보다 튼튼하고 빨라지는 비밀의 힘을 얻을 수 있어!"',
        '정우는 잠시 고민했지만, \'슈퍼 파워\'라는 말에 용기를 내기로 했어요.'
      ],
      image: 'page2'
    },
    {
      id: 3,
      title: '정우의 슈퍼 파워',
      content: [
        '정우는 눈을 꼭 감고 시금치를 한입에 꿀꺽 삼켰어요.',
        '그러자 정말 몸에서 힘이 불끈 솟는 기분이 들었어요!',
        '그날 오후, 정우는 놀이터에서 그 누구보다 빠르게 달리며 신나게 놀았답니다.',
        '"와, 정우 정말 빠르다!"',
        '친구들의 칭찬에 정우는 이제 시금치가 나오는 날이 기다려졌어요.'
      ],
      image: 'page3'
    }
  ];

  // 재생/정지 토글
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // 여기에 실제 오디오 재생/정지 로직 추가
  };

  // 이전 페이지로 이동
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const goToNextPage = () => {
    if (currentPage < storyPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 홈 버튼 클릭 시 메인화면으로 이동
  const handleGoHome = () => {
    navigation.navigate('Main');
  };

  const currentStoryPage = storyPages[currentPage];

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />
      {/* 제목 바 */}
      <View style={styles.titleBar}>
        {/* 뒤로가기 아이콘 제거 */}
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
            <Image
              source={
                currentPage === 0 ? require('../assets/temp/ex1.png') :
                currentPage === 1 ? require('../assets/temp/ex2.png') :
                require('../assets/temp/ex3.png')
              }
              style={styles.illustrationImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* 텍스트 영역 */}
        <View style={styles.textContainer}>
          {/* 상단 정보 바 */}
          <View style={styles.infoBar}>
            {/* 오디오 컨트롤 버튼들 */}
            <View style={styles.audioControls}>
              <TouchableOpacity 
                style={styles.audioButton} 
                onPress={togglePlayPause}
              >
                <Image 
                  source={isPlaying 
                    ? require('../assets/temp/icon_pause.jpg')
                    : require('../assets/temp/icon_play.jpg')
                  } 
                  style={styles.audioIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.audioButton}>
                <Image 
                  source={require('../assets/temp/icon_pause.jpg')} 
                  style={styles.audioIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* 동화 내용 */}
          <View style={styles.storyContent}>
            {currentStoryPage.content.map((line, index) => (
              <Text key={index} style={styles.storyText}>
                {line}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* 하단 페이지네이션 */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={[
            styles.navButton, 
            currentPage === 0 && styles.navButtonDisabled
          ]} 
          onPress={goToPreviousPage}
          disabled={currentPage === 0}
        >
          <Image 
            source={require('../assets/temp/icon_left.jpg')} 
            style={styles.navIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <View style={styles.pageIndicator}>
          <Text style={styles.pageText}>
            {currentPage + 1} / {storyPages.length}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.navButton, 
            currentPage === storyPages.length - 1 && styles.navButtonDisabled
          ]} 
          onPress={goToNextPage}
          disabled={currentPage === storyPages.length - 1}
        >
          <Image 
            source={require('../assets/temp/icon_right.jpg')} 
            style={styles.navIcon}
            resizeMode="contain"
          />
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