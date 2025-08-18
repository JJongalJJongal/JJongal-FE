import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function UserInfo2Screen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [childName, setChildName] = useState('');
  const [childGender, setChildGender] = useState('female'); // 기본값 여자
  const [childAge, setChildAge] = useState('');

  const handleNext = () => {
    if (!childName) {
      Alert.alert('입력 오류', '아이의 이름을 입력해주세요.');
      return;
    }
    if (!childAge) {
      Alert.alert('입력 오류', '아이의 나이를 입력해주세요.');
      return;
    }
    // LikeScreen으로 이동
    navigation.navigate('Like');
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>회원가입</Text>
      </View>

      {/* 진행률 표시줄 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressFilled} />
        </View>
      </View>

      {/* 콘텐츠 영역 */}
      <View style={styles.content}>
        {/* 아이 이름 입력 섹션 */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>아이의 이름을 입력해주세요</Text>
          <TextInput
            style={styles.input}
            placeholder="이름"
            placeholderTextColor="#999"
            value={childName}
            onChangeText={setChildName}
            autoCapitalize="none"
          />
        </View>

        {/* 아이 성별 선택 섹션 */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>아이의 성별을 선택해주세요</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                childGender === 'female' && styles.genderButtonSelected
              ]}
              onPress={() => setChildGender('female')}
            >
              <Text style={[
                styles.genderButtonText,
                childGender === 'female' && styles.genderButtonTextSelected
              ]}>
                여자
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                childGender === 'male' && styles.genderButtonSelected
              ]}
              onPress={() => setChildGender('male')}
            >
              <Text style={[
                styles.genderButtonText,
                childGender === 'male' && styles.genderButtonTextSelected
              ]}>
                남자
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 아이 나이 입력 섹션 */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>아이의 나이를 입력해주세요</Text>
          <TextInput
            style={styles.input}
            placeholder="나이"
            placeholderTextColor="#999"
            value={childAge}
            onChangeText={setChildAge}
            keyboardType="numeric"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* 다음 버튼 */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FFED84',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  progressFilled: {
    height: 4,
    backgroundColor: '#8B4513',
    borderRadius: 2,
    width: '50%', // 2단계 진행률
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  inputSection: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  genderButtonSelected: {
    backgroundColor: '#FFF8D1',
    borderColor: '#FFED84',
  },
  genderButtonText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  genderButtonTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#FFED84',
    marginHorizontal: 24,
    marginBottom: 30,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
}); 