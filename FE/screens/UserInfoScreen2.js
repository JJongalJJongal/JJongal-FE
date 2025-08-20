import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Image, StatusBar, Keyboard } from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';

export default function UserInfo2Screen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [childName, setChildName] = useState('');
  const [childGender, setChildGender] = useState('female');
  const [childAge, setChildAge] = useState('');

  const isEditMode = route?.params?.mode === 'edit';

  // ⚠️ 설정 화면의 실제 라우트 이름으로 바꾸세요.
  // 네비게이터에 등록한 이름이 'Setting'이 아니라면 'SettingScreen' 등으로 변경.
  const SETTINGS_ROUTE_NAME = 'Setting';

  const goBackToSetting = () => {
    // 키보드가 떠 있으면 먼저 닫기 (터치 무시 방지)
    Keyboard.dismiss();

    // 1) 가장 확실한 방법: 설정 화면 하나만 있는 스택으로 리셋
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
    if (!childAge) {
      Alert.alert('입력 오류', '아이의 나이를 입력해주세요.');
      return;
    }

    if (isEditMode) {
      Alert.alert('완료', '개인정보 변경이 완료되었습니다.', [
        { text: '확인', onPress: goBackToSetting },
      ]);
      return;
    }

    // 가입 플로우일 때
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

      <View style={styles.content}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>아이의 이름을 입력해주세요</Text>
          <TextInput
            style={styles.input}
            placeholder="이름"
            placeholderTextColor="#999"
            value={childName}
            onChangeText={setChildName}
            autoCapitalize="none"
            returnKeyType="next"
          />
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

        <View style={styles.inputSection}>
          <Text style={styles.label}>아이의 나이를 입력해주세요</Text>
          <TextInput
            style={styles.input}
            placeholder="나이"
            placeholderTextColor="#999"
            value={childAge}
            onChangeText={setChildAge}
            keyboardType="number-pad"
            autoCapitalize="none"
            returnKeyType="done"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>{isEditMode ? '완료' : '다음'}</Text>
      </TouchableOpacity>
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
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  inputSection: { marginBottom: 30 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 12 },
  input: {
    width: '100%', height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10,
    paddingHorizontal: 15, backgroundColor: '#fff', fontSize: 16,
  },
  genderContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  genderButton: {
    flex: 1, height: 50, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginHorizontal: 5,
  },
  genderButtonSelected: { backgroundColor: '#FFF8D1', borderColor: '#FFF1A1' },
  genderButtonText: { fontSize: 16, color: '#999', fontWeight: '500' },
  genderButtonTextSelected: { color: '#000', fontWeight: 'bold' },
  nextButton: {
    backgroundColor: '#FFF1A1', marginHorizontal: 24, marginBottom: 30, borderRadius: 10, paddingVertical: 15, alignItems: 'center',
  },
  nextButtonText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
});
