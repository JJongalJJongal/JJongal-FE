// AITalkScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function AITalkScreen({ navigation, route }) {
  // AI 멘트 상태 (나중에 백엔드에서 받아올 데이터)
  const [aiMessage, setAiMessage] = useState('상아야, 이야기가 정말 재미있어!\n고양이와 강아지 사이에 무슨 일이 있었는지\n잘 설명해줬네.');
  
  // AI 이미지 상태 (나중에 백엔드에서 받아올 데이터)
  const [aiImage, setAiImage] = useState('library');
  
  // AI 이름 상태 (나중에 백엔드에서 받아올 데이터)
  const [aiName, setAiName] = useState('쫑이');
  
  // AI 멘트가 끝났는지 상태 (나중에 백엔드에서 받아올 데이터)
  const [isMessageComplete, setIsMessageComplete] = useState(false);
  
  // 재생/정지 상태
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 배경 이미지 배열
  const backgroundImages = [
    require('../assets/temp/bg1.jpg'),
    require('../assets/temp/bg2.jpg'),
    require('../assets/temp/bg3.jpg')
  ];
  
  // 현재 배경 이미지 (랜덤으로 선택)
  const [currentBackground, setCurrentBackground] = useState(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    return randomIndex;
  });
  
  // 임시 이미지 매핑 (나중에 실제 이미지로 교체)
  const imageMapping = {
    'library': { backgroundColor: '#F5F5DC', name: '도서관 배경' },
    'park': { backgroundColor: '#E6F3FF', name: '공원 배경' },
    'forest': { backgroundColor: '#E8F5E8', name: '숲 배경' },
    'space': { backgroundColor: '#F0F0FF', name: '우주 배경' },
  };

  // AI 멘트와 이미지를 동적으로 변경하는 함수 (나중에 백엔드 연동 시 사용)
  const updateAIContent = (newMessage, newImage, newName, messageComplete) => {
    setAiMessage(newMessage);
    setAiImage(newImage);
    setAiName(newName);
    setIsMessageComplete(messageComplete);
    
    // 배경 이미지도 랜덤으로 변경
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setCurrentBackground(randomIndex);
  };

  // 재생/정지 토글
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // 여기에 실제 오디오 재생/정지 로직 추가
  };

  // 다음 버튼 클릭 시 AI가 계속 말하도록
  const handleNext = () => {
    // 나중에 백엔드에서 다음 AI 멘트를 받아와서 화면 업데이트
    console.log('다음 버튼 클릭 - AI가 계속 말함');
    
    // 임시로 다음 멘트로 변경 (실제로는 백엔드에서 받아옴)
    setAiMessage('그럼, 고양이와 강아지 사이가 안좋아진 이후에\n어떤 일이 더 있었을까? 상아가 생각하는대로\n이야기해줄 수 있어?');
    setAiImage('park');
    setIsMessageComplete(true);
    
    // 배경 이미지도 랜덤으로 변경
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setCurrentBackground(randomIndex);
  };

  // 대답하기 버튼 클릭 시 사용자 대답 화면으로 이동
  const handleAnswer = () => {
    navigation.navigate('UserTalkScreen', {
      aiName: aiName,
      aiImage: aiImage,
      background: currentBackground,
    });
  };

  // 완성하기 버튼 클릭 시 동화 생성 화면으로 이동
  const handleComplete = () => {
    // 동화 생성 로딩 화면으로 이동
    navigation.navigate('Loading', {
      aiName: aiName,
      aiImage: aiImage,
      background: currentBackground,
    });
  };

  // 대화보기 버튼 클릭
  const handleViewConversation = () => {
    // 나중에 대화 기록 보기 기능 구현
    console.log('대화 기록 보기');
  };

  // 현재 선택된 이미지 정보
  const currentImage = imageMapping[aiImage] || imageMapping['library'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFED84" />
      
      {/* 배경 이미지 */}
      <Image 
        source={backgroundImages[currentBackground]} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>동화책 만들기</Text>
        <TouchableOpacity style={styles.homeButton}>
          <Image 
            source={require('../assets/temp/icon_home.jpg')} 
            style={styles.homeIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 메인 콘텐츠 영역 */}
      <View style={styles.mainContent}>
        {/* 배경 이미지 */}
        <Image 
          source={backgroundImages[currentBackground]} 
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        
        {/* 재생/정지 버튼들 */}
        <View style={styles.controlButtons}>
          <TouchableOpacity 
            style={styles.playButton} 
            onPress={togglePlayPause}
          >
            <Image 
              source={require('../assets/temp/icon_pause.jpg')} 
              style={styles.playIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.stopButton}>
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
          <Text style={styles.messageText}>{aiMessage}</Text>
        </View>
        
        {/* 액션 버튼들 */}
        {!isMessageComplete ? (
          // AI 멘트가 끝나지 않았을 때 - 다음 버튼만 표시
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>다음</Text>
          </TouchableOpacity>
        ) : (
          // AI 멘트가 끝났을 때 - 대답하기/완성하기 버튼 표시
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.answerButton} onPress={handleAnswer}>
              <Text style={styles.answerButtonText}>대답하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.completeButtonText}>완성하기</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* 제스처 네비게이션 바 */}
        <View style={styles.gestureBar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // 배경 이미지 스타일
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // 상단 헤더 스타일
  header: {
    backgroundColor: '#FFED84',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    zIndex: 2,
  },
  
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  
  homeButton: {
    padding: 8,
  },
  
  homeIcon: {
    width: 24,
    height: 24,
  },
  
  // 메인 콘텐츠 영역 스타일
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  
  // 배경 이미지 스타일
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  playIcon: {
    width: 20,
    height: 20,
  },
  
  stopButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  stopIcon: {
    width: 20,
    height: 20,
  },
  
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  conversationText: {
    fontSize: 14,
    color: '#000',
  },
  
  characterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  
  characterImage: {
    width: width * 0.7,
    height: height * 0.4,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFED84',
  },
  
  characterText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  
  characterSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  
  // 하단 대화 영역 스타일
  bottomSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  
  nameLabel: {
    backgroundColor: '#FFED84',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  nameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  
  dropdownIcon: {
    fontSize: 12,
    color: '#000',
  },
  
  messageContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 25,
    minHeight: 80,
  },
  
  messageText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24,
    textAlign: 'center',
  },
  
  // 다음 버튼 스타일
  nextButton: {
    backgroundColor: '#FFED84',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  
  // 액션 버튼들 스타일
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  
  answerButton: {
    backgroundColor: '#FFED84',
    borderRadius: 10,
    paddingVertical: 15,
    flex: 0.48,
    alignItems: 'center',
  },
  
  answerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  
  completeButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 15,
    flex: 0.48,
    alignItems: 'center',
  },
  
  completeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  
  gestureBar: {
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
    alignSelf: 'center',
    width: 40,
  },
}); 