import { Alert, Platform } from 'react-native';
import RNPermissions, { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
export const PERMISSIONS_TYPE = {
  CAMERA: 'CAMERA',
  LIBRARY: 'LIBRARY',
};

type Props = {
  type: 'CAMERA' | 'LIBRARY',
};

export const checkPermission = ({ type }: Props) => {
  const permissionLibrary =
    Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      : PERMISSIONS.IOS.PHOTO_LIBRARY;
  const permissionCamera =
    Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA;
  const permissionForType = type === PERMISSIONS_TYPE.CAMERA ? permissionCamera : permissionLibrary;
  check(permissionForType)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          console.log('The permission has not been requested / is denied but requestable');
          type === PERMISSIONS_TYPE.CAMERA ? AlertCameraPermission() : AlertLibraryPermission();

          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          type === PERMISSIONS_TYPE.CAMERA ? AlertCameraPermission() : AlertLibraryPermission();
          break;
      }
    })
    .catch((error) => {
      // …
    });
};

const AlertLibraryPermission = () => {
  Alert.alert(
    'Cho phép chia sẻ hình ảnh',
    'Điều này cho phép bạn có thể chọn ảnh đính kèm trong ứng dụng Momi',
    [
      {
        text: 'Đóng',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'ĐẾN CÀI ĐẶT', onPress: () => RNPermissions.openSettings() },
    ],
  );
};
const AlertCameraPermission = () => {
  Alert.alert(
    'Cho phép quyền chụp ảnh',
    'Điều này cho phép bạn có thể chụp ảnh cá nhân trong ứng dụng Momi',
    [
      {
        text: 'Đóng',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'ĐẾN CÀI ĐẶT', onPress: () => RNPermissions.openSettings() },
    ],
  );
};
