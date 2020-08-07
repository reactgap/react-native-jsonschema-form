// @flow

import React, { PureComponent, Fragment } from 'react';
import { Text, View, StyleSheet, type ViewStyle } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import csstyles from '../../styles';
import { TextField, FilledTextField, OutlinedTextField } from 'react-native-material-textfield';

type Props = {
  placeholder: string,
  autoCapitalize?: 'none' | 'words',
  fieldType: 'email' | 'phone' | null,
  onChange?: (text: string) => void,
  value?: string,
  keyboardType?: 'email-address' | 'number-pad' | 'default',
  multiline?: boolean,
  password?: boolean,
  wrapperStyle?: ViewStyle,
  inputStyle?: ViewStyle,
  blurOnSubmit?: boolean,
  disabled?: boolean,
  editedField?: boolean,
  returnKeyType?: 'default' | 'send',
  onBlur: () => void,
  onFocus: () => void,
  rawErrors: any[],
  keyboardAppearance: 'light' | 'dark' | 'default',
  icon?: string,
};

type State = {
  touched: boolean,
};

class TextFieldMaterial extends PureComponent<Props, State> {
  static defaultProps = {
    password: false,
    keyboardType: 'default',
    multiline: false,
  };

  state: State = {
    touched: false,
  };

  inputRef: TextInput | null = null;

  onBlur = () => {
    const { touched } = this.state;

    if (!touched) {
      this.setState({
        touched: true,
      });
    }
    this.props.onBlur();
  };

  focus = () => {
    this.inputRef && this.inputRef.focus();
    this.props.onFocus();
  };

  blur = () => {
    this.inputRef && this.inputRef.blur();
    this.props.onBlur();
  };

  _onChange = (value) => {
    const { options } = this.props;
    this.props.onChange(value === '' ? options.emptyValue : value);
  };

  render() {
    const {
      icon,
      schema,
      label,
      title,
      placeholder,
      autoCapitalize,
      password,
      wrapperStyle,
      inputStyle,
      value,
      onChange,
      multiline,
      blurOnSubmit,
      returnKeyType,
      onBlur,
      onFocus,
      options,
      disabled,
      rawErrors,
      keyboardType,
      type,
      editedField,
      keyboardAppearance,
      maxLength,
      characterRestriction,
      numberOfLines,
      textFieldType,
      inputContainerStyle,
      containerStyle,
      required,
    } = this.props;
    const { touched } = this.state;
    const showError = rawErrors && rawErrors.length > 0;
    let keyboardTypeUse = keyboardType ? keyboardType : 'default';
    const editable = !disabled && (editedField ? editedField : true);
    const TextInput = textFieldType === 'Outlined' ? OutlinedTextField : TextField;
    const errorMsg = showError ? rawErrors[0] : null;
    let placeholderUse = placeholder;
    if (schema && schema.hasOwnProperty('placeholder')) {
      placeholderUse = schema['placeholder'];
    }
    const labelDisplay = required ? `${label}*` : label;

    return (
      <Fragment>
        {/* <View style={[styles.wrapper, wrapperStyle]}> */}
        <TextInput
          label={labelDisplay || ''}
          keyboardType={keyboardType}
          title={placeholderUse}
          onChangeText={this._onChange}
          blurOnSubmit={blurOnSubmit ? blurOnSubmit : true}
          autoCapitalize={autoCapitalize ? autoCapitalize : 'none'}
          onBlur={this.onBlur}
          returnKeyType={returnKeyType}
          secureTextEntry={type != null && type === 'password' ? true : false}
          keyboardAppearance={keyboardAppearance ? keyboardAppearance : 'light'}
          // formatText={this.formatText}
          // onSubmitEditing={this.onSubmit}
          value={value ? `${value}` : ''}
          autoCorrect={false}
          multiline={multiline}
          ref={(ref) => {
            this.inputRef = ref;
          }}
          maxLength={maxLength}
          characterRestriction={characterRestriction}
          numberOfLines={numberOfLines}
          style={wrapperStyle}
          editable={editable}
          error={errorMsg}
          inputContainerStyle={[styles.inputContainerStyleDefault, inputContainerStyle]}
          containerStyle={[styles.containerStyleDefault, containerStyle]}
        />
      </Fragment>
    );
  }

  componentDidUpdate(prevProps: Props) {
    const { value } = this.props;
    if (value !== prevProps.value && this.inputRef) {
      this.inputRef.setValue(value);
    }
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: csstyles.vars.csBoxSpacing,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    flexDirection: 'row',
    flex: 1,
    backgroundColor: 'red',
  },
  inputContainerStyleDefault: {},
  containerStyleDefault: {
    marginBottom: 8,
  },
});

export default TextFieldMaterial;
