import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image, 
  StatusBar,
  ScrollView, // ScrollView 추가
  KeyboardAvoidingView, // KeyboardAvoidingView 추가
  Platform // Platform 추가
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function UserInfoScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  const isEditMode = route?.params?.mode === 'edit';

  // 비밀번호 형식 검증 함수
  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8 && password.length <= 20;
    
    const conditions = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar];
    const validConditions = conditions.filter(Boolean).length >= 2;
    
    return isValidLength && validConditions;
  };

  // 비밀번호 변경 시 검증
  const handlePasswordChange = (text) => {
    setPassword(text);
    setIsPasswordValid(validatePassword(text));
    setIsPasswordMatch(text === confirmPassword && text !== '');
  };

  // 비밀번호 확인 변경 시 검증
  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    setIsPasswordMatch(text === password && text !== '');
  };

  const handleNext = () => {
    if (!userId) {
      Alert.alert('입력 오류', '아이디를 입력해주세요.');
      return;
    }
    if (!password) {
      Alert.alert('입력 오류', '비밀번호를 입력해주세요.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('입력 오류', '비밀번호가 일치하지 않습니다.');
      return;
    }
    navigation.navigate('UserInfo2', { mode: isEditMode ? 'edit' : undefined });
  };

  const handleDuplicateCheck = () => {
    if (!userId) {
      Alert.alert('입력 오류', '아이디를 입력해주세요.');
      return;
    }
    // 중복 확인 성공으로 처리
    setIsDuplicateChecked(true);
    // TODO: 실제 중복 확인 API 호출
    // Alert.alert('중복 확인', '중복 확인 기능은 준비 중입니다.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />
      {/* 헤더 */}
      <View style={styles.header}>
        {!isEditMode && (
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../assets/temp/icon_back.png')} style={styles.backIconImage} resizeMode="contain" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerText}>{isEditMode ? '개인정보 변경' : '회원가입'}</Text>
      </View>

      {/* 진행률 표시줄 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressFilled} />
        </View>
      </View>

      {/* 콘텐츠 영역 - KeyboardAvoidingView와 ScrollView로 감싸기 */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -300} // 필요에 따라 조정 가능
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* 아이디 입력 섹션 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>아이디</Text>
            <View style={styles.idContainer}>
              <TextInput
                style={styles.idInput}
                placeholder="아이디"
                placeholderTextColor="#999"
                value={userId}
                onChangeText={setUserId}
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.duplicateButton} onPress={handleDuplicateCheck}>
                <Text style={styles.duplicateButtonText}>중복확인</Text>
              </TouchableOpacity>
            </View>
            {isDuplicateChecked ? (
              <Text style={styles.successText}>사용가능한 아이디입니다.</Text>
            ) : (
              <Text style={styles.errorText}>중복된 아이디 입니다.</Text>
            )}
          </View>

          {/* 비밀번호 입력 섹션 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>비밀번호</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="비밀번호"
                placeholderTextColor="#999"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>👁</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.hintText}>8~20자/영문 대문자, 소문자, 숫자, 특수문자 중 2가지 이상 조합</Text>
            {password && !isPasswordValid && (
              <Text style={styles.errorText}>올바른 비밀번호 형식이 아닙니다.</Text>
            )}
            {password && isPasswordValid && (
              <Text style={styles.successText}>올바른 비밀번호 형식입니다.</Text>
            )}
          </View>

          {/* 비밀번호 확인 입력 섹션 */}
          <View style={styles.inputSection}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="비밀번호 확인"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.eyeIcon}>👁</Text>
              </TouchableOpacity>
            </View>
            {confirmPassword && !isPasswordMatch && (
              <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>
            )}
            {confirmPassword && isPasswordMatch && (
              <Text style={styles.successText}>비밀번호가 일치합니다.</Text>
            )}
          </View>

          {/* 완료/다음 버튼을 ScrollView 내부로 이동 */}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>다음</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  backButton: {
    paddingRight: 10,
    paddingVertical: 4,
    marginRight: 6,
  },
  backIconImage: {
    width: 24,
    height: 24,
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
    width: '25%', // 1단계 진행률
  },
  content: {
    flexGrow: 1, // ScrollView 내 콘텐츠가 공간을 채우도록
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100, // 하단 패딩 추가
  },
  inputSection: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  idInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  duplicateButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  duplicateButtonText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  passwordInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingRight: 50,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  eyeIcon: {
    fontSize: 20,
    color: '#999',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  successText: {
    color: 'green',
    fontSize: 12,
    marginBottom: 5,
  },
  hintText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 5,
  },
  nextButton: {
    // 절대 위치 제거, 일반적인 레이아웃으로 변경
    backgroundColor: '#FFF1A1',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});