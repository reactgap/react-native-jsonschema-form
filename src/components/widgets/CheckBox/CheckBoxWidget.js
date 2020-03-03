import React from 'react';
import {
  Animated,
  LayoutAnimation,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import MoneyField from '../Money/MoneyField';
import csstyles from '../../styles';

export default class CheckBoxField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: !!props.selected,
      money: props.value,
      moneyVisible: !!props.selected,
      fadeAnim: new Animated.Value(0),
    };
  }

  onPressField = () => {
    if (this.props.disabled) {
      return;
    }

    const { selected, moneyVisible } = this.state;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring, () => {
      // this may not have callback, bug
    });
    this.setState(
      {
        selected: !selected,
        moneyVisible: !moneyVisible,
      },
      () => {
        this.inputRef && this.inputRef.focus();
        this.props.onChange({
          selected: this.state.selected,
          value: this.state.money,
        });
      },
    );
  };

  onTextInputChange = numberValue => {
    this.setState({ money: numberValue }, () => {
      this.props.onChange({
        selected: this.state.selected,
        value: this.state.money,
      });
    });
  };

  renderCheckBox() {
    const { tintColor, iconSize, checkedIcon, uncheckedIcon, label, disabled } = this.props;

    const iconName = this.state.selected ? checkedIcon : uncheckedIcon;
    return (
      <TouchableOpacity disabled={disabled} style={styles.row} onPress={this.onPressField}>
        <Icon name={iconName} color={tintColor} size={iconSize} />
        <Text style={styles.text}>{label}</Text>
        <Icon name="caret-down" color={csstyles.vars.csGrey} size={24} />
      </TouchableOpacity>
    );
  }

  renderExtend() {
    const { placeholder, disabled, min, max } = this.props;
    if (this.state.moneyVisible) {
      return (
        <Animated.View>
          <MoneyField
            inputRef={_ref => {
              this.inputRef = _ref;
            }}
            min={min}
            max={max}
            disabled={disabled}
            wrapperStyle={styles.moneyContainer}
            onChange={this.onTextInputChange}
            currencySymbolVisible={false}
            placeholder={placeholder}
            value={this.state.money}
          />
        </Animated.View>
      );
    }

    return null;
  }

  renderError() {
    const { rawErrors } = this.props;
    if (rawErrors && rawErrors.length) {
      return (
        <View style={styles.errorWrapper}>
          <Text style={styles.errorText}>{rawErrors[0]}</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <TouchableOpacity activeOpacity={1} style={styles.container} onPress={this.onPressField}>
        {this.renderCheckBox()}
        {this.renderExtend()}
        {this.renderError()}
      </TouchableOpacity>
    );
  }
}

CheckBoxField.defaultProps = {
  tintColor: csstyles.vars.csGrey,
  iconSize: 24,
  checkedIcon: 'check-square',
  uncheckedIcon: 'square',
  placeholder: 'Nhập số tiền',
  label: '',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  text: {
    flex: 1,
    marginLeft: 16,
    textAlign: 'left',
  },
  moneyContainer: {
    marginLeft: 44,
  },
  errorText: {
    ...csstyles.text.medium,
    color: csstyles.vars.csDanger,
    fontStyle: 'italic',
    fontSize: 13,
  },
  errorWrapper: {
    marginTop: 3,
    paddingLeft: csstyles.vars.csInputHeight,
    marginBottom: csstyles.vars.csBoxSpacing,
  },
});
