// AITalkScreen.js
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

export default function AITalkScreen({ navigation, route }) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  const aiMessages = [
    '안녕! 나는 쫑이라고 해!'
  ];
  
  const [aiMessage, setAiMessage] = useState(aiMessages[0]);
  const [aiImage, setAiImage] = useState('library');
  const [aiName, setAiName] = useState('쫑이');
  const [isMessageComplete, setIsMessageComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const backgroundImages = [
    require('../assets/temp/bg1.png'),
    require('../assets/temp/bg2.png'),
    require('../assets/temp/bg3.png'),
  ];

  const [currentBackground, setCurrentBackground] = useState(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    return randomIndex;
  });

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    // 바로 Talk2.js로 이동
    navigation.navigate('Talk2', {
      aiName: aiName,
      aiImage: aiImage,
      background: currentBackground,
    });
  };

  const handleAnswer = () => {
    navigation.navigate('Talk2', {
      aiName: aiName,
      aiImage: aiImage,
      background: currentBackground,
    });
  };

  const handleComplete = () => {
    navigation.navigate('Loading', {
      aiName: aiName,
      aiImage: aiImage,
      background: currentBackground,
    });
  };

  const handleViewConversation = () => {
    console.log('대화 기록 보기');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />

      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>동화책 만들기</Text>
        <TouchableOpacity style={styles.homeButton}>
          <Image
            source={require('../assets/temp/icon_home3.png')}
            style={styles.homeIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 메인 콘텐츠 영역 */}
      <View style={styles.mainContent}>
        <Image
          source={backgroundImages[currentBackground]}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        {/* 재생/정지 버튼들 */}
        <View style={styles.controlButtons}>
          <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
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
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>다음</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.answerButton} onPress={handleAnswer}>
              <Text style={styles.answerButtonText}>대답하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.completeButtonText}>완성하기</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },

  header: {
    backgroundColor: '#FFF1A1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 40, // UserTalkScreen과 동일
    paddingBottom: 20,
    zIndex: 2,
  },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  homeButton: { padding: 8 },
  homeIcon: { width: 36, height: 36 },

  mainContent: {
    flex: 1, // ✅ UserTalkScreen과 동일
    position: 'relative',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playIcon: { width: 20, height: 20 },
  stopButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stopIcon: { width: 20, height: 20 },

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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  conversationText: { fontSize: 14, color: '#000' },

  bottomSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 40,
    minHeight: height * 0.36,
  },
  nameLabel: {
    backgroundColor: '#FFF1A1',
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

  messageContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 25,
    minHeight: 120, // ✅ UserTalkScreen 하단 높이와 맞춤
    justifyContent: 'center',
  },
  messageText: { fontSize: 16, color: '#000', lineHeight: 24, textAlign: 'center' },

  nextButton: {
    backgroundColor: '#FFF1A1',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000' },

  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  answerButton: {
    backgroundColor: '#FFF1A1',
    borderRadius: 10,
    paddingVertical: 15,
    flex: 0.48,
    alignItems: 'center',
  },
  answerButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  completeButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 15,
    flex: 0.48,
    alignItems: 'center',
  },
  completeButtonText: { fontSize: 18, fontWeight: 'bold', color: '#666' },
});
