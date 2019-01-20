import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextInput } from 'react-native';
import styles from '../styles';


class TextareaWidget extends Component {
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
    const {
      id,
      options,
      placeholder,
      value,
      required,
      disabled,
      readonly,
      autofocus,
      onChange,
      onBlur,
      onFocus,
      keyboardAppearance
    } = this.props;
    const _onChange = (value) => {
      return onChange(value === "" ? options.emptyValue : value);
    };
    const { focus } = this.state;
    console.log('TextareaWidget component');
    return (
      <TextInput
        value={typeof value === "undefined" ? "" : value}
        style={[styles.component.textInputStyle, focus == true ? styles.component.textInputFocus : null]}
        keyboardAppearance={keyboardAppearance == null ? "light" : keyboardAppearance }
        autoFocus={autofocus}
        multiline={true}
        placeholder={placeholder}
        numberOfLines={options.rows}
        ref={input => (this.input = input)}
        onChangeText={_onChange}
        onBlur={this.onBlurInput}
        onFocus={this.onFocusInput}
        disabled={disabled}
        editable={!readonly}
      />
      // <textarea
      //   id={id}
      //   className="form-control"
      //   value={typeof value === "undefined" ? "" : value}
      //   placeholder={placeholder}
      //   required={required}
      //   disabled={disabled}
      //   readOnly={readonly}
      //   autoFocus={autofocus}
      //   rows={options.rows}
      //   onBlur={onBlur && (event => onBlur(id, event.target.value))}
      //   onFocus={onFocus && (event => onFocus(id, event.target.value))}
      //   onChange={_onChange}
      // />
    );
  }
}

TextareaWidget.defaultProps = {
  autofocus: false,
  options: {},
};

if (process.env.NODE_ENV !== "production") {
  TextareaWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.shape({
      rows: PropTypes.number,
    }),
    value: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default TextareaWidget;
