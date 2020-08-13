// @flow

import React, { PureComponent } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TextField, FilledTextField, OutlinedTextField } from 'react-native-material-textfield';

import csstyles from '../../styles';
import Picker from '../Picker/Picker';
import localData from '../../../data/vietnam_provinces_districts.json';
import Errors from '../../widgets/Errors/ErrorTextField';

type Props = {
  value: string,
  onChange: (value: String) => void,
  label?: string,
  pickerCenter?: boolean,
  referValue: string,
  disabled: boolean,
  hiddenDistrict: boolean,
  districtRequired: boolean,
};

type State = {
  showingPicker: boolean,
};

class TextFieldPicker extends PureComponent<Props, State> {
  state: State = {
    showingPicker: false,
  };
  mode = 'provinces';
  data = null;
  selectedIndex = null;
  inputDistrictRef: TextField | null = null;
  inputProvinceRef: TextField | null = null;

  onPress = (mode: 'provinces' | 'districts') => {
    const { value } = this.props;
    const district = this.props.referValue;
    this.mode = mode;
    var name = '';
    if (mode === 'districts') {
      name = district;
      let provinceData = localData.find((x) => x.name === value);
      this.data = provinceData.districts || [];
    } else {
      this.data = localData;
      name = value;
    }

    this.selectedIndex = this.data.findIndex((x) => x.name === name);
    this.setState({
      showingPicker: true,
    });
  };

  onChange = (value: String) => {
    const { onChange, onChangeReferKey, referValue } = this.props;
    if (this.mode == 'provinces') {
      this.setState({
        showingPicker: false,
      });
      onChange(value);
      if (value !== this.props.value && this.props.value !== undefined) {
        // delay for onchange province
        setTimeout(() => {
          onChangeReferKey('district', null);
        }, 300);
      }
    } else {
      this.setState({
        showingPicker: false,
      });
      onChangeReferKey('district', value);
    }
  };

  setProvinceInputValue = (value) => {
    if (this.inputProvinceRef) {
      this.inputProvinceRef.setValue(value);
    }
  };

  setDistrictInputValue = (value) => {
    if (this.inputDistrictRef) {
      this.inputDistrictRef.setValue(value);
    }
  };

  onClose = () => {
    this.setState({
      showingPicker: false,
    });
  };

  renderProvinceUIMode = () => {
    const {
      uiMode,
      label,
      icon,
      rawErrors,
      value,
      inputContainerStyle,
      containerStyle,
    } = this.props;
    const showError = rawErrors && rawErrors.length > 0;

    switch (uiMode) {
      case 'material':
        const errorMsg = null;
        return (
          <>
            <TextField
              label={label || ''}
              keyboardType="default"
              blurOnSubmit={false}
              value={value}
              editable={false}
              error={errorMsg}
              ref={(ref) => {
                this.inputProvinceRef = ref;
              }}
              inputContainerStyle={[inputContainerStyle]}
              containerStyle={containerStyle}
            />
            <View style={styles.iconMaterial}>
              <FontAwesome5 size={20} name="sort-down" color={csstyles.vars.csLightGrey} />
            </View>
          </>
        );
        break;

      default:
        return (
          <View style={styles.wrapperInput}>
            {icon && (
              <View style={styles.inputIcon}>
                <FontAwesome5 size={15} name={icon} color={'#646A64'} solid={true} />
              </View>
            )}
            <View style={[styles.inputContainer, showError ? styles.inputContainerInvalid : null]}>
              <Text style={styles.inputText}>{value}</Text>

              <View style={styles.pickerIcon}>
                <FontAwesome5 size={15} name="chevron-down" color={csstyles.vars.csGrey} />
              </View>
            </View>
          </View>
        );
        break;
    }
  };

