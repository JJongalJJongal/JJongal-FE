// screens/BookSelfScreen.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BOOKS = [
  // 예시: 책이 없으면 빈 배열, 있으면 아래처럼 채움
  // { id: '1', title: '신데렐라', cover: require('../assets/cinderella.png') },
  // { id: '2', title: '신데렐라', cover: require('../assets/cinderella.png') },
  // ...
];

export default function BookShelfScreen() {
  const navigation = useNavigation();
  const books = BOOKS; // 실제로는 props, state, redux 등에서 받아올 수 있음

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image source={require('../assets/boook.png')} style={styles.emptyBookIcon} />
      <Text style={styles.emptyText}>아직 동화책이 없어요</Text>
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('MakeStory')}>
        <Text style={styles.createButtonText}>동화 만들러 가기</Text>
      </TouchableOpacity>
    </View>
  );

  const renderBook = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={item.cover} style={styles.bookCover} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F8F6' }}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>나의 책장</Text>
      </View>
      <View style={styles.shelfSection}>
        {books.length === 0 ? (
          renderEmpty()
        ) : (
          <FlatList
            data={books}
            renderItem={renderBook}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.booksGrid}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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

const { width } = Dimensions.get('window');
const BOOK_SIZE = (width - 64) / 2;

const styles = StyleSheet.create({
  headerSection: {
    backgroundColor: '#E6F3D2',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 0,
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B6B2F',
    fontFamily: 'sans-serif-medium',
    marginLeft: 16,
  },
  shelfSection: {
    flex: 1,
    backgroundColor: '#E6F3D2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '30%',
  },
  emptyBookIcon: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginTop: 0,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 20,
    color: '#4B6B2F',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#fff',
    borderColor: '#4B6B2F',
    borderWidth: 3,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#4B6B2F',
    fontWeight: 'bold',
    fontSize: 18,
  },
  booksGrid: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  bookItem: {
    width: BOOK_SIZE,
    height: BOOK_SIZE * 1.3,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  bookCover: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#A4CD74',
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