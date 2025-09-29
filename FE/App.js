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
import StoryLoadingScreen from './screens/StoryLoadingScreen';
import MakeStory1 from './screens/MakeStory1';
import MakeStory2 from './screens/MakeStory2';
import MakeStory3 from './screens/MakeStory3';
import MakeStory4 from './screens/MakeStory4';
import MakeStory5 from './screens/MakeStory5';
import MakeStory6 from './screens/MakeStory6';
import MakeStory7 from './screens/MakeStory7';




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
        <Stack.Screen name="StoryLoadingScreen" component={StoryLoadingScreen} />
        <Stack.Screen name="MakeStory1" component={MakeStory1} />
        <Stack.Screen name="MakeStory2" component={MakeStory2} />
        <Stack.Screen name="MakeStory3" component={MakeStory3} />
        <Stack.Screen name="MakeStory4" component={MakeStory4} />
        <Stack.Screen name="MakeStory5" component={MakeStory5} />
        <Stack.Screen name="MakeStory6" component={MakeStory6} />
        <Stack.Screen name="MakeStory7" component={MakeStory7} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}