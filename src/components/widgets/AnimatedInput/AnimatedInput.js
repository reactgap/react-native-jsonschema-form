import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import { View, TextInput, Animated, Text, Keyboard } from 'react-native';
import styles from './styles';

const AnimatedTextInput = ({
  placeholder,
  errorText,
  valid,
  errorColor,
  disabled,
  value,
  styleInput,
  styleLabel,
  styleError,
  styleContent,
  styleBodyContent,
  innerRef,
  selectionColor,
  labelInitialSize,
  labelFinalSize,
  textInputFontSize,
  required,
  onChangeEnd = () => null,
  title,
  autoFocus,
  keyboardType,
  autoCapitalize,
  ...others
}) => {
  const [showInput, setShowInput] = useState(false);
  const [showError, setShowError] = useState(false);
  const [animatedIsFocused] = useState(new Animated.Value(1));
  const [isInputFocused, setInputFocus] = useState(false);

  const inputFontSize = styleLabel.fontSize || styles.label.fontSize;
  const labelFontSize = styleLabel.fontSize || styles.label.fontSize;
  const errorFontSize = styleError.fontSize || styles.error.fontSize;
  const labelDisplay = required ? `${placeholder}*` : placeholder;
  useEffect(() => {
    Keyboard.dismiss();
  }, []);
  useEffect(() => {
    setShowError(!valid);
    if (value) {
      setShowInput(true);
    }
    if (value && !showInput) {
      startAnimation();
    }
    animationView();
  }, [
    valid,
    value,
    animationView,
    animationLabelFontSize,
    animatedIsFocused,
    startAnimation,
    showInput,
  ]);

  const onBlur = () => {
    setInputFocus(false);
    if (!value) {
      setShowInput(false);
      setShowError(false);
      startAnimation();
    }
  };

  const onFocus = () => {
    setInputFocus(true);

    if (!showInput) {
      startAnimation();
    }
  };

  const borderColor = () => {
    const borderStyle = {};
    borderStyle.borderBottomColor =
      styleBodyContent.borderBottomColor || styles.bodyContent.borderBottomColor;
    if (showError) {
      borderStyle.borderBottomColor = errorColor || '#d32f2f';
    }
    return borderStyle;
  };

  const setContentHeight = () => {
    return 115;
  };

  const getErrorContentSpace = () => {
    return errorFontSize + 2;
  };

  const startAnimation = useCallback(() => {
    Animated.timing(animatedIsFocused, {
      useNativeDriver: false,
      toValue: showInput ? 1 : 0,
      duration: 150,
    }).start(() => {
      if (!showInput) {
        setShowInput(true);
      }
    });
  }, [animatedIsFocused, showInput]);

  const animationView = useCallback(() => {
    const sizeShow = 15 + labelFontSize + inputFontSize + 10;
    const sizeHide = 15 + labelFontSize;
    const inputAdjust = {
      height: animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [sizeShow, sizeHide],
      }),
    };
    return inputAdjust;
  }, [animatedIsFocused, inputFontSize, labelFontSize]);

  const animationLabelFontSize = useCallback(() => {
    const fontAdjust = {
      fontSize: animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [labelFinalSize || labelFontSize, labelInitialSize || inputFontSize + 3],
      }),
    };
    return fontAdjust;
  }, [animatedIsFocused, inputFontSize, labelFontSize]);
  const getColor = () => {
    if (!valid) return '#DC3545';
    return isInputFocused ? '#0088FF' : '#8E8E93';
  };
  const getBorderBottomWidth = () => {
    if (!valid) return 1.5;
    return isInputFocused ? 1.5 : 0.4;
  };
  return (
    <View style={[styles.content, styleContent, { height: setContentHeight() }]}>
      <Animated.View
        style={[
          styles.bodyContent,
          styleBodyContent,
          borderColor(showError),
          {
            // marginBottom: showError ? 0 : getErrorContentSpace(),
            borderBottomWidth: getBorderBottomWidth(),
            borderBottomColor: getColor(),
          },
          animationView(),
        ]}>
        <View style={styles.wrapper}>
          <Animated.Text
            style={[styles.label, styleLabel, animationLabelFontSize(), { color: getColor() }]}
            onPress={() => !disabled && onFocus()}>
            {labelDisplay}
          </Animated.Text>
          {showInput && (
            <View style={styles.toucheableLineContent}>
              <TextInput
                {...others}
                value={value}
                pointerEvents={disabled ? 'box-none' : 'auto'}
                selectionColor={selectionColor}
                autoFocus={isInputFocused}
                blurOnSubmit
                editable={!disabled}
                autoCorrect={false}
                onBlur={() => onBlur()}
                style={[styles.input, styleInput]}
                onEndEditing={() => onBlur()}
                ref={innerRef}
                selectionColor="#0088FF"
                keyboardType={keyboardType || 'default'}
                autoCapitalize={autoCapitalize}
              />
            </View>
          )}
        </View>
      </Animated.View>
      <View style={{ height: 51, width: '100%' }}>
        {showError ? (
          <Text
            numberOfLines={2}
            style={[styles.error, errorColor && { color: errorColor }, styleError]}>
            {errorText}
          </Text>
        ) : (
          <Text style={[styles.error, { color: '#8E8E93' }]}>{title}</Text>
        )}
      </View>
    </View>
  );
};

const AnimatedInput = forwardRef((props, ref) => <AnimatedTextInput {...props} innerRef={ref} />);

AnimatedInput.defaultProps = {
  valid: true,
  disabled: false,
  value: '',
  styleInput: {},
  styleBodyContent: {},
  styleLabel: {},
  styleError: {},
};

export default AnimatedInput;
