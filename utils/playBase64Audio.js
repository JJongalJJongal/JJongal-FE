import RNFS from 'react-native-fs';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

export const playBase64Audio = async (base64String, filename = 'server_audio') => {
  try {
    // 기존 재생 중인 오디오 정지
    await stopAudio();
    
    // base64 데이터 정리 (헤더 제거)
    const cleanBase64 = base64String.replace(/^data:audio\/[^;]+;base64,/, '');
    
    const filePath = `${RNFS.DocumentDirectoryPath}/${filename}.mp3`;
    await RNFS.writeFile(filePath, cleanBase64, 'base64');
    
    console.log('🎵 Base64 오디오 파일 저장됨:', filePath);
    
    const result = await audioRecorderPlayer.startPlayer(filePath);
    console.log('✅ Base64 오디오 재생 시작:', filePath, result);
    
    // 재생 완료 리스너 추가
    audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.currentPosition === e.duration) {
        console.log('🎵 오디오 재생 완료');
        // 재생 완료 후 파일 삭제
        RNFS.unlink(filePath).catch(console.warn);
      }
    });
    
    return result;
  } catch (e) {
    console.error('❌ Base64 오디오 재생 에러:', e);
    throw e;
  }
};

export const stopAudio = async () => {
  try {
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    console.log('🛑 오디오 정지됨');
  } catch (e) {
    console.warn('⚠️ 오디오 정지 중 오류:', e);
  }
};
