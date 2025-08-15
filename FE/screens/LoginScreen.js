// LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image
} from 'react-native';
import { configureGoogleSignIn, signInWithGoogle } from '../login/googleSignIn';

export default function LoginScreen({ navigation }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const handleGoogleLogin = async () => {
    console.log('1. 구글 로그인 버튼 클릭됨'); // <--- 로그 추가
    setIsSigningIn(true);
    try {
      console.log('2. signInWithGoogle 함수 호출 시작'); // <--- 로그 추가
      const result = await signInWithGoogle();
      console.log('3. signInWithGoogle 함수 결과 받음:', result); // <--- 로그 추가
  
      if (result.success) {
        console.log('성공! 서버 인증 코드:', result.serverAuthCode); // <--- 이 로그를 추가해서 코드를 확인
        console.log('4. 로그인 성공! LoadingPage로 이동합니다.');
        navigation.navigate('LoadingPage', { 
          code: result.serverAuthCode 
        });
      } else {
        console.log('4. 로그인 실패 (result.success가 false). 에러:', result.error); // <--- 로그 추가
        Alert.alert('Google 로그인 실패', '로그인 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('5. handleGoogleLogin에서 예외 발생:', error); // <--- 로그 추가
      Alert.alert('Google 로그인 실패', '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsSigningIn(false);
    }
  };
  
  // const handleKakaoLogin = async () => {
  //   try {
  //     const result = await KakaoLogins.login();
  //     const accessToken = result.accessToken;
  
  //     await fetch('http://your-backend/api/social-login/kakao', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ access_token: accessToken }),
  //     });
  
  //     navigation.navigate('UserInfo');
  //   } catch (error) {
  //     console.error('Kakao 로그인 에러 ▶', error);
  //     Alert.alert('카카오 로그인 실패', '로그인 중 오류가 발생했습니다.');
  //   }
  // };
  
  // const naverKeys = {
  //   kConsumerKey: 'YOUR_NAVER_CLIENT_ID',
  //   kConsumerSecret: 'YOUR_NAVER_CLIENT_SECRET',
  //   kServiceAppName: 'YOUR_APP_NAME',
  //   kServiceAppUrlScheme: 'naverlogin',
  // };
  
  // const handleNaverLogin = () => {
  //   NaverLogin.login(naverKeys, async (err, token) => {
  //     if (err) {
  //       console.error('Naver 로그인 에러 ▶', err);
  //       Alert.alert('네이버 로그인 실패');
  //       return;
  //     }
  
  //     const accessToken = token.accessToken;
  
  //     await fetch('http://your-backend/api/social-login/naver', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ access_token: accessToken }),
  //     });
  
  //     navigation.navigate('UserInfo');
  //   });
  // };


  const checkIfUserExists = async (email) => {
    return false;
  };

  return (
    <View style={styles.container}>
      {/* PEEP 로고 */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>PEEP</Text>
        <Text style={styles.logoText}>PEEP</Text>
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

      {/* 추가 링크들 */}
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('UserInfo')}>
          <Text style={styles.linkText}>회원가입하기</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.linkText}>아이디/비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>

      {/* SNS 로그인 섹션 */}
      <View style={styles.snsContainer}>
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
        </View>
        <Text style={styles.snsTitle}>SNS로 로그인하기</Text>
        
        <View style={styles.snsButtonContainer}>
          <TouchableOpacity style={styles.snsButton} onPress={() => Alert.alert('카카오 로그인', '준비 중입니다.')}>
            <View style={styles.kakaoIcon}>
              <Text style={styles.kakaoText}>TALK</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.snsButton} onPress={handleGoogleLogin}>
            <View style={styles.googleIcon}>
              <Text style={styles.googleText}>G</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.snsButton} onPress={() => Alert.alert('네이버 로그인', '준비 중입니다.')}>
            <View style={styles.naverIcon}>
              <Text style={styles.naverText}>N</Text>
            </View>
          </TouchableOpacity>
        </View>
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
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFED84',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 3,
    marginVertical: 5,
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
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
    borderRadius: 25,
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
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  linkContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  linkText: {
    color: '#999',
    fontSize: 14,
    marginVertical: 5,
  },
  snsContainer: {
    alignItems: 'center',
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
});