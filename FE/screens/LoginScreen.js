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
import { API_BASE_URL } from '@env'; // --- [추가] .env 파일에서 API URL 가져오기

export default function LoginScreen({ navigation }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  // --- [수정] handleGoogleLogin 함수 전체 수정 ---
  const handleGoogleLogin = async () => {
    if (isSigningIn) return; // 중복 클릭 방지

    setIsSigningIn(true);
    try {
      // 1. 구글 로그인 시도
      const googleResult = await signInWithGoogle();
  
      if (!googleResult.success) {
        console.log('Google Sign-In was cancelled or failed:', googleResult.error);
        // 사용자가 로그인을 취소한 경우, 별도 알림 없이 조용히 종료할 수 있습니다.
        if (googleResult.error.code !== '-5') { // '-5' is the cancellation code on iOS
            Alert.alert('Google 로그인 실패', '로그인 중 오류가 발생했습니다.');
        }
        return;
      }
      
      console.log('Google 로그인 성공! Server Auth Code:', googleResult.serverAuthCode);
      
      // 2. 백엔드 서버에 인증 코드 전송
      //    (백엔드에서는 이 코드를 사용해 구글로부터 access/refresh 토큰 및 사용자 정보를 받아옵니다)
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, { // <-- 백엔드 API 엔드포인트
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: googleResult.serverAuthCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 백엔드에서 에러를 보낸 경우 (e.g., 이미 가입된 이메일 등)
        throw new Error(data.message || '서버 통신에 실패했습니다.');
      }

      // 3. 백엔드 응답에 따른 화면 이동
      if (data.isNewUser) {
        // 신규 사용자인 경우, 추가 정보 입력 화면으로 이동
        // DB에 저장된 email과 이름을 함께 전달합니다.
        console.log('신규 사용자입니다. UserInfo 화면으로 이동합니다.');
        navigation.navigate('UserInfo', { 
          email: data.email, 
          name: data.name 
        });
      } else {
        // 기존 사용자인 경우, 메인 화면으로 이동
        // TODO: 서버에서 받은 JWT 같은 사용자 토큰을 AsyncStorage에 저장해야 합니다.
        console.log('기존 사용자입니다. Main 화면으로 이동합니다.');
        navigation.navigate('Main');
      }

    } catch (error) {
      console.error('handleGoogleLogin에서 예외 발생:', error);
      Alert.alert('로그인 실패', error.message || '로그인 중 오류가 발생했습니다.');
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
        <Image 
          source={require('../assets/temp/logo4.jpg')} 
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
        onPress={() => {
          // TODO: 실제 로그인 로직 구현 필요
          // 현재는 임의로 Main 화면으로 이동 (테스트용)
          navigation.navigate('Main');
        }}
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
          
          <TouchableOpacity style={styles.snsButton} onPress={() => Alert.alert('카카오 로그인', '준비 중입니다.')}>
            <Image 
              source={require('../assets/temp/login_kakao.png')} 
              style={styles.snsIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.snsButton} onPress={handleGoogleLogin}>
            <Image 
              source={require('../assets/temp/login_google.png')} 
              style={styles.snsIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.snsButton} onPress={() => Alert.alert('네이버 로그인', '준비 중입니다.')}>
            <Image 
              source={require('../assets/temp/login_naver.png')} 
              style={styles.snsIcon}
              resizeMode="contain"
            />
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
  snsIcon: {
    width: 50,
    height: 50,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#555',
    marginHorizontal: 15,
  },
}); 