  renderDistrictUIMode = () => {
    const {
      uiMode,
      subLabel,
      icon,
      value,
      referValue,
      rawErrors,
      inputContainerStyle,
      containerStyle,
      disabled,
      hiddenDistrict,
      districtRequired,
    } = this.props;
    const showErrorDistrict = referValue == null || (referValue && referValue.length == 0);
    const showDistrictForm = value && value.length > 0;
    const isDistrictRequired =
      !hiddenDistrict &&
      (districtRequired === null || (typeof districtRequired === 'boolean' && districtRequired));

    if (!(!hiddenDistrict && showDistrictForm)) {
      return null;
    }
    switch (uiMode) {
      case 'material':
        const errorMsg = null;

        return (
          <View style={[csstyles.base.rowCenterLineBetween]}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => this.onPress('districts')}
              style={{
                flex: 1,
              }}
              disabled={disabled ? disabled : false}>
              <TextField
                label={subLabel || ''}
                keyboardType="default"
                blurOnSubmit={false}
                value={referValue}
                editable={false}
                error={errorMsg}
                ref={(ref) => {
                  this.inputDistrictRef = ref;
                }}
                inputContainerStyle={[inputContainerStyle]}
                containerStyle={containerStyle}
              />
              <View style={styles.iconMaterial}>
                <FontAwesome5 size={20} name="sort-down" color={csstyles.vars.csLightGrey} />
              </View>
            </TouchableOpacity>
          </View>
        );
        break;

      default:
        return (
          <>
            <View style={[csstyles.base.rowCenterLineBetween, { marginTop: 20 }]}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.onPress('districts')}
                style={{
                  flex: 1,
                }}
                disabled={disabled ? disabled : false}>
                <View
                  style={[
                    styles.wrapperInput,
                    showErrorDistrict && isDistrictRequired ? styles.inputContainerInvalid : null,
                  ]}>
                  {icon && (
                    <View style={styles.inputIcon}>
                      <FontAwesome5 size={15} name={icon} color={'#646A64'} solid={false} />
                    </View>
                  )}
                  <View style={[styles.inputContainer]}>
                    <Text style={styles.inputText}>{referValue}</Text>

                    <View style={styles.pickerIcon}>
                      <FontAwesome5 size={15} name="chevron-down" color={csstyles.vars.csGrey} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            {isDistrictRequired && showDistrictForm && showErrorDistrict && (
              <Errors errors={['Vui lòng chọn Quận/Huyện']} />
            )}
          </>
        );
        break;
    }
  };

  render() {
    const {
      value,
      referValue,
      label,
      pickerCenter,
      schema,
      rawErrors,
      disabled,
      icon,
    } = this.props;
    const { showingPicker } = this.state;
    const showError = rawErrors && rawErrors.length > 0;

    return (
      <View
        style={{
          marginBottom: csstyles.vars.csBoxSpacing,
        }}>
        <Picker
          isOpen={showingPicker}
          value={this.mode == 'provinces' ? value : referValue}
          selectedIndex={this.selectedIndex}
          onClose={this.onClose}
          data={this.data}
          onChange={this.onChange}
          label={label}
          center={pickerCenter}
          mode={this.mode}
        />

        {/* {label && <Text style={styles.label}>{label}</Text>} */}
        <View style={csstyles.base.rowCenter}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => this.onPress('provinces')}
            style={{
              flex: 1,
            }}
            disabled={disabled ? disabled : false}>
            {this.renderProvinceUIMode()}
          </TouchableOpacity>
        </View>
        {showError && <Errors errors={rawErrors} />}
        {this.renderDistrictUIMode()}
      </View>
    );
  }

  componentDidUpdate(prevProps: Props) {
    const { value, referValue } = this.props;
    if (value !== prevProps.value && this.inputProvinceRef) {
      this.inputProvinceRef.setValue(value);
    }
    if (referValue !== prevProps.referValue && this.inputDistrictRef) {
      this.inputDistrictRef.setValue(referValue);
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
  label: {
    paddingLeft: csstyles.vars.csInputHorizontalPadding,
    ...csstyles.text.textPrimary,
    ...csstyles.text.medium,
    fontSize: 13,
    marginBottom: csstyles.vars.csBoxSpacingHalf,
  },
  iconMaterial: {
    width: csstyles.vars.csInputHeight - 10,
    height: csstyles.vars.csInputHeight,
    ...csstyles.base.center,
    position: 'absolute',
    top: 25,
    right: 0,
  },
});

export default TextFieldPicker;
