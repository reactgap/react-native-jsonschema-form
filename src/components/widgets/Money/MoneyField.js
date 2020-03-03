// @flow

import React, { PureComponent, Fragment } from 'react';
import { Text, View, TextInput, StyleSheet, type ViewStyle } from 'react-native';
import currencyFormatter from 'currency-formatter';

import csstyles from '../../styles';

const DEFAULT_CURRENCY_OPTIONS = {
  symbol: 'VND',
  decimal: '.',
  thousand: ',',
  precision: 0,
  format: '%v',
};

type Props = {
  placeholder: string,
  autoCapitalize?: 'none' | 'words',
  fieldType: null,
  onChange?: (text: string) => void,
  value?: string,
  keyboardType?: 'number-pad' | 'default',
  multiline?: boolean,
  password?: boolean,
  wrapperStyle?: ViewStyle,
  inputStyle?: ViewStyle,
  currencySymbolStyle?: ViewStyle,
  invalid?: boolean,
  invalidMessage?: string,
  blurOnSubmit?: boolean,
  disabled?: boolean,
  returnKeyType?: 'default',
  onBlur: () => void,
  onFocus: () => void,
  rawErrors: array,
  keyboardAppearance: string,
  icon?: string,
  currencyOptions: object,
};

type State = {
  numberValue: number,
  stringValue: string,
};

class MoneyField extends PureComponent<Props, State> {
  state: State = {
    numberValue: 0,
    stringValue: '',
  };

  constructor(props: Props) {
    super(props);
    const mergedCurrencyOptions = { ...DEFAULT_CURRENCY_OPTIONS, ...props.currencyOptions };
    const stringValue = currencyFormatter.format(props.value, mergedCurrencyOptions);

    this.state = {
      numberValue: props.value,
      stringValue: stringValue,
    };
  }

  inputRef: TextInput | null = null;

  focus = () => {
    this.inputRef && this.inputRef.focus();
    const { onFocus } = this.props;
    onFocus && onFocus();
  };

  blur = () => {
    this.inputRef && this.inputRef.blur();
    this.props.onBlur();
  };

  _onChange = value => {
    const { currencyOptions } = this.props;
    if (value !== '') {
      const mergedCurrencyOptions = { ...DEFAULT_CURRENCY_OPTIONS, ...currencyOptions };
      const numberValue = currencyFormatter.unformat(value, mergedCurrencyOptions);
      const stringValue = currencyFormatter.format(numberValue, mergedCurrencyOptions);
      this.setState({ numberValue, stringValue }, () => {
        this.props.onChange(numberValue);
      });
      return;
    }

    this.props.onChange(0);
  };

  renderCurrencySymbol() {
    const { currencyOptions, currencySymbolStyle, currencySymbolVisible } = this.props;
    if (!currencySymbolVisible) {
      return null;
    }

    const mergedCurrencyOptions = { ...DEFAULT_CURRENCY_OPTIONS, ...currencyOptions };
    const { symbol } = mergedCurrencyOptions;
    return (
      <View style={[styles.currencySymbol, currencySymbolStyle]}>
        <Text>{symbol}</Text>
      </View>
    );
  }

  getPlaceHolder = () => {
    const { min, max, placeHolder, currencyOptions } = this.props;
    if (!min && !max) {
      return placeHolder;
    }
    const mergedCurrencyOptions = { ...DEFAULT_CURRENCY_OPTIONS, ...currencyOptions };
    const { symbol } = mergedCurrencyOptions;
    if (min && max) {
      const minValueFormat = currencyFormatter.format(min, mergedCurrencyOptions);
      const maxValueFormat = currencyFormatter.format(max, mergedCurrencyOptions);
      return `${minValueFormat} - ${maxValueFormat} (${symbol})`;
    } else if (min) {
      const minValueFormat = currencyFormatter.format(min, mergedCurrencyOptions);
      return `Min: ${minValueFormat}`;
    } else {
      const maxValueFormat = currencyFormatter.format(max, mergedCurrencyOptions);
      return `Max: ${maxValueFormat}`;
    }
  };

