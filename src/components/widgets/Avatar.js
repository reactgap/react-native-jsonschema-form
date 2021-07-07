// @flow

import React, { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet, Image, View } from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import csstyles from '../styles';
import Photo from './Photo/Photo';
import ActionSheet from 'react-native-actionsheet';

type Props = {
  photoURL?: string,
  onUploading?: () => any,
  onUploaded?: () => void,
  onChange?: (dataBase64: string, image: Image) => void,
  accessToken?: string,
};

type State = {
  pickerMode: 'library' | 'camera' | null,
  photoURL: String,
  imageLocal: String,
  onUploading: boolean,
};

const widthAvatar = 100;

const imgCropConfig = {
  width: 300,
  height: 300,
  cropping: true,
  includeBase64: true,
  useFrontCamera: true,
  cropperTintColor: csstyles.vars.csGrey,
  cropperToolbarTitle: 'Choose A Photo',
  cropperChooseText: 'Done',
  cropperCancelText: 'Cancel',
};

class Avatar extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.actionSheet = React.createRef();
  }
  state: State = {
    pickerMode: null,
    photoURL: null,
  };

  onProfilePhotoPress = () => {
    this.actionSheet?.current?.show();
  };

  onProfilePhotoSelected = (image?: Image) => {
    if (image) {
      const { onUploaded, onUploading, onChange, accessToken } = this.props;
      const { data, mime } = image;
      if (onChange) {
        onChange(`data:${mime};base64,${data}`, image);
      }
    }
  };

  render() {
    const { photoURL, schema, value, disabled, accessToken } = this.props;
    let url = photoURL ? photoURL : '';
    if (schema && value) {
      url = value;
    }

    return (
      <View style={[styles.basicInfo]}>
        <ActionSheet
          ref={this.actionSheet}
          title={'Chọn ảnh đại diện'}
          options={['Chụp ảnh', 'Chọn từ thư viện', 'Huỷ']}
          cancelButtonIndex={2}
          onPress={(_index) => {
            /* do something */
            if (_index === 0) {
              ImageCropPicker.openCamera(imgCropConfig)
                .then(this.onProfilePhotoSelected)
                .catch(() => {
                  this.onProfilePhotoSelected();
                });
            } else if (_index === 1) {
              ImageCropPicker.openPicker(imgCropConfig)
                .then(this.onProfilePhotoSelected)
                .catch(() => {
                  this.onProfilePhotoSelected();
                });
            }
          }}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.onProfilePhotoPress}
          style={[styles.avatarWrapper, styles.borderAvatar]}
          disabled={disabled ? disabled : false}>
          <Photo
            url={url || ''}
            accessToken={accessToken}
            photoStyle={csstyles.base.full}
            wrapStyle={styles.avatarWrapper}
            bottomIconName={disabled === true ? null : 'camera'}
            profilePlaceHolder
            placeholderTextStyle={{
              fontSize: 30,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  avatarWrapper: {
    width: widthAvatar,
    height: widthAvatar,
    borderRadius: widthAvatar / 2.0,
    marginBottom: csstyles.vars.csBoxSpacing,
    overflow: 'hidden',
  },
  borderAvatar: {
    borderWidth: 0.5,
    borderColor: csstyles.vars.csGrey,
  },
  wrapStyle: {
    position: 'relative',
    overflow: 'hidden',
  },
  basicInfo: {
    position: 'relative',
    paddingHorizontal: csstyles.vars.csBoxSpacing2x,
    marginBottom: csstyles.vars.csBoxSpacing2x,
    ...csstyles.base.fullCenter,
  },
});

export default Avatar;
