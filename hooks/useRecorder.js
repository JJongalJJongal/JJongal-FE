// hooks/useRecorder.js
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { PermissionsAndroid, Platform } from 'react-native';
import uuid from 'react-native-uuid';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    let permissions = [
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ];

    // Android 13(API 33) 이상에서는 미디어별 권한 사용
    if (Platform.Version >= 33) {
      permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO);
    } else {
      permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      permissions.push(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    }

    console.log('안드로이드 권한 요청 시작');
    const granted = await PermissionsAndroid.requestMultiple(permissions);
    console.log('권한 요청 결과:', granted);

    // 모든 권한이 허용되었는지 확인
    const allGranted = Object.values(granted).every(
      v => v === PermissionsAndroid.RESULTS.GRANTED
    );

    return allGranted;
  }
  return true;
};

export const startRecording = async () => {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.log('안드로이드 권한이 거부되었습니다.');
      return null;
    }

    const uniqueId = uuid.v4();
    const fileName = `story_${uniqueId}.wav`;

    const path = Platform.select({
      ios: fileName,
      android: `${RNFS.DocumentDirectoryPath}/${fileName}`,
    });

    console.log('안드로이드 녹음 시작:', { fileName, path, uniqueId });

    await audioRecorderPlayer.startRecorder(path);
    return { path, fileName };
  } catch (e) {
    console.error('startRecording 내부 에러:', e);
    return null;
  }
};

export const stopRecording = async () => {
  console.log('안드로이드 녹음 중지 시작');
  const result = await audioRecorderPlayer.stopRecorder();
  console.log('안드로이드 녹음 파일 저장됨:', result);
  audioRecorderPlayer.removeRecordBackListener();
  return result; // file path
};