import React from 'react';
import { Animated, LayoutAnimation, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
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
    const { selected, moneyVisible } = this.state;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring,
    () => {
      this.moneyRef && this.moneyRef.focus();
    });
    this.setState({
      selected: !selected,
      moneyVisible: !moneyVisible,
    }, () => {
        this.props.onChange({
          selected: this.state.selected,
          value: this.state.money,
        });
    });
  }

  onTextInputChange = (numberValue) => {
    this.setState({ money: numberValue }, () => {
      this.props.onChange({
        selected: this.state.selected,
        value: this.state.money,
      });
    });
  }

  renderCheckBox() {
    const { tintColor, iconSize, checkedIcon, uncheckedIcon, label } = this.props;
    const iconName = this.state.selected ? checkedIcon : uncheckedIcon;
    return (
        <TouchableOpacity style={styles.row} onPress={this.onPressField}>
          <Icon name={iconName} color={tintColor} size={iconSize} />
          <Text style={styles.text}>{label}</Text>
          <Icon name="caret-down" color={csstyles.vars.csGrey} size={24} />
        </TouchableOpacity>
    );
  }

  renderExtend() {
    const { placeholder } = this.props;
    if (this.state.moneyVisible) {
      return (
        <Animated.View>
          <MoneyField
            ref={_ref => {
              this.moneyRef = _ref;
            }}
            wrapperStyle={styles.moneyContainer}
            inputStyle={styles.moneyInput}
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
      <View style={styles.container} onPress={this.onPressField}>
        {this.renderCheckBox()}
        {this.renderExtend()}
        {this.renderError()}
      </View>
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
    height: 28,
  },
  moneyInput: {
    maxHeight: 24,
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