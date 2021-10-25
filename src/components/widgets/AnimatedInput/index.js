import React from 'react';
import { StyleSheet, ViewProps, TextStyle, View } from 'react-native';
import TextInput from './AnimatedInput';

type Props = {
  placeholder: string,
  onChange?: (text: string) => void,
  value?: string,
  wrapperStyle?: ViewStyle,
  invalid?: boolean,
  invalidMessage?: string,
  blurOnSubmit?: boolean,
  disabled?: boolean,
  editedField?: boolean,
  returnKeyType?: 'default' | 'send',
  onBlur: () => void,
  onFocus: () => void,
  rawErrors: any[],
  required?: Boolean,
  labelStyle: ViewProps<TextStyle>,
  containerStyle: ViewProps<ViewStyle>,
  label?: String,
};
const AnimatedInput = (props: Props) => {
  const {
    rawErrors = [],
    keyboardType,
    placeholder,
    schema,
    required,
    disabled,
    wrapperStyle,
    labelStyle,
    onChange,
    value,
    label,
    containerStyle,
    autoCapitalize,
  } = props;
  const showError = rawErrors && rawErrors.length > 0;
  let keyboardTypeUse = keyboardType ? keyboardType : 'default';
  let placeholderUse = placeholder;
  if (schema && schema.hasOwnProperty('keyboardType')) {
    keyboardTypeUse = schema['keyboardType'];
  }
  if (schema && schema.hasOwnProperty('placeholder')) {
    placeholderUse = schema['placeholder'];
  }
  let maxLength = null;
  if (schema && schema.hasOwnProperty('maxLength')) {
    maxLength = parseInt(schema.maxLength);
  }
  return (
    <View style={[styles.ctn, containerStyle]}>
      <TextInput
        placeholder={label}
        title={placeholderUse}
        value={value}
        valid={!showError}
        errorText={rawErrors[0]}
        onChangeText={onChange}
        required={required}
        styleInput={wrapperStyle}
        disabled={disabled}
        styleLabel={labelStyle}
        maxLength={maxLength}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize || 'words'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  ctn: {},
});

export default AnimatedInput;
