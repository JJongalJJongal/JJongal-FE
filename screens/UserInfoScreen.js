import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import ArrowImg from '../assets/arrow.png';

export default function UserInfoScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const from = route.params?.from || 'Login'; // 기본 경로

  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState('');

  const handleNameChange = (text) => {
    const koreanOnly = text.replace(/[^\uAC00-\uD7A3ㄱ-ㅎㅏ-ㅣ]/g, '');
    setName(koreanOnly);
  };

  const handleNext = () => {
    if (!name) {
      Alert.alert('입력 오류', '이름을 입력해주세요.');
      return;
    }
    if (!gender) {
      Alert.alert('입력 오류', '성별을 선택해주세요.');
      return;
    }
    if (!age) {
      Alert.alert('입력 오류', '나이를 선택해주세요.');
      return;
    }
    navigation.navigate('UserInfo2', { from });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원정보를 입력해주세요</Text>
      <TextInput
        style={styles.input}
        placeholder="이름을 입력하세요"
        placeholderTextColor="#A0A0A0"
        value={name}
        onChangeText={handleNameChange}
      />
      <View style={styles.genderRow}>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'female' && styles.genderSelected]}
          onPress={() => setGender('female')}
        >
          <Text style={styles.genderText}>여자</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'male' && styles.genderSelected]}
          onPress={() => setGender('male')}
        >
          <Text style={styles.genderText}>남자</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="나이를 입력하세요"
        placeholderTextColor="#A0A0A0"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Image source={ArrowImg} style={{ width: 64, height: 64, resizeMode: 'contain' }} />
      </TouchableOpacity>
    </View>
  );
}

const BASE_BORDER_WIDTH = 4;
const BASE_SPACING = 56; // 기존 margin/padding의 2배로 넉넉하게
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 40,
    paddingTop: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3C5A2A',
    marginBottom: BASE_SPACING,
    textAlign: 'left',
    fontFamily: 'NanumGothic',
  },
  input: {
    borderWidth: BASE_BORDER_WIDTH,
    borderColor: '#E1EEBC',
    borderRadius: 16,
    paddingHorizontal: BASE_SPACING / 2,
    paddingVertical: BASE_SPACING / 2.5,
    fontSize: 18,
    backgroundColor: '#fff',
    marginBottom: BASE_SPACING,
    color: '#3C5A2A',
    fontFamily: 'NanumGothic',
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BASE_SPACING,
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#F3FAD5',
    borderRadius: 16,
    borderWidth: BASE_BORDER_WIDTH,
    borderColor: '#E1EEBC',
    paddingVertical: BASE_SPACING / 2.5,
    marginHorizontal: BASE_SPACING / 7,
    alignItems: 'center',
  },
  genderSelected: {
    borderColor: '#4B662B',
  },
  genderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3C5A2A',
    fontFamily: 'NanumGothic',
  },
  nextButton: {
    position: 'absolute',
    bottom: 36,
    right: 24,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopWidth: 16,
    borderBottomWidth: 16,
    borderLeftWidth: 32,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#3C5A2A',
    marginLeft: 6,
  },
});