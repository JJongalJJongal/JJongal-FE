import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SettingScreen() {
  const navigation = useNavigation();
  // 예시 프로필 정보
  const profile = {
    name: '김꼬북',
    email: 'moonsojung518@gmail.com',
    avatar: require('../assets/profile.png'), // 없으면 기본 아이콘
  };

  // 메뉴 항목 데이터
  const menuItems = [
    { icon: '👤', label: '개인정보 변경', onPress: () => navigation.navigate('UserInfo') },
    { icon: '❤️', label: '관심사 설정', onPress: () => navigation.navigate('UserInfo2') },
    { icon: '⭐', label: '구매 항목 및 멤버십', onPress: () => {} },
    { icon: '🛡️', label: '개인정보 처리방침', onPress: () => {} },
    { icon: '📃', label: '서비스 이용약관', onPress: () => {} },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F8F6' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
        {/* 상단 로고/타이틀 */}
        <View style={styles.headerSection}>
          <View style={styles.logoRow}>
            <Image source={require('../assets/boook.png')} style={styles.logoImg} />
            <Text style={styles.headerTitle}>내 계정</Text>
          </View>
        </View>

        {/* 프로필 영역 (왼쪽 사진만) */}
        <View style={styles.profileSection}>
          <Image source={profile.avatar} style={styles.profileAvatar} />
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </View>
        </View>

        {/* 메뉴 리스트 */}
        <View style={styles.menuSection}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity key={item.label} style={styles.menuItem} onPress={item.onPress} activeOpacity={0.7}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 앱 버전/로그아웃/회원탈퇴 (오른쪽 사진 참고) */}
        <View style={styles.bottomSection}>
          <View style={styles.versionRow}>
            <Text style={styles.menuIcon}>{'ℹ️'}</Text>
            <View>
              <Text style={styles.menuText}>앱 버전</Text>
              <Text style={styles.versionText}>1.0.6</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn}><Text style={styles.logoutText}>로그아웃</Text></TouchableOpacity>
          <TouchableOpacity style={styles.withdrawBtn}><Text style={styles.withdrawText}>회원탈퇴</Text></TouchableOpacity>
        </View>
      </ScrollView>
      {/* 언더바 네비게이션 */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('BookShelf')}>
          <Image source={require('../assets/icon_heart.png')} style={styles.iconXLarge} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Main')}>
          <Image source={require('../assets/icon_home.png')} style={styles.iconXLarge} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Setting')}>
          <Image source={require('../assets/icon_setting.png')} style={styles.iconXLarge} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 0,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  logoImg: {
    width: 36,
    height: 36,
    marginRight: 8,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'sans-serif-medium',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 0,
    paddingVertical: 24,
    paddingLeft: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F7F8F6',
    resizeMode: 'contain',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: '#888',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginTop: 0,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingLeft: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuIcon: {
    fontSize: 28,
    color: '#222',
    fontWeight: 'bold',
    marginRight: 28,
  },
  menuText: {
    fontSize: 18,
    color: '#222',
    fontWeight: 'bold',
  },
  bottomSection: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingLeft: 32,
    borderTopWidth: 0,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  versionText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 2,
  },
  logoutBtn: {
    marginTop: 8,
  },
  logoutText: {
    color: '#888',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  withdrawBtn: {
    marginTop: 2,
  },
  withdrawText: {
    color: '#888',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E4F4C9',
    backgroundColor: '#fff',
    height: 70,
    alignItems: 'center',
    paddingBottom: 0,
    paddingTop: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconXLarge: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});