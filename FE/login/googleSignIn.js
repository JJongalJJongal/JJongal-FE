import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '@env';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const userInfo = await GoogleSignin.signIn();
    return {
      success: true,
      userInfo,
      idToken: userInfo.idToken,
      serverAuthCode: userInfo.serverAuthCode,
    };
  } catch (error) {
    console.error('Google 로그인 에러 ▶', error);
    return {
      success: false,
      error,
    };
  }
};

export const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    return { success: true };
  } catch (error) {
    console.error('Google 로그아웃 에러 ▶', error);
    return { success: false, error };
  }
};

export const isSignedIn = async () => {
  try {
    return await GoogleSignin.isSignedIn();
  } catch (error) {
    console.error('Google 로그인 상태 확인 에러 ▶', error);
    return false;
  }
}; 