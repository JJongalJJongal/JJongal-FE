import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MainScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F8F6' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
        {/* 상단 로고 영역 */}
        <View style={styles.headerSection}>
          <View style={styles.logoRow}>
            <Image source={require('../assets/boook.png')} style={styles.logoImg} />
            <Text style={styles.logoText}>CoCoBook</Text>
          </View>
        </View>

        {/* 캐릭터+말풍선+버튼 포함 연두색 사각형 */}
        <View style={styles.heroSectionTall}>
          <View style={styles.heroRowTall}>
            <Image
              source={require('../assets/op_PRboogi-removebg.png')}
              style={styles.characterFlippedLarge}
            />
            <View style={styles.speechBubbleWrapRowLarge}>
              <View style={styles.speechBubbleSquare}>
                <Text style={styles.speechTextSquare}>오늘은 또{`\n`}어떤 이야기를 만들까??</Text>
              </View>
              <View style={styles.speechTailRowLarge} />
            </View>
          </View>
          <Text style={styles.heroTitle}>상상력을 펼쳐보세요!</Text>
          <Text style={styles.heroSub}>부기와 대화하며{`\n`}나만의 동화책을 만들어보세요</Text>
          <TouchableOpacity style={styles.storyButton} onPress={() => navigation.navigate('MakeStory')}>
            <Text style={styles.storyButtonText}>동화 만들러 가기</Text>
          </TouchableOpacity>
        </View>

        {/* 동화책 둘러보기 */}
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>동화책 둘러보기</Text>
          <TouchableOpacity
            style={styles.bookPreview}
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <Image source={require('../assets/example.png')} style={styles.bookImage} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 언더바 네비게이션 (연두색 원 배경 제거) */}
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
    paddingHorizontal: 0,
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
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B6B2F',
    fontFamily: 'sans-serif-medium',
  },
  heroSectionTall: {
    backgroundColor: '#E6F3D2',
    paddingTop: 32,
    paddingBottom: 48,
    paddingHorizontal: 12,
    alignItems: 'center',
    minHeight: 520,
    justifyContent: 'flex-start',
  },
  heroRowTall: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 8,
    marginTop: 0,
    justifyContent: 'flex-start',
  },
  characterFlippedLarge: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    transform: [{ scaleX: -1 }],
    marginLeft: 0,
    marginRight: 18,
    marginTop: 10,
  },
  speechBubbleWrapRowLarge: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 8,
    position: 'relative',
  },
  speechBubbleSquare: {
    backgroundColor: '#fff',
    borderColor: '#4B6B2F',
    borderWidth: 4,
    borderRadius: 18,
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  speechTextSquare: {
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 24,
  },
  speechTailRowLarge: {
    width: 0,
    height: 0,
    borderTopWidth: 14,
    borderBottomWidth: 14,
    borderRightWidth: 18,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#4B6B2F',
    position: 'absolute',
    left: -18,
    top: '50%',
    transform: [{ translateY: -60 }],
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#222',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 15,
    textAlign: 'center',
    color: '#888',
    marginBottom: 18,
    marginTop: 10,
    lineHeight: 20,
  },
  storyButton: {
    backgroundColor: '#9ACA70',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 0,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  storyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 24,
    letterSpacing: 1,
  },
  previewSection: {
    backgroundColor: '#fff',
    paddingTop: 18,
    paddingBottom: 24,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#4B6B2F',
    marginLeft: 18,
    marginBottom: 8,
    marginTop: 0,
  },
  bookPreview: {
    alignItems: 'center',
    marginBottom: 0,
  },
  bookImage: {
    width: 320,
    height: 160,
    borderRadius: 16,
    resizeMode: 'cover',
    backgroundColor: '#e0e0e0',
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