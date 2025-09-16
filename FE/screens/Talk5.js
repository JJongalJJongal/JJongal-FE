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
  const [userName, setUserName] = useState('정우');
  const [isListening, setIsListening] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const backgroundImages = [
    require('../assets/temp/bg1.png'),
    require('../assets/temp/bg2.png'),
    require('../assets/temp/bg3.png'),
  ];

  const [currentBackground, setCurrentBackground] = useState(() => {
    if (route?.params?.background !== undefined) {
      return route.params.background;
    }
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    return randomIndex;
  });

  const handleMicrophonePress = () => setIsListening((prev) => !prev);

  const handleCompleteAnswer = () => {
    if (isListening) setIsListening(false);
    setIsWaiting(true); // 대기 상태 시작
    // 2초 대기 후 Talk6로 이동
    setTimeout(() => {
      navigation.navigate('Talk6', { background: currentBackground });
    }, 2000);
  };

  const handleGoHome = () => navigation.navigate('Main');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />

      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>동화책 만들기</Text>
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Image
            source={require('../assets/temp/icon_home3.png')}
            style={styles.homeIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 메인 콘텐츠 (이미지 영역) */}
      <View style={styles.mainContent}>
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
            source={
              isListening
                ? require('../assets/temp/icon_mike2.png')
                : require('../assets/temp/icon_mike1.png')
            }
            style={styles.microphoneIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* 대답완료 버튼 */}
        <TouchableOpacity 
          style={[styles.completeButton, isWaiting && styles.completeButtonWaiting]} 
          onPress={handleCompleteAnswer}
          disabled={isWaiting}
        >
          <Text style={[styles.completeButtonText, isWaiting && styles.completeButtonTextWaiting]}>
            {isWaiting ? '쫑이가 생각하고 있어요' : '대답완료'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    backgroundColor: '#FFF1A1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 40, // AITalkScreen과 동일
    paddingBottom: 20,
    zIndex: 2,
  },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  homeButton: { padding: 8 },
  homeIcon: { width: 36, height: 36 },

  mainContent: {
    flex: 1, // 🔥 세로 비율 동일하게 맞춤
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },

  bottomSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  nameLabel: {
    backgroundColor: '#FFF1A1', // AITalkScreen과 동일
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
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
  microphoneButtonListening: { backgroundColor: '#FFFBE5', borderColor: '#FFA500' },
  microphoneIcon: { width: 48, height: 48 },

  completeButton: {
    backgroundColor: '#FFF1A1',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  completeButtonWaiting: { backgroundColor: '#FFE0B2', borderColor: '#FFCC80' },
  completeButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  completeButtonTextWaiting: { color: '#FF9800' },
});