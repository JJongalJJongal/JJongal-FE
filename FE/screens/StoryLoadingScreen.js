// StoryLoadingScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function StoryLoadingScreen({ navigation, route }) {
  // 진행률 상태 (나중에 백엔드에서 받아올 데이터)
  const [progress, setProgress] = useState(0);
  
  // 현재 단계 상태 (나중에 백엔드에서 받아올 데이터)
  const [currentStep, setCurrentStep] = useState(1);
  
  // AI 이름 상태 (AITalkScreen에서 전달받은 데이터)
  const [aiName, setAiName] = useState(route.params?.aiName || '쫑이');

  // 진행률 애니메이션 (임시)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // 진행률이 100%가 되면 동화 완성 화면으로 이동
          setTimeout(() => {
            navigation.navigate('StoryComplete', {
              aiName: aiName,
            });
          }, 1000); // 1초 후 이동
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [navigation, aiName]);

  // 진행률에 따른 단계 변경 (임시)
  useEffect(() => {
    if (progress >= 33 && progress < 66) {
      setCurrentStep(2);
    } else if (progress >= 66) {
      setCurrentStep(3);
    }
  }, [progress]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />
      
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>9:41</Text>
          <Text style={styles.triangleIcon}>▲</Text>
        </View>
        
        <View style={styles.titleContainer}>
          <View style={styles.dynamicIsland} />
          <Text style={styles.titleText}>동화책 만들기</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <Text style={styles.signalIcon}>📶</Text>
          <Text style={styles.wifiIcon}>📶</Text>
          <Text style={styles.batteryText}>78+</Text>
        </View>
        
        <TouchableOpacity style={styles.homeButton}>
          <Text style={styles.homeIcon}>🏠</Text>
        </TouchableOpacity>
      </View>

      {/* 진행 바 영역 */}
      <View style={styles.progressSection}>
        <Text style={styles.progressTitle}>동화책 만들기 (이야기)</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
            <View style={styles.progressChick}>
              <Text style={styles.chickEmoji}>🐤</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 메인 콘텐츠 영역 */}
      <View style={styles.mainContent}>
        {/* AI 캐릭터 이미지 (임시로 색상 블록) */}
        <View style={styles.characterContainer}>
          <View style={styles.characterImage}>
            <Text style={styles.characterText}>AI 캐릭터 이미지</Text>
            <Text style={styles.characterSubtext}>이미지 영역</Text>
          </View>
        </View>
        
        {/* 페이지네이션/진행 표시 */}
        <View style={styles.paginationContainer}>
          <View style={[styles.paginationDot, currentStep >= 1 && styles.paginationDotActive]} />
          <View style={[styles.paginationDot, currentStep >= 2 && styles.paginationDotActive]} />
          <View style={[styles.paginationDot, currentStep >= 3 && styles.paginationDotActive]} />
        </View>
        
        {/* AI 메시지 */}
        <Text style={styles.aiMessage}>
          {aiName}가 그림을 그리는 중...
        </Text>
      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // 상단 헤더 스타일
  header: {
    backgroundColor: '#FFF1A1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  
  triangleIcon: {
    fontSize: 12,
    marginLeft: 5,
    color: '#000',
  },
  
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  dynamicIsland: {
    width: 120,
    height: 30,
    backgroundColor: '#000',
    borderRadius: 15,
    marginRight: 10,
  },
  
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  signalIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  
  wifiIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  
  batteryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  
  homeButton: {
    padding: 5,
  },
  
  homeIcon: {
    fontSize: 20,
  },
  
  // 진행 바 영역 스타일
  progressSection: {
    backgroundColor: '#FFED84',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 15,
    opacity: 0.8,
  },
  
  progressBarContainer: {
    position: 'relative',
  },
  
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    position: 'relative',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: '#FFF1A1',
    borderRadius: 4,
    transition: 'width 0.1s ease',
  },
  
  progressChick: {
    position: 'absolute',
    top: -6,
    left: 0,
    transform: [{ translateX: -10 }],
  },
  
  chickEmoji: {
    fontSize: 20,
  },
  
  // 메인 콘텐츠 영역 스타일
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  
  characterContainer: {
    marginBottom: 30,
  },
  
  characterImage: {
    width: width * 0.7,
    height: height * 0.4,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFED84',
  },
  
  characterText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  
  characterSubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  
  // 페이지네이션 스타일
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  paginationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 6,
  },
  
  paginationDotActive: {
    backgroundColor: '#FFD700',
  },
  
  // AI 메시지 스타일
  aiMessage: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // 하단 제스처 바 스타일
  gestureBar: {
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
    alignSelf: 'center',
    width: 40,
    marginBottom: 20,
  },
}); 