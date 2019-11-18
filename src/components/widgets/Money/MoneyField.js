// @flow

import React, { PureComponent, Fragment } from 'react'
import { Text, View, TextInput, StyleSheet, type ViewStyle } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import currencyFormatter from 'currency-formatter';
import Proptypes from 'prop-types';

import csstyles from '../../styles';

const DEFAULT_CURRENCY_OPTIONS = {
  symbol: 'VND',
  decimal: '.',
  thousand: ',',
  precision: 0,
  format: '%v',
}

type Props = {
  placeholder: Proptypes.string,
  autoCapitalize?: 'none' | 'words',
  fieldType: null,
  onChange?: (text: Proptypes.string) => void,
  value?: Proptypes.string,
  keyboardType?: 'number-pad' | 'default',
  multiline?: PropTypes.bool,
  password?: PropTypes.bool,
  wrapperStyle?: ViewStyle,
  inputStyle?: ViewStyle,
  currencySymbolStyle?: ViewStyle,
  invalid?: PropTypes.bool,
  invalidMessage?: Proptypes.string,
  blurOnSubmit?: PropTypes.bool,
  disabled?: PropTypes.bool,
  returnKeyType?: 'default',
  onBlur: () => void,
  onFocus: () => void,
  rawErrors: PropTypes.array,
  keyboardAppearance: Proptypes.string,
  icon?: Proptypes.string,
  currencyOptions: Proptypes.object,
}

type State = {
  touched: PropTypes.bool,
  numberValue: Proptypes.number,
  stringValue: Proptypes.string,
}

class MoneyField extends PureComponent<Props, State> {
  state: State = {
    touched: false,
    numberValue: 0,
    stringValue: ''
  }

  inputRef: TextInput | null = null

  onBlur = () => {
    const { touched } = this.state

    if (!touched) {
      this.setState({
        touchede: true
      })
    }
    this.props.onBlur();
  }

  focus = () => {
    this.inputRef && this.inputRef.focus()
    this.props.onFocus();
  }

  blur = () => {
    this.inputRef && this.inputRef.blur()
    this.props.onBlur();
  }

  formatCurrencyToNumber = (strValue) => {
    if (strValue) {
      const numberValue =  strValue.replace(new RegExp('\\' + ',', 'g'), '');
      try {
        const res = parseFloat(numberValue);
      } catch (err) {
        return strValue;
      }
    }
    return strValue;
  }

  _onChange = (value) => {
    const { options, currencyOptions } = this.props;
    if (value !== '') {
      const mergedCurrencyOptions = { ...DEFAULT_CURRENCY_OPTIONS, ...currencyOptions };
      const numberValue = currencyFormatter.unformat(value, mergedCurrencyOptions);
      const stringValue = currencyFormatter.format(numberValue, mergedCurrencyOptions);
      this.setState({ numberValue, stringValue }, () => {
        this.props.onChange(numberValue);
      });
      return;
    }

    this.props.onChange(options.emptyValue);
  }

  renderCurrencySymbol() {
    const { currencyOptions, currencySymbolStyle } = this.props;
    const mergedCurrencyOptions = { ...DEFAULT_CURRENCY_OPTIONS, ...currencyOptions };
    const { symbol } = mergedCurrencyOptions;
    return (
      <View style={[styles.currencySymbol, currencySymbolStyle]}>
        <Text>{symbol}</Text>
      </View>
    );
  }

  render() {
    const {
      icon,
      schema,
      placeholder,
      autoCapitalize,
      password,
      wrapperStyle,
      inputStyle,
      value,
      onChange,
      multiline,
      invalid,
      invalidMessage,
      blurOnSubmit,
      returnKeyType,
      formContext,
      onBlur,
      onFocus,
      options,
      disabled,
      rawErrors,
      keyboardType,
      type,
      keyboardAppearance,
    } = this.props
    const { touched } = this.state
    const showError = rawErrors && rawErrors.length > 0
    let keyboardTypeUse = keyboardType ? keyboardType : 'default'
    let placeholderUse = placeholder
    if (schema && schema.hasOwnProperty('keyboardType')) {
      keyboardTypeUse = schema['keyboardType']
    }
    if (schema && schema.hasOwnProperty('placeholder')) {
      placeholderUse = schema['placeholder']
    }
    let maxLength = null
    if (schema && schema.hasOwnProperty('maxLength')) {
      maxLength = parseInt(schema.maxLength)
    }

    return (
      <Fragment>
        <View style={[styles.wrapper, wrapperStyle]}>
          <TextInput
            placeholder={placeholderUse}
            keyboardType={keyboardTypeUse}
            value={value ? this.state.stringValue : ''}
            onChangeText={this._onChange}
            secureTextEntry={password || false}
            style={[
              styles.textInput,
              multiline ? styles.textInputMultiLine : null,
              inputStyle,
              showError ? styles.textInputInvalid : null
            ]}
            placeholderTextColor={csstyles.vars.csPlaceHolder}
            onBlur={this.onBlur}
            autoCapitalize={autoCapitalize ? autoCapitalize : 'none'}
            underlineColorAndroid="transparent"
            multiline={multiline}
            keyboardAppearance={keyboardAppearance ? keyboardAppearance : "light"}
            ref={(ref) => {
              this.inputRef = ref
            }}
            maxLength={ maxLength ? maxLength : null }
            blurOnSubmit={blurOnSubmit ? blurOnSubmit : true}
            returnKeyType={returnKeyType}
            editable={!disabled}
          />
          {this.renderCurrencySymbol()}
        </View>
        <View>
          {showError && (
            <View style={styles.errorWrapper}>
              {rawErrors.map((error, i) => (
                <Text key={i} style={styles.errorText}> {error}</Text>
                ))}
            </View>
          )}
        </View>
      </Fragment>
    );
  }
}

export default MoneyField;

MoneyField.defaultProps = {
  password: false,
  keyboardType: 'default',
  multiline: false,
  currencyOptions: DEFAULT_CURRENCY_OPTIONS,
  currencySymbolStyle: {},
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: csstyles.vars.csBoxSpacing,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon:{
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  textInput: {
    flex: 1,
    height: csstyles.vars.csInputHeight,
    // borderRadius: csstyles.vars.csInputBorderRaius,
    paddingLeft: csstyles.vars.csInputHorizontalPadding,
    paddingRight: csstyles.vars.csInputHorizontalPadding,
    overflow: 'visible',
    backgroundColor: csstyles.vars.csWhite,
    color: csstyles.vars.csGrey,
    ...csstyles.text.regular,
    fontSize: 15,
    // ...csstyles.base.shadow
  },
  currencySymbol: {
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  formatMoney: {
    color: csstyles.vars.csGreen,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  textInputMultiLine: {
    borderRadius: csstyles.vars.csBoxBorderRadius,
    height: 'auto',
    minHeight: csstyles.vars.csInputHeight * 3,
    paddingTop: csstyles.vars.csInputHeight - 16 * 2,
    paddingBottom: csstyles.vars.csInputHeight - 16 * 2,
    textAlignVertical: 'top'
  },
  textInputInvalid: {
    borderColor: csstyles.vars.csDanger
  },
  errorWrapper: {
    marginTop: 3,
    paddingLeft: csstyles.vars.csInputHeight,
    marginBottom: csstyles.vars.csBoxSpacing,
  },
  errorText: {
    ...csstyles.text.medium,
    color: csstyles.vars.csDanger,
    fontStyle: 'italic',
    fontSize: 13
  },
});