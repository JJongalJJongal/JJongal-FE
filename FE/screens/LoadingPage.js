import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { BACKEND_URL } from '@env';

const LoadingPage = ({ navigation, route }) => {
  // route.params에서 code 받기
  const { code } = route.params || {};

  // 이미 가입한 유저일 시 : 메인 페이지로 이동
  const handleHome = () => {
    navigation.replace('Main');
  };

  // 처음 가입한 유저일 시 : 닉네임 설정 페이지로 이동
  const handleNickName = () => {
    navigation.replace('UserInfo');
  };

  const handleLoginPost = async (code) => {
    const data = {
      code: code,
    };
    
    try {
      const response = await fetch(`${BACKEND_URL}/oauth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok) {
        // 토큰 AsyncStorage에 저장 (React Native에서는 localStorage 대신 AsyncStorage 사용)
        const accessToken = result.accessToken;
        // AsyncStorage.setItem('bagtoken', accessToken); // AsyncStorage import 필요
        
        // 신규/기존 회원 여부에 따라 페이지 이동
        if (result.isExistingMember) {
          handleHome();
        } else {
          handleNickName();
        }
      } else {
        Alert.alert('로그인 실패', '로그인 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      Alert.alert('로그인 실패', '네트워크 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (code) {
      handleLoginPost(code);
    } else {
      Alert.alert('오류', '로그인 재시도하세요.');
    }
  }, [code]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FFED84" />
      <Text style={styles.loadingText}>로그인중입니다...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default LoadingPage;

