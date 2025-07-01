import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function PolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>개인정보 처리방침</Text>

      <Text style={styles.paragraph}>
        꼬꼬북은 사용자 정보를 안전하게 보호하기 위해 다음과 같은 정책을 따릅니다.
      </Text>

      <Text style={styles.heading}>1. 수집하는 항목</Text>
      <Text style={styles.paragraph}>
        - 이름, 이메일, 나이, 관심사 등 회원가입 시 입력한 정보
      </Text>

      <Text style={styles.heading}>2. 이용 목적</Text>
      <Text style={styles.paragraph}>
        - 동화 맞춤 추천, 콘텐츠 개인화, 서비스 개선
      </Text>

      <Text style={styles.heading}>3. 보관 기간</Text>
      <Text style={styles.paragraph}>
        - 회원 탈퇴 시 모든 정보는 즉시 삭제됩니다.
      </Text>

      <Text style={styles.footer}>최종 업데이트: 2025년 5월</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  heading: {
    fontWeight: 'bold',
    marginTop: 16,
    fontSize: 16,
  },
  paragraph: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    marginTop: 32,
    fontSize: 12,
    color: '#999',
  },
});