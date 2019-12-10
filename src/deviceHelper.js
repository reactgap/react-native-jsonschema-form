// @flow

import React, { Component } from 'react';
import { Dimensions, Platform, StatusBar } from 'react-native';

export function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 || dimen.width === 812 || dimen.height === 896 || dimen.width === 896)
  );
}

export function ifIphoneX(iphoneXStyle, regularStyle) {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
}

export function getStatusBarHeight(safe: boolean) {
  return Platform.select({
    ios: ifIphoneX(safe ? 44 : 30, 20),
    android: StatusBar.currentHeight,
  });
}

export function getBottomSpace() {
  return isIphoneX() ? 34 : 0;
}

export function switchDevice(iphoneX, iphone, android) {
  return Platform.select({
    ios: ifIphoneX(iphoneX, iphone),
    android: android || iphone,
  });
}

export const DEVICE_SCREEN_WIDTH = Dimensions.get('screen').width;

export const DEVICE_SCREEN_HEIGHT = Platform.select({
  ios: Dimensions.get('screen').height,
  android: Dimensions.get('window').height - StatusBar.currentHeight,
});

export const DEVICE_BOTTOM_SAFE = Platform.select({
  ios: Platform.isPad ? 20 : ifIphoneX(34, 0),
  android: 0,
});

export const DEVICE_TOP_SAFE = Platform.select({
  ios: ifIphoneX(44, 20),
  android: 0,
});

export const IS_DEVICE_SHORT_HEIGHT = DEVICE_SCREEN_HEIGHT < 570;
export const IS_DEVICE_VERY_LONG_WIDTH = DEVICE_SCREEN_WIDTH > 700;
export const IS_DEVICE_VERY_SHORT_WIDTH = DEVICE_SCREEN_HEIGHT <= 320;
