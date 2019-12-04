// @flow

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import csstyles from '../../../styles';

type Props = {
  title?: string,
  type: 'primary' | 'secondary' | 'danger' | 'border',
  onPress?: () => void,
  leftIcon?: string,
  iconOnly?: boolean,
  iconContainerStyle?: ViewStyle,
  iconStyle?: TextStyle,
  style?: ViewStyle,
  disabled?: boolean,
};

const CSButton = ({
  title,
  type,
  onPress,
  style,
  disabled,
  leftIcon,
  iconOnly,
  iconStyle,
  iconContainerStyle,
}: Props) => {
  const btnStyle = styles[type];
  const textStyle = styles[`text_${type}`];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.base,
        iconOnly && styles.baseIconOnly,
        btnStyle,
        style,
        disabled
          ? {
              opacity: 0.6,
            }
          : null,
      ]}
      activeOpacity={0.6}
      disabled={disabled}>
      {!iconOnly && title && (
        <Text style={[styles.textBase, textStyle]}>{title.toUpperCase()}</Text>
      )}
      {leftIcon && (
        <View
          style={[
            styles.leftIconContainer,
            iconOnly && styles.leftIconOnlyContainer,
            iconContainerStyle,
          ]}>
          <FontAwesome5 style={[textStyle, iconStyle]} name={leftIcon} solid size={20} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: csstyles.vars.csInputHeight,
    minWidth: csstyles.vars.csInputHeight,
    borderRadius: csstyles.vars.csInputBorderRaius,
    paddingHorizontal: csstyles.vars.csInputHorizontalPadding,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: csstyles.vars.csBoxBorderWidth,
    position: 'relative',
    overflow: 'hidden',
  },
  baseIconOnly: {
    paddingHorizontal: 0,
  },
  leftIconContainer: {
    height: csstyles.vars.csInputHeight,
    width: csstyles.vars.csInputHeight,
    ...csstyles.base.center,
    position: 'absolute',
    top: 0,
    left: csstyles.vars.csInputHeight / 3,
    bottom: 0,
  },
  leftIconOnlyContainer: {
    left: 0,
  },
  textBase: {
    ...csstyles.text.bold,
    fontSize: 15,
  },
  primary: {
    backgroundColor: csstyles.vars.csGreen,
    borderWidth: 0,
  },
  secondary: {
    backgroundColor: csstyles.vars.csBrown,
    borderWidth: 0,
  },
  danger: {
    backgroundColor: csstyles.vars.csDanger,
    borderWidth: 0,
  },
  text_primary: {
    color: csstyles.vars.csWhite,
  },
  text_danger: {
    color: csstyles.vars.csWhite,
  },
  text_secondary: {
    color: csstyles.vars.csWhite,
  },
  border: {
    backgroundColor: 'transparent',
    borderColor: csstyles.vars.csGreen,
  },
  text_border: {
    color: csstyles.vars.csGreen,
  },
});

export default CSButton;
