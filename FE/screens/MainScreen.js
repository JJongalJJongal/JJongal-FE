import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ImageBackground, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MainScreen() {
  const navigation = useNavigation();

  const handleCreateStory = () => {
    // AITalk 화면으로 이동
    navigation.navigate('Talk1');
  };

  const handleViewMore = () => {
    // TODO: 동화책 둘러보기 화면으로 이동
    console.log('더보기 버튼 클릭');
  };

  const handleLibrary = () => {
    // BookShelf 화면으로 이동
    navigation.navigate('BookShelf');
  };

  const handleSettings = () => {
    // Setting 화면으로 이동
    navigation.navigate('Setting');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />
      {/* 메인 섹션 */}
      <View style={styles.mainSection}>
        <View style={styles.topGap} />
        <ImageBackground 
          source={require('../assets/temp/s_home.png')} 
          style={styles.homeBackground}
          resizeMode="cover"
        />

        {/* 동화책 만들기 버튼 */}
        <TouchableOpacity style={styles.createButton} onPress={handleCreateStory}>
          <Text style={styles.createButtonText}>동화책 만들러 가기</Text>
        </TouchableOpacity>
      </View>

      {/* 동화책 둘러보기 섹션 */}
      <View style={styles.storySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>동화책 둘러보기</Text>
          <TouchableOpacity onPress={handleViewMore}>
            <Text style={styles.moreText}>더보기</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storyScroll}>
          <View style={styles.storyCard}>
            <View style={styles.storyImage}>
              <Image
                source={require('../assets/temp/s_example1.png')}
                style={styles.storyThumbnailImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.storyInfo}>
              <Text style={styles.storyTitle}>토끼들의 모험</Text>
              <Text style={styles.storyDescription}>초록색 풀밭에서 펼쳐지는 이야기</Text>
            </View>
          </View>
          
          <View style={styles.storyCard}>
            <View style={styles.storyImage}>
              <Image
                source={require('../assets/temp/s_example2.png')}
                style={styles.storyThumbnailImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.storyInfo}>
              <Text style={styles.storyTitle}>공룡 친구들</Text>
              <Text style={styles.storyDescription}>신기한 공룡 세계로의 여행</Text>
            </View>
          </View>
          
          <View style={styles.storyCard}>
            <View style={styles.storyImage}>
              <Text style={styles.placeholderText}>우주 동화</Text>
            </View>
            <View style={styles.storyInfo}>
              <Text style={styles.storyTitle}>우주 탐험</Text>
              <Text style={styles.storyDescription}>별들 사이를 떠나는 모험</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* 하단 네비게이션 */}
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navItem}>
          <Image 
            source={require('../assets/temp/icon_home2.jpg')} 
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
        
        <TouchableOpacity style={styles.navItem} onPress={handleSettings}>
          <Image 
            source={require('../assets/temp/icon_setting.jpg')} 
            style={styles.navIcon}
            resizeMode="contain"
          />
          <Text style={styles.navText}>설정</Text>
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
  mainSection: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 0,
    alignItems: 'stretch',
    width: '100%',
    position: 'relative',
  },
  topGap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: '#FFF1A1',
  },
  appName: {
    fontSize: 16,
    color: '#666',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  appLogo: {
    width: 100,
    height: 50,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  homeBackground: {
    width: '100%',
    height: 360,
    marginBottom: 20,
    alignSelf: 'stretch',
  },
  homeImage: {
    width: '100%',
    height: 240,
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  charactersContainer: {
    marginBottom: 30,
  },
  characterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
  },
  chickContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  chickImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  chickEmoji: {
    fontSize: 30,
  },
  speechBubble: {
    position: 'absolute',
    top: -40,
    right: -20,
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: 120,
  },
  speechText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#FFF1A1',
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderRadius: 15,
    borderWidth: 0,
    marginHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  storySection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  moreText: {
    fontSize: 14,
    color: '#666',
  },
  storyScroll: {
    flex: 1,
  },
  storyCard: {
    width: 200,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  storyImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyThumbnailImage: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
  },
  storyInfo: {
    padding: 12,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  storyDescription: {
    fontSize: 12,
    color: '#666',
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
  },
  navText: {
    fontSize: 12,
    color: '#000',
  },
}); 