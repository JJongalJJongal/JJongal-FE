import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput, // 이 부분(TextInput)을 추가해야 합니다.
  Alert,
  Image,
  StatusBar,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';

export default function UserInfo2Screen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [childName, setChildName] = useState('');
  const [childGender, setChildGender] = useState('');
  const [childAge, setChildAge] = useState(null); // 초기값을 null로 변경

  const isEditMode = route?.params?.mode === 'edit';

  // ⚠️ 설정 화면의 실제 라우트 이름으로 바꾸세요.
  const SETTINGS_ROUTE_NAME = 'Setting';

  // 나이 선택 옵션 배열
  const ageOptions = ['4', '5', '6', '7', '8', '9', '10', '그 이상'];

  const goBackToSetting = () => {
    Keyboard.dismiss();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: SETTINGS_ROUTE_NAME }],
      })
    );
  };

  const handleNext = () => {
    if (!childName) {
      Alert.alert('입력 오류', '아이의 이름을 입력해주세요.');
      return;
    }
    if (!childGender) {
      Alert.alert('입력 오류', '아이의 성별을 선택해주세요.');
      return;
    }
    if (!childAge) {
      Alert.alert('입력 오류', '아이의 나이를 선택해주세요.'); // 문구 변경
      return;
    }

    if (isEditMode) {
      Alert.alert('완료', '개인정보 변경이 완료되었습니다.', [
        { text: '확인', onPress: goBackToSetting },
      ]);
      return;
    }

    navigation.navigate('Like');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/temp/icon_back.png')} style={styles.backIconImage} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{isEditMode ? '개인정보 변경' : '회원가입'}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressFilled} />
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.inputSection}>
            <Text style={styles.label}>아이의 이름을 입력해주세요</Text>
            {/* 이름 입력 필드는 TextInput으로 유지 */}
            <View style={styles.input}>
                 <TextInput
                    placeholder="이름"
                    placeholderTextColor="#999"
                    value={childName}
                    onChangeText={setChildName}
                    autoCapitalize="none"
                    returnKeyType="next"
                    style={{fontSize: 16}}
                />
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.label}>아이의 성별을 선택해주세요</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[styles.genderButton, childGender === 'female' && styles.genderButtonSelected]}
                onPress={() => setChildGender('female')}
              >
                <Text style={[styles.genderButtonText, childGender === 'female' && styles.genderButtonTextSelected]}>여자</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, childGender === 'male' && styles.genderButtonSelected]}
                onPress={() => setChildGender('male')}
              >
                <Text style={[styles.genderButtonText, childGender === 'male' && styles.genderButtonTextSelected]}>남자</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 아이 나이 입력 섹션 변경 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>아이의 나이를 선택해주세요</Text>
            <View style={styles.ageContainer}>
              {ageOptions.map((age) => (
                <TouchableOpacity
                  key={age}
                  style={[styles.ageButton, childAge === age && styles.ageButtonSelected]}
                  onPress={() => setChildAge(age)}
                >
                  <Text style={[styles.ageButtonText, childAge === age && styles.ageButtonTextSelected]}>
                    {age === '그 이상' ? age : `${age}세`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={{ flex: 1 }} /> 

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>{isEditMode ? '완료' : '다음'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#FFF1A1',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { paddingRight: 10, paddingVertical: 4, marginRight: 6 },
  backIconImage: { width: 24, height: 24 },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  progressContainer: { paddingHorizontal: 24, paddingVertical: 15 },
  progressBar: { height: 4, backgroundColor: '#E0E0E0', borderRadius: 2 },
  progressFilled: { height: 4, backgroundColor: '#8B4513', borderRadius: 2, width: '50%' },
  content: { 
    flexGrow: 1,
    paddingHorizontal: 24, 
    paddingTop: 20 
  },
  inputSection: { marginBottom: 30 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 12 },
  input: {
    width: '100%', height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10,
    paddingHorizontal: 15, backgroundColor: '#fff', justifyContent: 'center',
  },
  genderContainer: { flexDirection: 'row', marginHorizontal: -5 },
  genderButton: {
    flex: 1, height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
    marginHorizontal: 5,
  },
  genderButtonSelected: { backgroundColor: '#FFF8D1', borderColor: '#FFF1A1' },
  genderButtonText: { fontSize: 16, color: '#999', fontWeight: '500' },
  genderButtonTextSelected: { color: '#000', fontWeight: 'bold' },
  
  // 나이 선택 버튼을 위한 스타일 추가
  ageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ageButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20, // 좀 더 부드러운 디자인
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10,
    marginBottom: 10,
  },
  ageButtonSelected: {
    backgroundColor: '#FFF8D1',
    borderColor: '#FFF1A1',
  },
  ageButtonText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  ageButtonTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },

  nextButton: {
    backgroundColor: '#FFF1A1', 
    marginBottom: 30, 
    borderRadius: 10, 
    paddingVertical: 15, 
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
});