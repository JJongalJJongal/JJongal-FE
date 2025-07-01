// LoginScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert
} from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  login as kakaoLogin,
  getProfile as getKakaoProfile
} from '@react-native-seoul/kakao-login';
import cocoBookLogo from '../assets/boook.png';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [emailError, setEmailError] = useState('');

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 8;
  const isLoginEnabled = isEmailValid && isPasswordValid;

  const handleEmailChange = (text) => {
    setEmail(text);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
    } else {
      setEmailError('');
    }
  };

  const handleGoogleLogin = async () => {
    if (isSigningIn) return;
    setIsSigningIn(true);

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('✅ Google userInfo:', userInfo);

      // GoogleSignin.signIn() 결과가 `{ type, data: { user: {…} } }` 형태인 경우를 처리
      const user =
        userInfo.user ??               // 이전 버전: 직접 user 프로퍼티
        userInfo.data?.user ??         // 최근 버전: data.user 안에 존재
        null;

      if (!user || !user.email) {
        Alert.alert('로그인 실패', '이메일 정보를 가져올 수 없습니다.');
        return;
      }

      const isExistingUser = await checkIfUserExists(user.email);
      if (isExistingUser) {
        navigation.navigate('Main');
      } else {
        navigation.navigate('UserInfo', { userInfo: user });
      }
    } catch (error) {
      console.error('Google 로그인 에러 ▶', error);
      Alert.alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      const token = await kakaoLogin();
      const profile = await getKakaoProfile();
      console.log('✅ Kakao token, profile:', token, profile);
      // TODO: 백엔드에 token/profile 보내서 로그인 처리
    } catch (e) {
      console.error('Kakao 로그인 에러 ▶', e);
      Alert.alert('카카오 로그인 중 오류가 발생했습니다.');
    }
  };

  const checkIfUserExists = async (email) => {
    // TODO: 실제 서버 API 호출로 회원 여부 확인
    return false; // 임시: 항상 신규 유저로 처리
  };

  return (
      <View style={styles.container}>
        <Image
          source={cocoBookLogo}
          style={styles.logo}
          resizeMode="contain"
        />

      <TextInput
        style={styles.input}
        placeholder="이메일"
        placeholderTextColor="#777"
        value={email}
        onChangeText={handleEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        placeholderTextColor="#777"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {!isPasswordValid && password.length > 0 && (
        <Text style={styles.errorText}>비밀번호는 8자리 이상이어야 합니다.</Text>
      )}

      <TouchableOpacity
        style={[styles.secondaryButton, !isLoginEnabled && { opacity: 0.5 }]}
        onPress={() => navigation.navigate('Main')}
        disabled={!isLoginEnabled}
      >
        <Text style={styles.secondaryButtonText}>로그인하기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate('UserInfo')}
      >
        <Text style={styles.primaryButtonText}>회원가입하기</Text>
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>또는</Text>
        <View style={styles.separatorLine} />
      </View>

      <TouchableOpacity
        style={styles.socialButton}
        onPress={handleKakaoLogin}
        disabled={isSigningIn}
      >
        <Text style={styles.socialText}>카카오로 계속하기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialButton}
        onPress={handleGoogleLogin}
        disabled={isSigningIn}
      >
        <Text style={styles.socialText}>구글로 계속하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton} disabled>
        <Text style={styles.socialText}>네이버로 계속하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1.5,
    borderColor: '#aaa',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#E1EEBC',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#E1EEBC',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#444',
  },
  socialButton: {
    backgroundColor: '#E1EEBC',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginVertical: 6,
    width: '100%',
  },
  socialText: {
    fontSize: 16,
    fontWeight: '500',
  },
});