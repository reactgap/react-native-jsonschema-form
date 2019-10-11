// @flow
// @format

import React, { PureComponent } from 'react'
import { type ViewStyle, View, StyleSheet, Text, type TextStyle } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import FastImage from 'react-native-fast-image'
import csstyles from '../../styles'

type Props = {
  url: string,
  photoStyle: ViewStyle,
  wrapStyle: ViewStyle,
  placeholderStyle?: ViewStyle,
  placeholderTextStyle?: TextStyle,
  bottomIconName?: string,
  profilePlaceHolder?: boolean,
  accessToken?: string
}

type State = {
  loadState: 'progress' | 'success' | 'error'
}

class Photo extends PureComponent<Props, State> {
  state: State = {
    loadState: 'progress'
  }

  onLoad = () => {
    this.setState({
      loadState: 'success'
    })
  }

  onError = () => {
    this.setState({
      loadState: 'error'
    })
  }

  render() {
    const {
      photoStyle,
      url,
      wrapStyle,
      bottomIconName,
      placeholderStyle,
      profilePlaceHolder,
      placeholderTextStyle,
      accessToken
    } = this.props
    const { loadState } = this.state
    console.log('Photo url', url)
    console.log('Photo url accessToken', accessToken)
    return (
      <View style={[styles.wrapStyle, wrapStyle]}>
        <FastImage
          source={{
            uri: url || '',
            headers: { 'X-Access-Token': accessToken || ''  }
          }}
          style={[csstyles.base.full, photoStyle]}
          resizeMode="contain"
          onLoad={this.onLoad}
          onError={this.onError}
        />

        {loadState !== 'success' && (
          <View style={[styles.placeholder, placeholderStyle]}>
            {profilePlaceHolder ? (
              <FontAwesome5
                name="user"
                style={[styles.placeholderText, placeholderTextStyle]}
                solid
              />
            ) : (
              <Text style={[styles.placeholderText, placeholderTextStyle]}>App name</Text>
            )}
          </View>
        )}

        {bottomIconName && (
          <View style={styles.bottomIconContainer}>
            <FontAwesome5 color={csstyles.vars.csGreen} name={bottomIconName} size={15} />
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapStyle: {
    position: 'relative',
    overflow: 'hidden'
  },
  placeholder: {
    ...csstyles.base.absoluteFull,
    backgroundColor: csstyles.vars.csGreen,
    justifyContent: 'center',
    alignItems: 'center'
  },
  placeholderText: {
    ...csstyles.text.medium,
    fontSize: 13,
    color: csstyles.vars.csLight,
    textAlign: 'center'
  },
  bottomIconContainer: {
    ...csstyles.base.center,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '25%',
    backgroundColor: csstyles.mixin.csBlackOpacity(0.8)
  }
})

export default Photo
