import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MainScreen() {
  const navigation = useNavigation();

  const handleCreateStory = () => {
    // TODO: 동화책 만들기 화면으로 이동
    console.log('동화책 만들기 버튼 클릭');
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
      {/* 메인 섹션 */}
      <View style={styles.mainSection}>
        <Text style={styles.appName}>쫑알쫑알</Text>
        
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>상상력을 펼쳐보세요!</Text>
          <Text style={styles.subtitle}>부기와 대화하며</Text>
          <Text style={styles.subtitle}>나만의 동화책을 만들어보세요</Text>
        </View>

        {/* 병아리 캐릭터들 */}
        <View style={styles.charactersContainer}>
          <View style={styles.characterRow}>
            <View style={styles.chickContainer}>
              <View style={styles.chick}>
                <Text style={styles.chickEmoji}>🐤</Text>
                <View style={styles.glasses}></View>
                <View style={styles.cheek}></View>
              </View>
            </View>
            
            <View style={styles.chickContainer}>
              <View style={styles.chick}>
                <Text style={styles.chickEmoji}>🐤</Text>
                <View style={styles.cheek}></View>
              </View>
              <View style={styles.speechBubble}>
                <Text style={styles.speechText}>오늘은 또 어떤 이야기를 만들어볼까?</Text>
              </View>
            </View>
          </View>
        </View>

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
              <Text style={styles.placeholderText}>토끼 동화</Text>
            </View>
            <View style={styles.storyInfo}>
              <Text style={styles.storyTitle}>토끼들의 모험</Text>
              <Text style={styles.storyDescription}>초록색 풀밭에서 펼쳐지는 이야기</Text>
            </View>
          </View>
          
          <View style={styles.storyCard}>
            <View style={styles.storyImage}>
              <Text style={styles.placeholderText}>공룡 동화</Text>
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
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>홈</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={handleLibrary}>
          <Text style={styles.navIcon}>📚</Text>
          <Text style={styles.navText}>책장</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={handleSettings}>
          <Text style={styles.navIcon}>⚙️</Text>
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
    backgroundColor: '#FFED84',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  appName: {
    fontSize: 16,
    color: '#666',
    alignSelf: 'flex-start',
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
  chick: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF9C4',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  chickEmoji: {
    fontSize: 30,
  },
  glasses: {
    position: 'absolute',
    top: 15,
    width: 20,
    height: 8,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
  },
  cheek: {
    position: 'absolute',
    bottom: 10,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#FFB6C1',
    borderRadius: 4,
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
    backgroundColor: '#FFED84',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#000',
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
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
    height: 120,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#000',
  },
}); 