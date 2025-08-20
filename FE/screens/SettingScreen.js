import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, StatusBar } from 'react-native';
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

  const handleProfile = () => {
    navigation.navigate('UserInfo', { mode: 'edit' });
  };

  const handleVoice = () => {
    navigation.navigate('Voice');
  };

  const menuItems = [
    { id: 1, title: '개인정보 변경', icon: require('../assets/temp/icon_profile.jpg'), onPress: handleProfile },
    { id: 2, title: '부기 음성 변경', icon: require('../assets/temp/icon_mike3.png'), onPress: handleVoice },
    { id: 3, title: '관심사 설정', icon: require('../assets/temp/icon_heart.jpg'), onPress: handleInterests },
    { id: 4, title: '구매 항목 및 멤버십', icon: require('../assets/temp/icon_card.jpg'), onPress: () => {} },
    { id: 5, title: '서비스 이용약관', icon: require('../assets/temp/icon_service.jpg'), onPress: () => {} },
    { id: 6, title: '앱 버전', icon: require('../assets/temp/icon_info.jpg'), onPress: () => {}, version: '1.0.0' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image source={require('../assets/temp/icon_back.png')} style={styles.backIconImage} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 프로필 섹션 */}
      <View style={styles.profileSection}>
        <View style={styles.profileContainer}>
          <View style={styles.character}>
            <Image source={require('../assets/temp/main1.jpg')} style={styles.characterImage} resizeMode="contain" />
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
              <Image source={item.icon} style={styles.menuImageIcon} resizeMode="contain" />
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
          <Image 
            source={require('../assets/temp/icon_home.jpg')} 
            style={styles.navIcon}
            resizeMode="contain"
          />
          <Text style={styles.navText}>홈</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={handleLibrary}>
          <Image 
            source={require('../assets/temp/icon_book.jpg')} 
            style={styles.navIcon}
            resizeMode="contain"
          />
          <Text style={styles.navText}>책장</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Image 
            source={require('../assets/temp/icon_setting2.jpg')} 
            style={styles.navIcon}
            resizeMode="contain"
          />
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
    backgroundColor: '#FFF1A1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
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
  backIconImage: {
    width: 24,
    height: 24,
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
    overflow: 'hidden',
  },
  characterImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
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
  menuImageIcon: {
    width: 24,
    height: 24,
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
    width: 24,
    height: 24,
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