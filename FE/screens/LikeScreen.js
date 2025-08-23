import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LikeScreen() {
  const navigation = useNavigation();

  const [selectedInterests, setSelectedInterests] = useState(['공룡']);
  const [customInterest, setCustomInterest] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const interests = [
    ['공룡', '공주', '요정', '자동차', '로봇', '레고'],
    ['우주', '바다', '동물', '곤충', '마법사', '외계인'],
    ['인형', '유령', '물고기', '꿈나라', '마법학교', '얼음나라']
  ];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else {
      if (selectedInterests.length >= 5) {
        Alert.alert('최대 5개까지 선택할 수 있어요!');
        return;
      }
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleComplete = () => {
    if (selectedInterests.length === 0) {
      Alert.alert('선택 오류', '관심사를 하나 이상 선택해주세요.');
      return;
    }
    // MainScreen으로 이동
    navigation.navigate('Main');
  };

  const handleCustomInterest = () => {
    if (customInterest.trim()) {
      if (selectedInterests.length >= 5) {
        Alert.alert('최대 5개까지 선택할 수 있어요!');
        return;
      }
      setSelectedInterests([...selectedInterests, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const nextPage = () => {
    if (currentPage < interests.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF1A1" />
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>관심사를 선택해주세요</Text>
      </View>

      {/* 구분선 */}
      <View style={styles.separator} />

      {/* 관심사 선택 영역 */}
      <View style={styles.content}>
        <View style={styles.interestsGrid}>
          {interests[currentPage].map((interest, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.interestButton,
                selectedInterests.includes(interest) && styles.interestButtonSelected
              ]}
              onPress={() => toggleInterest(interest)}
            >
              <Text style={[
                styles.interestButtonText,
                selectedInterests.includes(interest) && styles.interestButtonTextSelected
              ]}>
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 페이지네이션 */}
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={[styles.paginationButton, currentPage === 0 && styles.paginationButtonDisabled]}
            onPress={prevPage}
            disabled={currentPage === 0}
          >
            <Image 
              source={require('../assets/temp/icon_left.jpg')} 
              style={styles.paginationIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.paginationButton, currentPage === interests.length - 1 && styles.paginationButtonDisabled]}
            onPress={nextPage}
            disabled={currentPage === interests.length - 1}
          >
            <Image 
              source={require('../assets/temp/icon_right.jpg')} 
              style={styles.paginationIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* 직접 입력 필드 */}
        <View style={styles.customInputContainer}>
          <TextInput
            style={styles.customInput}
            placeholder="직접 입력하기"
            placeholderTextColor="#999"
            value={customInterest}
            onChangeText={setCustomInterest}
            onSubmitEditing={handleCustomInterest}
          />
        </View>
      </View>

      {/* 완료 버튼 */}
      <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
        <Text style={styles.completeButtonText}>완료</Text>
      </TouchableOpacity>
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
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  interestButton: {
    width: '48%',
    height: 60,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  interestButtonSelected: {
    backgroundColor: '#FFF8D1',
    borderColor: '#FFF1A1',
  },
  interestButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  interestButtonTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  paginationButton: {
    width: 70,
    height: 70,
    borderWidth: 0,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  paginationButtonDisabled: {
    borderColor: '#E0E0E0',
    opacity: 0.5,
  },
  paginationIcon: {
    width: 35,
    height: 35,
  },
  customInputContainer: {
    marginBottom: 30,
  },
  customInput: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: '#FFF1A1',
    marginHorizontal: 24,
    marginBottom: 30,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
}); 