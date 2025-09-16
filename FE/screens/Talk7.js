// LoadingScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function LoadingScreen({ navigation, route }) {
  const navigationHook = useNavigation();
  
  // 로딩 이미지 배열
  const loadingImages = [
    require('../assets/temp/loading1.jpg'),
    require('../assets/temp/loading2.jpg'),
    require('../assets/temp/loading3.jpg'),
    require('../assets/temp/loading4.jpg')
  ];
  
  // 현재 로딩 이미지 인덱스
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 로딩 진행률 (0-100)
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // 4초 동안 로딩 진행
    const totalDuration = 4000; // 4초
    const intervalDuration = 1000; // 1초마다 이미지 변경
    const progressIncrement = 100 / (totalDuration / 100); // 진행률 증가량
    
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          // 로딩 완료 후 Talk8로 이동
          setTimeout(() => {
            navigationHook.navigate('Talk8');
          }, 500);
          return 100;
        }
        return prev + progressIncrement;
      });
    }, 100);
    
    // 1초마다 이미지 변경
    const imageTimer = setInterval(() => {
      setCurrentImageIndex(prev => {
        if (prev >= loadingImages.length - 1) {
          return prev;
        }
        return prev + 1;
      });
    }, intervalDuration);
    
    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      clearInterval(progressTimer);
      clearInterval(imageTimer);
    };
  }, []);
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />
      
      {/* 상단 로딩바 */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progress}%` }
            ]} 
          />
        </View>
      </View>
      
      {/* 메인 콘텐츠 영역 */}
      <View style={styles.mainContent}>
        {/* 로딩 이미지 */}
        <Image 
          source={loadingImages[currentImageIndex]} 
          style={styles.loadingImage}
          resizeMode="contain"
        />
        
        {/* 로딩 점들 */}
        <View style={styles.loadingDots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        
        {/* 로딩 메시지 */}
        <Text style={styles.loadingText}>쫑이가 그림을 그리는 중...</Text>
      </View>
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // 상단 로딩바 스타일
  progressBarContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: '#666',
    borderRadius: 4,
  },
  
  // 메인 콘텐츠 영역 스타일
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  
  // 로딩 이미지 스타일
  loadingImage: {
    width: width * 0.8,
    height: height * 0.5,
    marginBottom: 30,
  },
  
  // 로딩 점들 스타일
  loadingDots: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  
  // 로딩 메시지 스타일
  loadingText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // 하단 홈 인디케이터 스타일
  homeIndicator: {
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
    alignSelf: 'center',
    width: 40,
    marginBottom: 20,
  },
}); 