  renderError = () => {
    const { min, max, value, currencyOptions, rawErrors } = this.props;
    let msgError = '';
    if (value) {
      const rangeMinMax = this.getPlaceHolder();
      if ((min && value < min) || (max && value > max)) {
        msgError = `Vui lòng nhập số tiền trong khoảng ${rangeMinMax}`;
      }
    }

    if ((msgError && msgError.length > 0) || (rawErrors && rawErrors.length > 0)) {
      return (
        <View>
          <View style={styles.errorWrapper}>
            <Text style={styles.errorText}>{msgError}</Text>
            {(rawErrors || []).map((error, i) => (
              <Text key={i} style={styles.errorText}>
                {error}
              </Text>
            ))}
          </View>
        </View>
      );
    }
    return null;
  };

  render() {
    const {
      schema,
      placeholder,
      autoCapitalize,
      password,
      wrapperStyle,
      inputStyle,
      value,
      multiline,
      blurOnSubmit,
      returnKeyType,
      disabled,
      rawErrors,
      keyboardType,
      keyboardAppearance,
    } = this.props;
    const showError = rawErrors && rawErrors.length > 0;
    let keyboardTypeUse = keyboardType ? keyboardType : 'number-pad';
    let placeholderUse = this.getPlaceHolder();
    if (schema && schema.hasOwnProperty('placeholder')) {
      placeholderUse = schema['placeholder'];
    }

    let maxLength = null;
    if (schema && schema.hasOwnProperty('maxLength')) {
      maxLength = parseInt(schema.maxLength);
    }

    return (
      <Fragment>
        <View style={[styles.wrapper, wrapperStyle]}>
          <TextInput
            placeholder={placeholderUse}
            placeholderTextColor={csstyles.vars.csPlaceHolder}
            keyboardType={keyboardTypeUse}
            value={value ? this.state.stringValue : ''}
            onChangeText={this._onChange}
            secureTextEntry={password || false}
            style={[
              styles.textInput,
              multiline ? styles.textInputMultiLine : null,
              inputStyle,
              showError ? styles.textInputInvalid : null,
            ]}
            autoCapitalize={autoCapitalize ? autoCapitalize : 'none'}
            underlineColorAndroid="transparent"
            multiline={multiline}
            keyboardAppearance={keyboardAppearance ? keyboardAppearance : 'light'}
            ref={_ref => {
              this.inputRef = _ref;
              const { inputRef } = this.props;
              if (inputRef) {
                inputRef(_ref);
              }
            }}
            maxLength={maxLength ? maxLength : null}
            blurOnSubmit={blurOnSubmit ? blurOnSubmit : true}
            returnKeyType={returnKeyType}
            editable={!disabled}
          />
          {this.renderCurrencySymbol()}
        </View>
        {this.renderError()}
      </Fragment>
    );
  }
}

export default MoneyField;

MoneyField.defaultProps = {
  password: false,
  keyboardType: 'number-pad',
  multiline: false,
  currencyOptions: DEFAULT_CURRENCY_OPTIONS,
  currencySymbolStyle: {},
  currencySymbolVisible: true,
  min: null,
  max: null,
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: csstyles.vars.csBoxSpacing,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: csstyles.vars.csInputHeight,
    paddingLeft: csstyles.vars.csInputHorizontalPadding,
    paddingRight: csstyles.vars.csInputHorizontalPadding,
    overflow: 'visible',
    backgroundColor: csstyles.vars.csWhite,
    color: csstyles.vars.csGrey,
    ...csstyles.text.regular,
    fontSize: 15,
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
    textAlignVertical: 'top',
  },
  textInputInvalid: {
    borderColor: csstyles.vars.csDanger,
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
    fontSize: 13,
  },
});
