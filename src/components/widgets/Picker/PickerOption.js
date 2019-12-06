// @flow

import React, { Component } from 'react'
import { Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ViewStyle,
} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import csstyles from '../../styles'
import Picker from './Picker'

type Props = {
  value: string,
  icon?: string,
  iconStyle?: ViewStyle,
  onChange: (value: string, index: number) => void,
  label?: string,
  pickerCenter?: boolean,
  schema: Object,
  data: string[],
  fontSize?: number,
  type: string,
  currentIndex: number,
  wrapStyles: ViewStyle,
  mainColor?: string,
  textStyle?: ViewStyle, 
  themeMode: 'light' | 'dark',
  disabled: boolean,
  placeHolder?: string,
}

type State = {
  showingPicker: boolean,
  schemaIndex: number
}

const getCurrentIndex = (props: Props): number => {
  const { value, data } = props
  if (data && value) {
    const findIndex = data.findIndex((item) => item.name === value)
    return findIndex
  }
  return -1
}

class PickerOption extends Component<Props, State> {
  selectedIndex = null

  constructor(props: Props) {
    super(props); 
    this.state = {
       showingPicker: false,
       schemaIndex: props.currentIndex ? props.currentIndex : getCurrentIndex(props)
    };
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      ...state,
      schemaIndex: getCurrentIndex(props)
    }
  }

  onPress = () => {
    const { data, schema } = this.props
    var dataPicker = data || []
    if (schema && schema.hasOwnProperty('data')) {
      dataPicker = schema['data']
    }
    if (dataPicker != null && dataPicker.length > 0) {
      this.setState({
        showingPicker: true
      })
    }
  }

  onChange = (value: String, index: Number) => {
    const { schema ,onChange, type } = this.props
    this.setState({
      showingPicker: false,
    })
    if (schema) {
      this.setState({
        schemaIndex: index
      })
      onChange(value)
    } else if (index !== null &&  typeof index === 'number') {
      onChange(value, index, type)
    }
  }

  onClose = () => {
    this.setState({
      showingPicker: false
    })
  }

  render() {
    const { schemaIndex } = this.state
    const { 
      value,
      label, 
      pickerCenter, 
      schema, 
      rawErrors, 
      data, 
      icon, 
      iconStyle, 
      fontSize, 
      currentIndex,
      wrapStyles,
      themeMode,
      mainColor,
      textStyle,
      disabled,
      placeHolder,
    } = this.props
    const { showingPicker } = this.state
    const showError = rawErrors && rawErrors.length > 0
    var dataPicker = data || []
    if (schema && schema.hasOwnProperty('data')) {
      dataPicker = schema['data']
    }

    var iconName = icon || 'calendar-alt'
    if (schema && schema.hasOwnProperty('icon')) {
      iconName = schema['icon']
    }

    var iconStyleTmp = null
    if (schema && schema.hasOwnProperty('iconStyle')) {
      iconStyleTmp = schema['iconStyle']
    } else if (iconStyle != null) {
      iconStyleTmp = iconStyle
    }

    var styleFromSchema = null 
    if (schema && schema.hasOwnProperty('style')) {
      styleFromSchema = schema['style']
    }
    
    const fontTextStyle = fontSize ? { fontSize: fontSize } : { fontSize: 15 }
    const textCustomStyle = mainColor ? { color: mainColor } : null 
    var containerStyle = styles['inputContainerLight']
    var inputTextStyle = styles['inputTextLight']
    if (themeMode && themeMode === 'dark') {
      containerStyle = styles['inputContainerDark']
      inputTextStyle = styles['inputTextDark']
    }

    return (
      <>
        <View style={styleFromSchema}>
          <Picker
            isOpen={showingPicker}
            value={value}
            selectedIndex={schema ? schemaIndex : currentIndex}
            data={dataPicker}
            onChange={this.onChange}
            onClose={this.onClose}
            label={label}
            center={pickerCenter}
            mode={this.mode}
          />
          <View style={csstyles.base.rowCenterLineBetween}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => this.onPress()}
              style={{
                flex: 1
              }}
              disabled={disabled ? disabled : false}
            >
              <View style={[ wrapStyles ? wrapStyles : containerStyle, showError ? styles.inputContainerInvalid : null]}>
                {icon && (
                  <View style={styles.inputIcon}>
                    <FontAwesome5 size={15} name={icon} color={'#646A64'} solid={false} />
                  </View>
                )}
                <Text style={[inputTextStyle, fontTextStyle, textCustomStyle, textStyle]}>
                  {value && value.length > 0 ? value : placeHolder || ''}
                </Text>

                <View style={[styles.inputIconLight, iconStyleTmp]}>
                  <FontAwesome5 size={15} name={'chevron-down'} color={mainColor ? mainColor : csstyles.vars.csGrey} />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          {showError && (
            <View style={styles.errorWrapper}>
              {
                rawErrors.map((error, i) => (
                  <Text key={i} style={styles.errorText}> {error}</Text>
                  ))
              }
            </View>
          )}
        </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  inputContainerDark: {
    height: csstyles.vars.csPickerHeight,
    overflow: 'visible',
    backgroundColor: csstyles.vars.csBlack,
    position: 'relative',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  inputContainerLight: {
    height: csstyles.vars.csPickerHeight,
    overflow: 'visible',
    backgroundColor: csstyles.vars.csWhite,
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  inputContainerInvalid: {
    borderColor: csstyles.vars.csDanger
  },
  inputTextDark: {
    color: csstyles.vars.csWhite,
    ...csstyles.text.regular,
    // padding: 5,
    textAlign: 'center'
  },
  inputTextLight: {
    color: csstyles.vars.csGrey,
    ...csstyles.text.regular,
    fontSize: 15,
    paddingLeft: csstyles.vars.csInputHorizontalPadding
  },
  inputIcon: {
    width: csstyles.vars.csPickerHeight,
    height: csstyles.vars.csPickerHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  inputIconDark: {
    width: csstyles.vars.csPickerHeight,
    height: csstyles.vars.csPickerHeight-2,
    borderRadius: csstyles.vars.csPickerBorderRadius,
    backgroundColor: csstyles.vars.csGrey,
    ...csstyles.base.center,
    position: 'absolute',
    top: 0,
    right: 0
  },
  inputIconLight: {
    width: csstyles.vars.csInputHeight,
    height: csstyles.vars.csInputHeight-2,
    backgroundColor: '#EBEBEB',
    ...csstyles.base.center,
    position: 'absolute',
    top: 0,
    right: 0
  },
  label: {
    paddingLeft: csstyles.vars.csInputHorizontalPadding,
    ...csstyles.text.textPrimary,
    ...csstyles.text.medium,
    fontSize: 13,
    marginBottom: csstyles.vars.csBoxSpacingHalf
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
  }
})

export default PickerOption
