// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import LoadingPage from './screens/LoadingPage';
import UserInfoScreen from './screens/UserInfoScreen';
import UserInfo2Screen from './screens/UserInfoScreen2';
import LikeScreen from './screens/LikeScreen';
import MainScreen from './screens/MainScreen';
import BookShelfScreen from './screens/BookShelfScreen';
import SettingScreen from './screens/SettingScreen';
import AITalkScreen from './screens/AITalkScreen';


const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="LoadingPage" component={LoadingPage} />
        <Stack.Screen name="UserInfo" component={UserInfoScreen} />
        <Stack.Screen name="UserInfo2" component={UserInfo2Screen} />
        <Stack.Screen name="Like" component={LikeScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="BookShelf" component={BookShelfScreen} />
        <Stack.Screen name="Setting" component={SettingScreen} />
        <Stack.Screen name="AITalk" component={AITalkScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}