// Camera Service - Photo capture and manipulation

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export interface CapturedImage {
  uri: string;
  width: number;
  height: number;
  base64?: string;
}

export const cameraService = {
  /**
   * Request camera permissions
   */
  async requestPermissions() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === 'granted';
  },

  /**
   * Capture photo from camera
   */
  async capturePhoto(): Promise<CapturedImage | null> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Camera permission denied');
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
      };
    }

    return null;
  },

  /**
   * Pick image from gallery
   */
  async pickImage(): Promise<CapturedImage | null> {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      return {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
      };
    }

    return null;
  },

  /**
   * Resize and compress image
   */
  async resizeImage(
    uri: string,
    maxWidth: number = 1200,
    maxHeight: number = 1600
  ): Promise<CapturedImage> {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth, height: maxHeight } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    return {
      uri: result.uri,
      width: result.width,
      height: result.height,
    };
  },

  /**
   * Crop image to specific aspect ratio
   */
  async cropImage(uri: string, crop: { x: number; y: number; width: number; height: number }) {
    const result = await ImageManipulator.manipulateAsync(uri, [{
      crop: {
        originX: crop.x,
        originY: crop.y,
        width: crop.width,
        height: crop.height,
      }
    }], {
      compress: 0.9,
      format: ImageManipulator.SaveFormat.JPEG,
    });

    return {
      uri: result.uri,
      width: result.width,
      height: result.height,
    };
  },
};
