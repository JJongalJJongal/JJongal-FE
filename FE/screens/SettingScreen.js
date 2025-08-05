import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SettingScreen() {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleHome = () => {
    navigation.navigate('Main');
  };

  const handleLibrary = () => {
    navigation.navigate('BookShelf');
  };

  const handleInterests = () => {
    navigation.navigate('Like');
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => {
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  const handleWithdraw = () => {
    Alert.alert(
      '회원탈퇴',
      '정말 회원탈퇴 하시겠습니까?\n탈퇴 시 모든 데이터가 삭제됩니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '탈퇴',
          style: 'destructive',
          onPress: () => {
            navigation.navigate('Login');
          },
        },
      ]
    );
  };

  const menuItems = [
    { id: 1, title: '개인정보 변경', icon: '👤', onPress: () => console.log('개인정보 변경') },
    { id: 2, title: '부기 음성 변경', icon: '🎤', onPress: () => console.log('부기 음성 변경') },
    { id: 3, title: '관심사 설정', icon: '❤️', onPress: handleInterests },
    { id: 4, title: '구매 항목 및 멤버십', icon: '💎', onPress: () => console.log('구매 항목') },
    { id: 5, title: '서비스 이용약관', icon: '📄', onPress: () => console.log('이용약관') },
    { id: 6, title: '앱 버전', icon: 'ℹ️', onPress: () => console.log('앱 버전'), version: '1.0.0' },
  ];

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 프로필 섹션 */}
      <View style={styles.profileSection}>
        <View style={styles.profileContainer}>
          <View style={styles.character}>
            <Text style={styles.characterEmoji}>🐤</Text>
            <View style={styles.characterGlasses}></View>
            <View style={styles.characterCheek}></View>
            <View style={styles.characterBook}></View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>김삐삐</Text>
            <Text style={styles.userEmail}>user@example.com</Text>
          </View>
        </View>
      </View>

      {/* 메뉴 목록 */}
      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuLeft}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            <View style={styles.menuRight}>
              {item.version && <Text style={styles.versionText}>{item.version}</Text>}
              <Text style={styles.arrowIcon}>›</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* 로그아웃 및 회원탈퇴 */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
            <Text style={styles.withdrawText}>회원탈퇴</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 하단 네비게이션 */}
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navItem} onPress={handleHome}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>홈</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={handleLibrary}>
          <Text style={styles.navIcon}>📚</Text>
          <Text style={styles.navText}>책장</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={[styles.navIcon, styles.activeNavIcon]}>⚙️</Text>
          <Text style={[styles.navText, styles.activeNavText]}>설정</Text>
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
  header: {
    backgroundColor: '#FFED84',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 20,
    color: '#000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 36,
  },
  profileSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  character: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF9C4',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginRight: 15,
  },
  characterEmoji: {
    fontSize: 30,
  },
  characterGlasses: {
    position: 'absolute',
    top: 15,
    width: 24,
    height: 10,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 5,
  },
  characterCheek: {
    position: 'absolute',
    bottom: 10,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#FFB6C1',
    borderRadius: 4,
  },
  characterBook: {
    position: 'absolute',
    bottom: 25,
    left: 8,
    width: 12,
    height: 15,
    backgroundColor: '#87CEEB',
    borderRadius: 2,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    color: '#000',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#999',
  },
  logoutSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  logoutButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#666',
  },
  withdrawButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  withdrawText: {
    fontSize: 16,
    color: '#FF0000',
  },
  navigationBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    color: '#999',
  },
  activeNavIcon: {
    color: '#333',
  },
  navText: {
    fontSize: 12,
    color: '#999',
  },
  activeNavText: {
    color: '#333',
    fontWeight: 'bold',
  },
}); 