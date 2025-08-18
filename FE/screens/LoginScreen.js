// LoginScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image
} from 'react-native';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function LoginScreen({ navigation }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleLogin = async () => {
    // if (isSigningIn) return;
    // setIsSigningIn(true);

    // try {
    //   await GoogleSignin.hasPlayServices();
    //   const userInfo = await GoogleSignin.signIn();
    //   console.log('✅ Google userInfo:', userInfo);

    //   const user =
    //     userInfo.user ??               
    //     userInfo.data?.user ??         
    //     null;

    //   if (!user || !user.email) {
    //     Alert.alert('로그인 실패', '이메일 정보를 가져올 수 없습니다.');
    //     return;
    //   }

    //   const isExistingUser = await checkIfUserExists(user.email);
    //   if (isExistingUser) {
    //     navigation.navigate('UserInfo');
    //   } else {
    //     navigation.navigate('UserInfo', { userInfo: user });
    //   }
    // } catch (error) {
    //   console.error('Google 로그인 에러 ▶', error);
    //   Alert.alert('로그인 중 오류가 발생했습니다.');
    // } finally {
    //   setIsSigningIn(false);
    // }
    
    Alert.alert('Google 로그인', 'Google 로그인 기능은 준비 중입니다.');
  };

  const handleKakaoLogin = async () => {
    try {
      Alert.alert('카카오 로그인', '카카오 로그인 기능은 준비 중입니다.');
    } catch (e) {
      console.error('Kakao 로그인 에러 ▶', e);
      Alert.alert('카카오 로그인 중 오류가 발생했습니다.');
    }
  };

  const handleNaverLogin = async () => {
    try {
      Alert.alert('네이버 로그인', '네이버 로그인 기능은 준비 중입니다.');
    } catch (e) {
      console.error('Naver 로그인 에러 ▶', e);
      Alert.alert('네이버 로그인 중 오류가 발생했습니다.');
    }
  };

  const checkIfUserExists = async (email) => {
    return false;
  };

  return (
    <View style={styles.container}>
      {/* PEEP 로고 */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/temp/logo1.jpg')} 
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* 입력 필드들 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          placeholderTextColor="#999"
          value={userId}
          onChangeText={setUserId}
          autoCapitalize="none"
        />
        <Text style={styles.errorText}>가입된 아이디가 없습니다.</Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="비밀번호"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
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
        <Text style={styles.errorText}>비밀번호가 일치하지 않습니다.</Text>
      </View>

      {/* 로그인 버튼 */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('UserInfo')}
      >
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      {/* SNS 로그인 섹션 */}
      <View style={styles.snsContainer}>
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
        </View>
        <Text style={styles.snsTitle}>SNS로 로그인하기</Text>
        
        <View style={styles.snsButtonContainer}>
          <TouchableOpacity style={styles.snsButton} onPress={handleKakaoLogin}>
            <View style={styles.kakaoIcon}>
              <Text style={styles.kakaoText}>TALK</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.snsButton} onPress={handleGoogleLogin}>
            <View style={styles.googleIcon}>
              <Text style={styles.googleText}>G</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.snsButton} onPress={handleNaverLogin}>
            <View style={styles.naverIcon}>
              <Text style={styles.naverText}>N</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* 추가 링크들 */}
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('UserInfo')}>
          <Text style={styles.linkText}>회원가입하기</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.linkText}>아이디/비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 200,
    height: 100,
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  passwordInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 20,
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
    marginBottom: 15,
    marginLeft: 5,
  },
  loginButton: {
    backgroundColor: '#FFED84',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  snsContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  separator: {
    width: '100%',
    marginBottom: 20,
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#ddd',
  },
  snsTitle: {
    color: '#999',
    fontSize: 14,
    marginBottom: 20,
  },
  snsButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  snsButton: {
    alignItems: 'center',
  },
  kakaoIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#FEE500',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kakaoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  googleIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#4285F4',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  naverIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#03C75A',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  naverText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 20,
  },
  linkText: {
    color: '#999',
    fontSize: 14,
    marginVertical: 5,
  },
}); 