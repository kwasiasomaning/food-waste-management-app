import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform } from 'react-native';

export type FridgePhotoResult =
  | { kind: 'uri'; uri: string }
  | { kind: 'web-camera' }
  | { kind: 'cancelled' };

export async function takeFridgePhoto(): Promise<FridgePhotoResult> {
  if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.mediaDevices) {
    return { kind: 'web-camera' };
  }
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert(
      'Camera',
      'Camera access is needed to photograph the fridge. You can still upload a photo or tick a list.',
    );
    return { kind: 'cancelled' };
  }
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 0.7,
    cameraType: ImagePicker.CameraType.back,
  });
  if (result.canceled || !result.assets[0]) return { kind: 'cancelled' };
  return { kind: 'uri', uri: result.assets[0].uri };
}

export async function uploadFridgePhoto(): Promise<FridgePhotoResult> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted && permission.status !== ImagePicker.PermissionStatus.GRANTED) {
    if (Platform.OS !== 'web') {
      Alert.alert('Photos', 'Photo library access is needed to upload a fridge picture.');
      return { kind: 'cancelled' };
    }
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.7,
  });
  if (result.canceled || !result.assets[0]) return { kind: 'cancelled' };
  return { kind: 'uri', uri: result.assets[0].uri };
}
