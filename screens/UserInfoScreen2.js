import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ArrowImg from '../assets/arrow.png';

export default function UserInfo2Screen() {
  const navigation = useNavigation();
  const route = useRoute();
  const from = route.params?.from || 'Main'; // 기본값 Main

  const categories = [
    '왕자', '공주',
    '요정', '자동차',
    '로봇', '외계인',
    '동물', '곤충',
    '공룡', '마법사',
    '우주', '바다',
    '인형', '유령',
    '물고기', '꿈나라',
    '마법학교', '얼음나라',
  ];

  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelect = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      if (selectedItems.length >= 5) {
        Alert.alert('최대 5개까지 선택할 수 있어요!');
        return;
      }
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleNext = () => {
    if (selectedItems.length < 1) {
      Alert.alert('관심사를 하나 이상 선택해주세요.');
      return;
    }
    
    // from 파라미터에 따라 다른 화면으로 이동
    switch (from) {
      case 'Setting':
        navigation.navigate('Setting');
        break;
      case 'UserInfo':
        navigation.navigate('Main');
        break;
      default:
        navigation.navigate('Main');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.itemButton,
        selectedItems.includes(item) && styles.itemButtonSelected
      ]}
      onPress={() => toggleSelect(item)}
    >
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>관심사를 선택해주세요 (1~5개)</Text>

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item, index) => item + index}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Image source={ArrowImg} style={{ width: 64, height: 64, transform: [{ rotate: '0deg' }], resizeMode: 'contain' }} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.prevButton} onPress={() => navigation.navigate('UserInfo')}>
        <Image source={ArrowImg} style={{ width: 64, height: 64, transform: [{ rotate: '180deg' }], resizeMode: 'contain' }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f472f',
    marginTop: 32,
    marginBottom: 24,
    textAlign: 'center',
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  itemButton: {
    backgroundColor: '#e3f3c4',
    borderRadius: 16,
    width: '48%',
    paddingVertical: 28,
    alignItems: 'center',
  },
  itemButtonSelected: {
    backgroundColor: '#fdf6cc',
  },
  itemText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2f472f',
  },
  nextButton: {
    position: 'absolute',
    bottom: 36,
    right: 24,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    position: 'absolute',
    bottom: 36,
    left: 24,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
});