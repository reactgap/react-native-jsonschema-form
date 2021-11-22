// @flow

import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Platform, Keyboard } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TextField } from 'rn-material-ui-textfield';

import { convertDateToString, parserStringToDate } from './DatetimeFormat';
import csstyles from '../../styles';
import DatePicker from './DatePicker';
import Errors from '../Errors/ErrorTextField';
const IS_ANDROID = Platform.OS === 'android';

type Props = {
  value: string,
  onChange: (value: String) => void,
  label?: string,
  pickerCenter?: boolean,
  disabled: boolean,
  schema?: any,
  icon?: string,
};

type State = {
  showingPicker: boolean,
};

class DateTimeWidget extends PureComponent<Props, State> {
  state: State = {
    showingPicker: false,
    value: null,
  };
  data = null;
  selectedIndex = null;
  inputRef: TextInput | null = null;

  onPress = async () => {
    this.setState({
      showingPicker: true,
    });
  };

  onChange = (value: Date) => {
    const { onChange } = this.props;
    this.setState({
      showingPicker: false,
    });
    if (value) {
      const dateValue = convertDateToString(value, null);
      onChange(dateValue);
    }
  };

  onClose = () => {
    this.setState({
      showingPicker: false,
    });
  };

  onFocus = () => {
    Keyboard.dismiss();
    this.setState(
      {
        showingPicker: true,
      },
      () => {},
    );
  };

  onPressClear = () => {
    this.props.onChange(undefined);
    if (this.inputRef) {
      this.inputRef.setValue('');
    }
  };

  renderFormUIMode = (date) => {
    const {
      value,
      label,
      schema,
      disabled,
      icon,
      uiMode,
      editable,
      wrapperStyle,
      inputContainerStyle,
      containerStyle,
      placeholder,
      maxLength,
      rawErrors,
      required,
      labelTextStyle,
      labelFontSize,
    } = this.props;

    switch (uiMode) {
      case 'material':
        const showError = rawErrors && rawErrors.length > 0;
        const errorMsg = showError ? rawErrors[0] : null;
        const labelDisplay = required ? `${label}*` : label;

        return (
          <View style={styles.pickerContainer}>
            <TextField
              label={labelDisplay || ''}
              keyboardType="default"
              blurOnSubmit={false}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              value={value}
              maxLength={maxLength}
              style={wrapperStyle}
              editable={!IS_ANDROID}
              error={errorMsg}
              ref={(ref) => {
                this.inputRef = ref;
              }}
              inputContainerStyle={[inputContainerStyle]}
              containerStyle={[styles.textfieldContainer, containerStyle]}
              labelTextStyle={[{ paddingTop: 2 }, labelTextStyle]}
              labelFontSize={labelFontSize || 13}
            />
            <TouchableOpacity
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              onPress={this.onPress}>
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            </TouchableOpacity>
            {date ? (
              <TouchableOpacity
                style={[styles.iconMaterial, { width: 20 }]}
                onPress={this.onPressClear}>
                <FontAwesome5
                  size={18}
                  style={{ top: 3 }}
                  name="times-circle"
                  color={csstyles.vars.csLightGrey}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.iconMaterial}>
                <FontAwesome5 size={20} name="sort-down" color={csstyles.vars.csLightGrey} />
              </View>
            )}
          </View>
        );

      default:
        return (
          <View style={styles.wrapperInput}>
            {icon && (
              <View style={styles.inputIcon}>
                <FontAwesome5 size={15} name={icon} color={'#646A64'} solid={true} />
              </View>
            )}
            <View style={[styles.inputContainer]}>
              <Text style={styles.inputText}>{value}</Text>
              {date && (
                <TouchableOpacity style={styles.clearIcon} onPress={this.onPressClear}>
                  <FontAwesome5 size={16} name="times-circle" color={csstyles.vars.csLightGrey} />
                </TouchableOpacity>
              )}

              <View style={styles.pickerIcon}>
                <FontAwesome5 size={15} name="chevron-down" color={csstyles.vars.csGrey} />
              </View>
            </View>
          </View>
        );
    }
  };

  render() {
    const {
      value,
      label,
      pickerCenter,
      schema,
      rawErrors,
      disabled,
      icon,
      uiMode,
      endDate,
      afterCurrentDate,
      format,
      minimumDate,
    } = this.props;
    const { showingPicker } = this.state;
    const showError = rawErrors && rawErrors.length > 0 && uiMode !== 'material';

    const date = value ? parserStringToDate(value) : null;
    return (
      <>
        <DatePicker
          isOpen={showingPicker}
          value={date}
          onChange={this.onChange}
          label={label}
          picking={'date'}
          center={pickerCenter}
          endDate={endDate}
          afterCurrentDate={afterCurrentDate}
          format={format || 'MM/DD/YYYY'}
          minimumDate={minimumDate}
          onCloseModel={this.onClose}
        />
        <View
          style={{
            marginBottom: csstyles.vars.csBoxSpacing,
          }}>
          <View style={csstyles.base.rowCenter}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={this.onPress}
              style={{
                flex: 1,
              }}
              disabled={disabled ? disabled : false}>
              {this.renderFormUIMode(date)}
            </TouchableOpacity>
          </View>
          {showError && <Errors errors={rawErrors} />}
        </View>
      </>
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
  inputContainer: {
    flex: 1,
    height: csstyles.vars.csInputHeight,
    overflow: 'visible',
    backgroundColor: csstyles.vars.csWhite,
    position: 'relative',
    justifyContent: 'center',
    borderColor: '#EBEBEB',
    borderWidth: 1,
    paddingLeft: csstyles.vars.csInputHorizontalPadding,
    paddingRight: csstyles.vars.csInputHeight + csstyles.vars.csBoxSpacing,
    // ...csstyles.base.shadow
  },
  wrapperInput: {
    marginBottom: csstyles.vars.csBoxSpacing,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    flexDirection: 'row',
  },
  inputContainerInvalid: {
    borderColor: csstyles.vars.csDanger,
  },
  inputIcon: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  inputText: {
    color: csstyles.vars.csGrey,
    ...csstyles.text.regular,
    fontSize: 14,
    textAlignVertical: 'center',
  },
  pickerIcon: {
    width: csstyles.vars.csInputHeight,
    height: csstyles.vars.csInputHeight - 2,
    backgroundColor: '#EBEBEB',
    ...csstyles.base.center,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  clearIcon: {
    width: csstyles.vars.csInputHeight,
    height: csstyles.vars.csInputHeight,
    ...csstyles.base.center,
    position: 'absolute',
    top: 0,
    right: 40,
  },
  clearIconMaterial: {
    width: csstyles.vars.csInputHeight,
    height: csstyles.vars.csInputHeight,
    ...csstyles.base.center,
    position: 'absolute',
    top: 25,
    right: 0,
  },
  label: {
    paddingLeft: csstyles.vars.csInputHorizontalPadding,
    ...csstyles.text.textPrimary,
    ...csstyles.text.medium,
    fontSize: 13,
    marginBottom: csstyles.vars.csBoxSpacingHalf,
  },
  textfieldContainer: {
    height: 80,
  },
  iconMaterial: {
    width: '100%',
    height: csstyles.vars.csInputHeight,
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    top: 20,
    right: 0,
  },
  pickerContainer: {
    height: '100%',
  },
});

export default DateTimeWidget;
