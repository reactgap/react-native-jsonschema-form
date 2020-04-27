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
import TextField from '../TextField/TextField';
import csstyles from '../../styles';

export default class CheckBoxField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: !!props.selected,
      cost: props.value?.cost?.value,
      frequencyFee: props.value?.frequencyFee?.value,
      expanding: !!props.selected,
      fadeAnim: new Animated.Value(0),
      expandInputError: null,
    };
  }

  onPressField = () => {
    if (this.props.disabled) {
      return;
    }

    const { selected, expanding } = this.state;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring, () => {
      // this may not have callback, bug
    });
    this.setState(
      {
        selected: !selected,
        expanding: !expanding,
      },
      () => {
        this.moneyRef && this.moneyRef.focus();
        this.props.onChange({
          selected: this.state.selected,
          cost: {
            ...(this.props.itemOption?.cost || {}),
            value: this.state.cost
          },
          frequencyFee: {
            ...(this.props.itemOption?.frequencyFee || {}),
            value: this.state.frequencyFee
          }
        });
      },
    );
  };

  onMoneyTextChange = numberValue => {
    this.setState({ cost: numberValue }, () => {
      this.props.onChange({
        selected: this.state.selected,
        cost: {
          ...(this.props.itemOption?.cost || {}),
          value: this.state.cost
        },
        frequencyFee: {
          ...(this.props.itemOption?.frequencyFee || {}),
          value: this.state.frequencyFee
        }
      });
    });
  };

  onFrequencyTextChange = strFrequencyFee => {
    const iFrequencyFee = this.convertFrequencyFee(strFrequencyFee);

    this.setState({ frequencyFee: iFrequencyFee }, () => {
      this.props.onChange({
        selected: this.state.selected,
        cost: {
          ...(this.props.itemOption?.cost || {}),
          value: this.state.cost
        },
        frequencyFee: {
          ...(this.props.itemOption?.frequencyFee || {}),
          value: iFrequencyFee
        }
      });
    });
  };

  getFrequencyFeePlaceHolder = (min, max) => {
    const {frequencyPlaceholder } = this.props;
    if (!min && !max) {
      return frequencyPlaceholder;
    }
    if (typeof min === 'number' && typeof max === 'number') {
      return `${min} - ${max} tháng`;
    } else if (typeof min === 'number') {
      return `Min: ${min} tháng`;
    } else if (typeof max === 'number') {
      return `Max: ${max} tháng`;
    }
    return frequencyPlaceholder;
  };

  convertFrequencyFee = (strFrequencyFee) => {
    let iFrequencyFee;
    try {
      if (strFrequencyFee && strFrequencyFee.length) {
        iFrequencyFee = parseInt(strFrequencyFee);
      }
    } catch (err) {
      //
    }
    return iFrequencyFee;
  }


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

  renderMoneyField() {
    const { itemOption, moneyPlaceholder, disabled } = this.props;
    const { min, max, required, placeholder } = itemOption?.cost || {};
    return (
      <MoneyField
        inputRef={_ref => {
          this.moneyRef = _ref;
        }}
        min={min}
        max={max}
        disabled={disabled}
        wrapperStyle={styles.moneyContainer}
        inputStyle={styles.txtMoney}
        onChange={this.onMoneyTextChange}
        currencySymbolVisible={false}
        placeholder={placeholder || moneyPlaceholder}
        value={this.state.cost}
      />
    )
  }

  renderFrequencyFee() {
    const { itemOption, disabled } = this.props;
    const { min, max, required } = itemOption?.frequencyFee || {}
    let placeholder = this.getFrequencyFeePlaceHolder(min, max);

    return (
      <View style={styles.frequencyContainer}>
        <TextField
          disabled={disabled}
          placeholder={placeholder}
          inputStyle={styles.txtFrequency}
          value={this.state.frequencyFee || ''}
          onChange={this.onFrequencyTextChange}
          keyboardType="number-pad"
        />
      </View>
    )
  }

  renderExtend() {
    if (this.state.expanding) {
      return (
        <Animated.View style={styles.expandContainer}>
          {this.renderMoneyField()}
          {this.renderFrequencyFee()}
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
  moneyPlaceholder: 'Nhập mệnh giá',
  frequencyPlaceholder: 'Nhập kì hạn',
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
  expandContainer: {
    flex: 1,
    marginHorizontal: 34,
    justifyContent: 'space-between'
  },
  moneyContainer: {
  },
  frequencyContainer: {
  },
  txtMoney: {
    fontSize: 13,
    lineHeight: 16,
  },
  txtFrequency: {
    fontSize: 13,
    lineHeight: 16,
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
