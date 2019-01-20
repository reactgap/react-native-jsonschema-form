import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'react-native';
// import { Input } from 'react-native-elements';
import styles from '../styles';

class BaseInput extends Component {
  state = {
    focus: false
  };

  onFocusInput = (e) => {
    console.log('onFocusInput')
    this.setState({  focus: true });
    this.props.onFocus(e);
  }

  onBlurInput = (e) => {
    console.log('onBlurInput')
    this.setState({  focus: false });
    this.props.onBlur(e);
  }

  render() {
      // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the "options" and "schema" ones here.
  if (!this.props.id) {
    console.log('No id for', this.props);
    throw new Error(`no id for props ${JSON.stringify(this.props)}`);
  }
  const {
    value,
    readonly,
    disabled,
    autofocus,
    multiline,
    numberOfLines,
    onBlur,
    onFocus,
    options,
    schema,
    formContext,
    registry,
    rawErrors,
    keyboardAppearance,
    placeholder,
    type,
    ...inputProps
  } = this.props;
  inputProps.type = options.inputType || inputProps.type || 'text';
  const _onChange = (value) =>
    this.props.onChange(value === '' ? options.emptyValue : value);
  console.log("base input",inputProps);

  const { focus } = this.state;
  return (
    // <Input
    //     leftIcon={null}
    //     value={value == null ? '' : value}
    //     keyboardAppearance={keyboardAppearance == null ? "light" : keyboardAppearance }
    //     autoFocus={autofocus}
    //     secureTextEntry={type != null && type === 'password' ? true : false}
    //     autoCorrect={false}
    //     inputStyle={styles.component.textInputStyle}
    //     placeholder={placeholder == null ? "" : placeholder}
    //     containerStyle={{ borderBottomColor: 'transparent' }}
    //     ref={input => (this.input = input)}
    //     onSubmitEditing={() => this.input.focus()}
    //     onChangeText={_onChange}
    //   />
    <TextInput
      value={value == null ? '' : value}
      keyboardAppearance={keyboardAppearance == null ? "light" : keyboardAppearance }
      autoFocus={autofocus}
      secureTextEntry={type != null && type === 'password' ? true : false}
      autoCorrect={false}
      style={[styles.component.textInputStyle, focus == true ? styles.component.textInputFocus : null]}
      ref={input => (this.input = input)}
      onFocus={this.onFocusInput}
      onChangeText={_onChange}
      onBlur={this.onBlurInput}
    />
  );
  }

}

function BaseInput(props) {
  
}

BaseInput.defaultProps = {
  type: 'text',
  required: false,
  disabled: false,
  readonly: false,
  autofocus: false,
};

if (process.env.NODE_ENV !== 'production') {
  BaseInput.propTypes = {
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onSubmitEditing: PropTypes.func,
  };
}

export default BaseInput;
