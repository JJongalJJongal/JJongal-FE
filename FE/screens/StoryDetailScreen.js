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
      title: '루미와 아라의 만남',
      content: [
        '루미는 아라의 첫 친구가 되었다.',
        '둘은 금방 친해져 함께 다닌다.',
        '루미는 아라에게 학교를 소개한다.',
        '마법 도서관과 실험실이 있다.',
        '둘은 신난 마음으로 학교를 돌아다닌다.'
      ],
      image: 'page1'
    },
    {
      id: 2,
      title: '마법 도서관 탐험',
      content: [
        '도서관에는 신비로운 책들이 가득했다.',
        '아라는 처음 보는 마법책에 놀랐다.',
        '루미는 아라에게 마법의 세계를 설명한다.',
        '둘은 함께 마법 주문을 연습해본다.',
        '아라의 마법 실력이 점점 늘어간다.'
      ],
      image: 'page2'
    },
    {
      id: 3,
      title: '실험실에서의 모험',
      content: [
        '실험실에는 이상한 기계들이 있었다.',
        '루미는 아라에게 각 기계의 용도를 알려준다.',
        '둘은 함께 간단한 실험을 해본다.',
        '아라의 호기심이 계속 커진다.',
        '루미는 아라의 배움에 기뻐한다.'
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
    <View style={styles.container}>
      {/* 제목 바 */}
      <View style={styles.titleBar}>
        <TouchableOpacity style={styles.backButton}>
          <Image 
            source={require('../assets/temp/icon_back.jpg')} 
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
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
            <Text style={styles.illustrationText}>삽화 영역</Text>
            <Text style={styles.illustrationSubtext}>페이지 {currentPage + 1}</Text>
          </View>
        </View>

        {/* 텍스트 영역 */}
        <View style={styles.textContainer}>
          {/* 상단 정보 바 */}
          <View style={styles.infoBar}>
            <View style={styles.characterName}>
              <Text style={styles.characterNameText}>{aiName}</Text>
            </View>
            
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

      {/* 제스처 네비게이션 바 */}
      <View style={styles.gestureBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFED84',
  },
  
  // 제목 바 스타일
  titleBar: {
    backgroundColor: '#FFED84',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  
  backButton: {
    padding: 10,
  },
  
  backIcon: {
    width: 24,
    height: 24,
  },
  
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  
  homeButton: {
    padding: 10,
  },
  
  homeIcon: {
    width: 24,
    height: 24,
  },
  
  // 메인 콘텐츠 영역 스타일
  mainContent: {
    flex: 1,
    backgroundColor: '#FFED84',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  // 삽화 영역 스타일
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  
  illustrationFrame: {
    width: width * 0.8,
    height: height * 0.3,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  
  illustrationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  
  illustrationSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  
  // 텍스트 영역 스타일
  textContainer: {
    backgroundColor: '#FFED84',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginBottom: 20,
  },
  
  // 정보 바 스타일
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 16,
    color: '#000',
    lineHeight: 24,
    marginBottom: 8,
  },
  
  // 페이지네이션 스타일
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: '#FFED84',
    marginTop: 10,
  },
  
  navButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FFD700',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  
  navButtonDisabled: {
    backgroundColor: '#E0E0E0',
    borderColor: '#C0C0C0',
  },
  
  navIcon: {
    width: 20, // Adjust as needed for icon size
    height: 20, // Adjust as needed for icon size
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