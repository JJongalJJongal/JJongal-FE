// UserTalkScreen.js
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

export default function UserTalkScreen({ navigation, route }) {
  // 사용자 이름 (나중에 백엔드 연동 예정)
  const [userName, setUserName] = useState('상아');

  // 음성 수집 모드 상태
  const [isListening, setIsListening] = useState(false);

  // 배경 이미지 배열 (AITalkScreen과 동일하게 사용)
  const backgroundImages = [
    require('../assets/temp/bg1.jpg'),
    require('../assets/temp/bg2.jpg'),
    require('../assets/temp/bg3.jpg'),
  ];

  // AITalkScreen에서 전달된 배경 인덱스를 사용, 없으면 랜덤
  const [currentBackground, setCurrentBackground] = useState(() => {
    if (route?.params?.background !== undefined) {
      return route.params.background;
    }
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    return randomIndex;
  });

  const handleMicrophonePress = () => {
    setIsListening((prev) => !prev);
  };

  const handleCompleteAnswer = () => {
    if (isListening) {
      setIsListening(false);
    }
    navigation.navigate('AITalk', {
      background: currentBackground,
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoHome = () => {
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFED84" />

      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Image
            source={require('../assets/temp/icon_back.jpg')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>동화책 만들기</Text>
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
        {/* 배경 이미지 */}
        <Image
          source={backgroundImages[currentBackground]}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </View>

      {/* 하단 대화 영역 */}
      <View style={styles.bottomSection}>
        {/* 사용자 이름 라벨 */}
        <View style={styles.nameLabel}>
          <Text style={styles.nameText}>{userName}</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </View>

        {/* 프롬프트 텍스트 */}
        <Text style={styles.promptText}>
          {isListening ? '... 쫑이가 이야기를 듣는중 ...' : '버튼을 눌러 이야기 해주세요!'}
        </Text>

        {/* 마이크 버튼 */}
        <TouchableOpacity
          style={[styles.microphoneButton, isListening && styles.microphoneButtonListening]}
          onPress={handleMicrophonePress}
        >
          <Image
            source={require('../assets/temp/icon_mike.jpg')}
            style={styles.microphoneIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* 대답완료 버튼 */}
        <TouchableOpacity style={styles.completeButton} onPress={handleCompleteAnswer}>
          <Text style={styles.completeButtonText}>대답완료</Text>
        </TouchableOpacity>

        {/* 제스처 네비게이션 바 */}
        <View style={styles.gestureBar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

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
  backButton: { padding: 8 },
  backIcon: { width: 24, height: 24 },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  homeButton: { padding: 8 },
  homeIcon: { width: 24, height: 24 },

  mainContent: { flex: 1, backgroundColor: '#fff', position: 'relative' },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  bottomSection: { backgroundColor: '#fff', paddingHorizontal: 24, paddingBottom: 30 },
  nameLabel: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: { fontSize: 14, fontWeight: '600', color: '#000', marginRight: 8 },
  dropdownIcon: { fontSize: 12, color: '#000' },

  promptText: { fontSize: 16, color: '#000', textAlign: 'center', marginBottom: 25, lineHeight: 24 },

  microphoneButton: {
    width: 80,
    height: 80,
    backgroundColor: 'transparent',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 25,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  microphoneButtonListening: { backgroundColor: '#FFED84', borderColor: '#FFA500' },
  microphoneIcon: { width: 40, height: 40 },

  completeButton: { backgroundColor: '#FFED84', borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginBottom: 20 },
  completeButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000' },

  gestureBar: { height: 4, backgroundColor: '#000', borderRadius: 2, alignSelf: 'center', width: 40 },
}); 