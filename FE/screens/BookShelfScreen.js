import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BookShelfScreen() {
  const navigation = useNavigation();
  
  // 동화책 목록 상태 (나중에 실제 데이터로 교체)
  const [stories, setStories] = useState([
    {
      id: 1,
      title: '루미와 친구 이야기',
      date: '2025.07.03',
      description: '루미는 아라의 첫 친구가 되었다. 둘은 금방 친해져 함께 다닌다. 루미는 아라에게 학교를 소개한...',
      thumbnail: 'placeholder1'
    },
    {
      id: 2,
      title: '우주 탐험대',
      date: '2025.07.02',
      description: '우주선을 타고 별들을 탐험하는 모험 이야기. 새로운 행성을 발견하고 친구들을 만나게 된다...',
      thumbnail: 'placeholder2'
    },
    {
      id: 3,
      title: '마법학교 첫날',
      date: '2025.07.01',
      description: '마법학교에 입학한 주인공의 첫날 이야기. 신기한 마법들과 새로운 친구들을 만나게 된다...',
      thumbnail: 'placeholder3'
    },
    {
      id: 4,
      title: '바다 속 모험',
      date: '2025.06.30',
      description: '깊은 바다 속으로 들어가 물고기들과 친구가 되는 이야기. 아름다운 산호초와 신비로운 바다 생물들을 만난다...',
      thumbnail: 'placeholder4'
    },
    {
      id: 5,
      title: '공룡 친구들',
      date: '2025.06.29',
      description: '공룡 시대로 시간 여행을 가서 공룡들과 친구가 되는 이야기. 티렉스와 브라키오사우루스와 함께 모험을 떠난다...',
      thumbnail: 'placeholder5'
    }
  ]);

  // 빈 책장 상태인지 확인 (테스트용으로 stories 배열을 비우면 됨)
  const isEmpty = stories.length === 0;

  const handleCreateStory = () => {
    // TODO: 동화책 만들기 화면으로 이동
    console.log('동화책 만들기 버튼 클릭');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleDelete = () => {
    // TODO: 삭제 기능 구현
    console.log('삭제 버튼 클릭');
  };

  const handleOpenStory = (story) => {
    navigation.navigate('StoryDetail', { storyId: story.id, title: story.title });
  };

  const handlePlayStory = (storyId) => {
    // TODO: 동화 재생 기능
    console.log('동화 재생:', storyId);
  };

  const handleHome = () => {
    navigation.navigate('Main');
  };

  const handleSettings = () => {
    // Setting 화면으로 이동
    navigation.navigate('Setting');
  };

  // 빈 책장 화면
  if (isEmpty) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Image source={require('../assets/temp/icon_back.png')} style={styles.backIconImage} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>나의 책장</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Image
              source={require('../assets/temp/icon_trash.png')}
              style={styles.deleteIconImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* 빈 책장 콘텐츠 */}
        <View style={styles.emptyContent}>
          {/* 캐릭터 위치 (나중에 이미지로 교체) */}
          <View style={styles.characterContainer}>
            <View style={styles.character}>
              <Text style={styles.characterEmoji}>🐤</Text>
              <View style={styles.characterGlasses}></View>
              <View style={styles.characterCheek}></View>
              <View style={styles.characterSuspender}></View>
              <View style={styles.questionMarks}>
                <Text style={styles.questionMark}>❓</Text>
                <Text style={styles.questionMark}>❓</Text>
              </View>
            </View>
          </View>

          <Text style={styles.emptyText}>아직 동화책이 없어요!</Text>
          
          <TouchableOpacity style={styles.createButton} onPress={handleCreateStory}>
            <Text style={styles.createButtonText}>동화책 만들러 가기</Text>
          </TouchableOpacity>
        </View>

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
          
          <TouchableOpacity style={styles.navItem}>
            <Image 
              source={require('../assets/temp/icon_book2.jpg')} 
              style={styles.navIcon}
              resizeMode="contain"
            />
            <Text style={[styles.navText, styles.activeNavText]}>책장</Text>
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

  // 동화책 목록 화면
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image source={require('../assets/temp/icon_back.png')} style={styles.backIconImage} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>나의 책장</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Image 
            source={require('../assets/temp/icon_trash.png')} 
            style={styles.deleteIconImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 동화책 목록 */}
      <ScrollView style={styles.storyList} showsVerticalScrollIndicator={false}>
        {stories.map((story, index) => (
          <TouchableOpacity key={story.id} style={styles.storyCard} onPress={() => handleOpenStory(story)} activeOpacity={0.8}>
            <View style={styles.storyThumbnail}>
              <Image
                source={
                  index === 0 ? require('../assets/temp/lumi.png') :
                  index === 1 ? require('../assets/temp/space.png') :
                  index === 2 ? require('../assets/temp/magic.png') :
                  index === 3 ? require('../assets/temp/ocean.png') :
                  require('../assets/temp/s_example2.png')
                }
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            </View>
            
            <View style={styles.storyInfo}>
              <Text style={styles.storyTitle}>[{story.title}]</Text>
              <Text style={styles.storyDate}>{story.date}</Text>
              <Text style={styles.storyDescription}>{story.description}</Text>
            </View>
            
            <View style={styles.goButtonContainer}>
              <Image 
                source={require('../assets/temp/icon_go.png')} 
                style={styles.goIcon}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        ))}
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
        
        <TouchableOpacity style={styles.navItem}>
          <Image 
            source={require('../assets/temp/icon_book2.jpg')} 
            style={styles.navIcon}
            resizeMode="contain"
          />
          <Text style={[styles.navText, styles.activeNavText]}>책장</Text>
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
  header: {
    backgroundColor: '#FFF1A1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
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
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 20,
  },
  deleteIconImage: {
    width: 36,
    height: 36,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  characterContainer: {
    marginBottom: 30,
  },
  character: {
    width: 120,
    height: 120,
    backgroundColor: '#FFF9C4',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  characterEmoji: {
    fontSize: 50,
  },
  characterGlasses: {
    position: 'absolute',
    top: 25,
    width: 40,
    height: 15,
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 8,
  },
  characterCheek: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    width: 12,
    height: 12,
    backgroundColor: '#FFB6C1',
    borderRadius: 6,
  },
  characterSuspender: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    width: 20,
    height: 30,
    backgroundColor: '#87CEEB',
    borderRadius: 10,
  },
  questionMarks: {
    position: 'absolute',
    top: -20,
    left: -10,
    flexDirection: 'row',
  },
  questionMark: {
    fontSize: 20,
    color: '#FFF1A1',
    marginHorizontal: 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: '#FFF1A1',
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
  storyList: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  storyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  storyThumbnail: {
    width: 80,
    height: 80,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  storyInfo: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  storyDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  storyDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  goIcon: {
    width: 24,
    height: 24,
  },
  goButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#FFF1A1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    alignSelf: 'flex-start',
    marginTop: 8,
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
    width: 24, // Adjust as needed for image size
    height: 24, // Adjust as needed for image size
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
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
}); 