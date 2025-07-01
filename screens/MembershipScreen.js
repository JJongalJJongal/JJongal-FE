import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MembershipScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>구매 항목 및 멤버십</Text>

        <View style={styles.card}>
          <Text style={styles.itemTitle}>프리미엄 멤버십</Text>
          <Text style={styles.description}>· 동화 무제한 생성</Text>
          <Text style={styles.description}>· 광고 제거</Text>
          <Text style={styles.description}>· 월 ₩4,900</Text>
          <Text style={styles.status}>활성화됨</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.itemTitle}>AI 음성 추가</Text>
          <Text style={styles.description}>· 동화에 맞춘 음성 읽기</Text>
          <Text style={styles.description}>· ₩1,000 / 회</Text>
          <Text style={styles.status}>미사용</Text>
        </View>
      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('UserInfo2', { from: 'Setting' })}>
          <Image source={require('../assets/icon_heart.png')} style={styles.navIconImage} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Image source={require('../assets/icon_home.png')} style={styles.navIconImage} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
          <Image source={require('../assets/icon_setting.png')} style={styles.navIconImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 4,
  },
  status: {
    marginTop: 8,
    fontWeight: '600',
    color: '#2f472f',
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fffce8',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  navIconImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  }
});