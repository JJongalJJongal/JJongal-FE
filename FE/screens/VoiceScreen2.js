// VoiceScreen2.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function VoiceScreen2() {
  const navigation = useNavigation();

  const handleBack = () => navigation.goBack();
  const handleRetry = () => {};
  const handleComplete = () => navigation.navigate('Setting');

  const sampleLines = [
    '루미는 아라의 첫 친구가 되었다.',
    '둘은 금방 친해져 함께 다닌다.',
    '루미는 아라에게 학교를 소개한다.',
    '마법 도서관과 실험실이 있다.',
    '둘은 신난 마음으로 학교를 돌아다닌다.',
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />

      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image source={require('../assets/temp/icon_back.png')} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>음성 변경</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 안내 제목 */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleLarge}>예시 스크립트를 따라{ '\n' }읽어주세요</Text>
      </View>

      {/* 캐릭터 이미지 */}
      <View style={styles.characterWrapper}>
        <Image source={require('../assets/temp/main1.jpg')} style={styles.characterImage} resizeMode="contain" />
      </View>

      {/* 스크립트 박스 */}
      <View style={styles.scriptBox}>
        {sampleLines.map((line, idx) => (
          <Text key={idx} style={[styles.scriptLine, idx === 0 ? styles.scriptCurrent : styles.scriptRest]}>
            {line}
          </Text>
        ))}
      </View>

      {/* 하단 버튼 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleRetry}>
          <Text style={styles.secondaryButtonText}>다시 읽기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={handleComplete}>
          <Text style={styles.primaryButtonText}>완료</Text>
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: { padding: 4, width: 24 },
  backIcon: { width: 24, height: 24 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },

  titleContainer: { paddingHorizontal: 24, paddingVertical: 20 },
  titleLarge: { fontSize: 28, fontWeight: 'bold', color: '#000', lineHeight: 36 },

  characterWrapper: { alignItems: 'center', marginTop: 10 },
  characterImage: { width: width * 0.45, height: height * 0.18 },

  scriptBox: {
    marginTop: 16,
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFE89E',
    backgroundColor: '#fff',
  },
  scriptLine: { fontSize: 16, lineHeight: 26, marginVertical: 2 },
  scriptCurrent: { color: '#000', fontWeight: '700' },
  scriptRest: { color: '#C0C0C0' },

  bottomContainer: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 30,
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#E9E9E9',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  primaryButton: {
    flex: 1,
    backgroundColor: '#FFF1A1',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
}); 