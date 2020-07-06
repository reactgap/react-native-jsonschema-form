// @flow

import React, { PureComponent } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  DatePickerAndroid,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { convertDateToString, parserStringToDate } from './DatetimeFormat';
import csstyles from '../../styles';
import DatePicker from './DatePicker';
import Picker from '../Picker/Picker';
import Errors from '../Errors/ErrorTextField';

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
  };
  data = null;
  selectedIndex = null;

  onPress = async () => {
    if (Platform.OS === 'ios') {
      this.setState({
        showingPicker: true,
      });
    } else {
      // For android
      const { value, onChange } = this.props;
      try {
        const now = new Date();
        const date = value
          ? parserStringToDate(value)
          : new Date(
              now.getFullYear() - 18,
              now.getMonth(),
              now.getDate(),
              now.getHours(),
              now.getHours(),
              now.getMinutes(),
            );

        const { action, year, month, day } = await DatePickerAndroid.open({
          date,
          maxDate: now,
        });

        if (action !== DatePickerAndroid.dismissedAction) {
          const selectedDate = new Date(year, month, day);
          this.onChange(selectedDate);
        }

        // onChange(selectedValue)
      } catch (error) {
        console.log(error);
      }
    }
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

  onPressClear = () => {
    this.props.onChange(undefined);
  };

  render() {
    const { value, label, pickerCenter, schema, rawErrors, disabled, icon, mode } = this.props;
    const { showingPicker } = this.state;
    const showError = rawErrors && rawErrors.length > 0;

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
                      <FontAwesome5 size={20} name="times-circle" color={csstyles.vars.csGrey} />
                    </TouchableOpacity>
                  )}

                  <View style={styles.pickerIcon}>
                    <FontAwesome5 size={15} name="chevron-down" color={csstyles.vars.csGrey} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {showError && <Errors errors={rawErrors} />}
        </View>
      </>
    );
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
    height: csstyles.vars.csInputHeight - 2,
    ...csstyles.base.center,
    position: 'absolute',
    top: 0,
    right: 44,
  },
  label: {
    paddingLeft: csstyles.vars.csInputHorizontalPadding,
    ...csstyles.text.textPrimary,
    ...csstyles.text.medium,
    fontSize: 13,
    marginBottom: csstyles.vars.csBoxSpacingHalf,
  },
});

export default DateTimeWidget;
