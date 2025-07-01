import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>서비스 이용약관</Text>

      <Text style={styles.paragraph}>
        본 약관은 꼬꼬북 서비스를 이용함에 있어 회사와 이용자 간의 권리, 의무 및 책임사항을 규정합니다.
      </Text>

      <Text style={styles.heading}>제1조 (목적)</Text>
      <Text style={styles.paragraph}>
        이 약관은 꼬꼬북이 제공하는 모든 서비스의 이용 조건 및 절차, 회사와 회원의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
      </Text>

      <Text style={styles.heading}>제2조 (정의)</Text>
      <Text style={styles.paragraph}>
        "회원"이란 본 약관에 따라 서비스를 이용하는 자를 말합니다.
      </Text>

      <Text style={styles.heading}>제3조 (서비스의 제공 및 변경)</Text>
      <Text style={styles.paragraph}>
        회사는 회원에게 동화 생성, 열람, 저장 등 다양한 기능을 제공합니다. 회사는 필요 시 서비스의 일부를 변경하거나 중단할 수 있습니다.
      </Text>

      <Text style={styles.heading}>제4조 (회원의 의무)</Text>
      <Text style={styles.paragraph}>
        회원은 서비스를 이용함에 있어 다음 행위를 하여서는 안 됩니다:
        {'\n'}- 타인의 정보 도용
        {'\n'}- 서비스 운영 방해
        {'\n'}- 음란/불법 콘텐츠 업로드 등
      </Text>

      <Text style={styles.heading}>제5조 (계약 해지)</Text>
      <Text style={styles.paragraph}>
        회원은 언제든지 회원 탈퇴를 요청할 수 있으며, 회사는 관련 법령을 따릅니다.
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