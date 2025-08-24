// StoryCompleteScreen.js
import React, { useState } from 'react';
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

export default function StoryCompleteScreen({ navigation, route }) {
  // AI 이름 상태 (StoryLoadingScreen에서 전달받은 데이터)
  const [aiName, setAiName] = useState(route.params?.aiName || '쫑이');

  // 보러가기 버튼 클릭 시 동화 상세페이지로 이동
  const handleViewStory = () => {
    // 동화 상세페이지로 이동
    navigation.navigate('StoryDetail', {
      aiName: aiName,
    });
  };

  // 메인화면 버튼 클릭 시 MainScreen으로 이동
  const handleGoToMain = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />
      
      {/* 상단 커스텀 상태바 제거됨 */}
 
      {/* 메인 콘텐츠 영역 (노란색 배경) */}
      <View style={styles.mainContent}>
        <Image 
          source={require('../assets/temp/s_complete.png')}
          style={styles.completeImage}
          resizeMode="cover"
        />
      </View>

      {/* 곡선 구분선 */}
      <View style={styles.curveContainer}>
        <View style={styles.curve} />
      </View>

      {/* 하단 버튼 영역 (흰색 배경) */}
      <View style={styles.bottomSection}>
        {/* 보러가기 버튼 */}
        <TouchableOpacity style={styles.viewButton} onPress={handleViewStory}>
          <Text style={styles.viewButtonText}>보러가기</Text>
        </TouchableOpacity>
        
        {/* 메인화면 버튼 */}
        <TouchableOpacity style={styles.mainButton} onPress={handleGoToMain}>
          <Text style={styles.mainButtonText}>메인화면</Text>
        </TouchableOpacity>
        
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFED84',
  },
  
  // 메인 콘텐츠 영역 스타일
  mainContent: {
    flex: 1,
    backgroundColor: '#FFED84',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  completeImage: {
    width: '100%',
    height: '100%',
    marginBottom: 10,
  },
  
  charactersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 40,
  },
  
  // 왼쪽 작은 병아리 스타일
  smallChick: {
    alignItems: 'center',
    position: 'relative',
  },
  
  chickBody: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF9C4',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  
  chickEmoji: {
    fontSize: 30,
  },
  
  cheek: {
    position: 'absolute',
    bottom: 10,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#FFB6C1',
    borderRadius: 4,
  },
  
  overalls: {
    position: 'absolute',
    bottom: -5,
    width: 50,
    height: 25,
    backgroundColor: '#90EE90',
    borderRadius: 12,
  },
  
  raisedArm: {
    position: 'absolute',
    top: 15,
    right: -10,
    width: 8,
    height: 20,
    backgroundColor: '#FFF9C4',
    borderRadius: 4,
    transform: [{ rotate: '-45deg' }],
  },
  
  // 오른쪽 큰 병아리 스타일
  bigChick: {
    alignItems: 'center',
    position: 'relative',
  },
  
  glasses: {
    position: 'absolute',
    top: 15,
    width: 20,
    height: 8,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
  },
  
  shirt: {
    position: 'absolute',
    bottom: 15,
    width: 45,
    height: 20,
    backgroundColor: '#87CEEB',
    borderRadius: 10,
  },
  
  pants: {
    position: 'absolute',
    bottom: -5,
    width: 50,
    height: 25,
    backgroundColor: '#90EE90',
    borderRadius: 12,
  },
  
  bookStack: {
    position: 'absolute',
    bottom: -15,
    left: -20,
  },
  
  book1: {
    width: 30,
    height: 8,
    backgroundColor: '#90EE90',
    borderRadius: 4,
    marginBottom: 2,
  },
  
  book2: {
    width: 30,
    height: 8,
    backgroundColor: '#87CEEB',
    borderRadius: 4,
  },
  
  openBook: {
    position: 'absolute',
    bottom: 5,
    right: -15,
    width: 25,
    height: 20,
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
  
  // 메시지 컨테이너 스타일
  messageContainer: {
    alignItems: 'center',
  },
  
  messageText1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  
  messageText2: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // 곡선 구분선 스타일
  curveContainer: {
    position: 'absolute',
    bottom: 170,
    left: 0,
    right: 0,
    height: 50,
    overflow: 'hidden',
  },
  
  curve: {
    position: 'absolute',
    bottom: 0,
    left: -50,
    right: -50,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  
  // 하단 버튼 영역 스타일
  bottomSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  
  // 보러가기 버튼 스타일
  viewButton: {
    backgroundColor: '#FFED84',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
  },
  
  viewButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  
  // 메인화면 버튼 스타일
  mainButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
  },
  
  mainButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  
  // 제스처 네비게이션 바 스타일
  gestureBar: {
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
    width: 40,
  },
}); 