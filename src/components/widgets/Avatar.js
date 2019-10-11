// @flow

import React, { PureComponent } from 'react'
import { TouchableOpacity, StyleSheet, Image, View } from 'react-native'
import ImageCropPicker from 'react-native-image-crop-picker'
import csstyles from '../styles'
import Photo from './Photo/Photo'
import ActionSheet, { type ActionSheetConfig } from './ActionSheet/ActionSheet'

type Props = { 
  photoURL?: string, 
  onUploading?: () => any, 
  onUploaded?: () => void,
  onChange?: (dataBase64: string, image: Image) => void,
  accessToken?: string
}

type State = {
  profilePhotoSelecting: boolean,
  pickerMode: 'library' | 'camera' | null,
  photoURL: String,
  imageLocal: String,
  onUploading: boolean
}

const widthAvatar = 100

class Avatar extends PureComponent<Props, State> {
  state: State = {
    profilePhotoSelecting: false,
    pickerMode: null,
    photoURL: null
  }

  onProfilePhotoPress = () => {
    this.setState({
      profilePhotoSelecting: true
    })
  }

  onProfilePhotoSelected = (image?: Image) => {
    if (image) {
      const { onUploaded, onUploading, onChange, accessToken } = this.props
      const { data, mime } = image
      if (onChange) {
        onChange(`data:${mime};base64,${data}`, image)
      }
    }
  }

  getActionSheetConfig = (): ActionSheetConfig => {
    const { profilePhotoSelecting } = this.state

    if (profilePhotoSelecting) {
      return {
        isOpen: true,
        title: 'Chọn ảnh đại diện',
        actions: [
          {
            key: 'camera',
            title: 'Chụp ảnh',
            type: 'primary',
            icon: 'camera',
            onPress: () => {
              this.setState({
                profilePhotoSelecting: false,
                pickerMode: 'camera'
              })
            }
          },
          {
            key: 'library',
            title: 'Chọn từ thư viện',
            type: 'primary',
            icon: 'images',
            onPress: () => {
              this.setState({
                profilePhotoSelecting: false,
                pickerMode: 'library'
              })
            }
          }
        ],
        onClose: () => {
          this.setState({
            profilePhotoSelecting: false,
            pickerMode: null
          })
        }
      }
    }

    return {
      isOpen: false,
      onDismiss: () => {
        const imgCropConfig = {
          width: 300,
          height: 300,
          cropping: true,
          includeBase64: true,
          useFrontCamera: true,
          cropperTintColor: csstyles.vars.csGrey,
          cropperToolbarTitle: 'Choose A Photo',
          cropperChooseText: 'Done',
          cropperCancelText: 'Cancel'
        }

        // debugger

        const { pickerMode } = this.state

        switch (pickerMode) {
        case 'library':
          ImageCropPicker.openPicker(imgCropConfig)
            .then(this.onProfilePhotoSelected)
            .catch(() => {
              this.onProfilePhotoSelected()
            })
          break
        case 'camera':
          ImageCropPicker.openCamera(imgCropConfig)
            .then(this.onProfilePhotoSelected)
            .catch(() => {
              this.onProfilePhotoSelected()
            })
          break
        default:
          break
        }
      }
    }
  }

  render() {
    const { photoURL, schema, value, disabled, accessToken } = this.props
    const { imageLocal } = this.state
    const actionSheetConfig = this.getActionSheetConfig()
    let url = photoURL ? photoURL : ''
    if (schema && value) {
      url = value
    }
    console.log('render avatar', url)

    return (
      <View style={[styles.basicInfo]}>
        <ActionSheet {...actionSheetConfig} />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.onProfilePhotoPress}
          style={[styles.avatarWrapper, styles.borderAvatar]}
          disabled={disabled ? disabled : false}
        >
          <Photo
            url={url || ''}
            accessToken={accessToken}
            photoStyle={csstyles.base.full}
            wrapStyle={styles.avatarWrapper}
            bottomIconName={disabled === true ? null : "camera"}
            profilePlaceHolder
            placeholderTextStyle={{
              fontSize: 30
            }}
          />

        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  avatarWrapper: {
    width: widthAvatar,
    height: widthAvatar,
    borderRadius: widthAvatar/2.0,
    marginBottom: csstyles.vars.csBoxSpacing,
    overflow: 'hidden'
  },
  borderAvatar: {
    borderWidth: 0.5,
    borderColor: csstyles.vars.csGrey
  },
  wrapStyle: {
    position: 'relative',
    overflow: 'hidden'
  },
  basicInfo: {
    position: 'relative',
    paddingHorizontal: csstyles.vars.csBoxSpacing2x,
    marginBottom: csstyles.vars.csBoxSpacing2x,
    ...csstyles.base.fullCenter
  }
})

export default Avatar
