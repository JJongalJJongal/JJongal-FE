// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import UserInfoScreen from './screens/UserInfoScreen';
import UserInfo2Screen from './screens/UserInfoScreen2';
import MainScreen from './screens/MainScreen';
import SettingScreen from './screens/SettingScreen';
import MakeStoryScreen from './screens/MakeStoryScreen';
import MakeStoryScreen2 from './screens/MakeStoryScreen2';
import AnswerScreen from './screens/AnswerScreen';
import StoryPartialScreen from './screens/StoryPartialScreen';
import StorySuccessScreen from './screens/StorySuccessScreen';
import BookShelfScreen from './screens/BookShelfScreen';
import MembershipScreen from './screens/MembershipScreen';
import PolicyScreen from './screens/PolicyScreen';
import TermsScreen from './screens/TermsScreen';
import { GOOGLE_WEB_CLIENT_ID } from '@env';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    console.log('✅ GOOGLE_WEB_CLIENT_ID:', GOOGLE_WEB_CLIENT_ID); // 👈 추가해보세요!
    // GoogleSignin.configure({
    //   webClientId: '', // 임시로 빈 값
    //   offlineAccess: true,
    // });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Main">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="UserInfo" component={UserInfoScreen} />
        <Stack.Screen name="UserInfo2" component={UserInfo2Screen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Setting" component={SettingScreen} />
        <Stack.Screen name="MakeStory" component={MakeStoryScreen} />
        <Stack.Screen name="MakeStory2" component={MakeStoryScreen2} />
        <Stack.Screen name="Answer" component={AnswerScreen} />
        <Stack.Screen name="StoryPartial" component={StoryPartialScreen} />
        <Stack.Screen name="StorySuccess" component={StorySuccessScreen} />
        <Stack.Screen name="BookShelf" component={BookShelfScreen} />
        <Stack.Screen name="Membership" component={MembershipScreen} />
        <Stack.Screen name="Policy" component={PolicyScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}