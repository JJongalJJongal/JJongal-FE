// VoiceScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function VoiceScreen() {
  const navigation = useNavigation();

  const [selectedVoice, setSelectedVoice] = useState(null); // 'child' | 'parent' | null

  const handleBack = () => navigation.goBack();
  const handleComplete = () => navigation.navigate('Setting');
  const handleNext = () => navigation.navigate('Voice2');

  const isChildSelected = selectedVoice === 'child';
  const isParentSelected = selectedVoice === 'parent';

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

      {/* 안내 멘트 */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleLarge}>변경하고 싶은 음성을{ '\n' }선택해주세요</Text>
      </View>

      {/* 선택 버튼들 */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionButton, isChildSelected && styles.optionButtonSelected]}
          onPress={() => setSelectedVoice('child')}
          activeOpacity={0.9}
        >
          <Text style={styles.optionText}>아이 목소리</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, isParentSelected && styles.optionButtonSelected]}
          onPress={() => setSelectedVoice('parent')}
          activeOpacity={0.9}
        >
          <Text style={styles.optionText}>부모님 목소리</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 버튼 - 선택에 따라 노출 */}
      {selectedVoice && (
        <View style={styles.bottomContainer}>
          {isChildSelected ? (
            <TouchableOpacity style={styles.primaryButton} onPress={handleComplete}>
              <Text style={styles.primaryButtonText}>완료</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
              <Text style={styles.primaryButtonText}>다음</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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

  titleContainer: { paddingHorizontal: 24, paddingVertical: 24 },
  titleLarge: { fontSize: 28, fontWeight: 'bold', color: '#000', lineHeight: 36 },

  optionsContainer: { paddingHorizontal: 24, gap: 14 },
  optionButton: {
    height: 64,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  optionButtonSelected: {
    backgroundColor: '#FFF1A1',
    borderColor: '#FFF1A1',
  },
  optionText: { fontSize: 16, color: '#000', fontWeight: '600' },

  bottomContainer: { marginTop: 'auto', paddingHorizontal: 24, paddingBottom: 30 },
  primaryButton: {
    backgroundColor: '#FFF1A1',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
}); 