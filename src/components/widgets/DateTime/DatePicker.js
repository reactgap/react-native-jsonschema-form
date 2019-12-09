// @flow

import React, { Component } from 'react';
import {
  View,
  Modal,
  Animated,
  DatePickerIOS,
  Easing,
  StyleSheet,
  TouchableOpacity,
  type LayoutChangeEvent,
} from 'react-native';
import csstyles from '../../styles';
import { DEVICE_BOTTOM_SAFE } from '../../../deviceHelper';
import CSButton from '../Button/CSButton/CSButton';
import moment from 'moment';

type Props = {
  isOpen: boolean,
  value: Date | null,
  picking: 'date' | 'time',
  onChange: (value: Date) => void,
  center?: boolean,
  startDate: Date | null,
};

type State = {
  currentDate: Date,
};

class DatePicker extends Component<Props, State> {
  animateValue: Animated.Value = new Animated.Value(-999);

  contentHeight: number = 0;

  shouldOpen = false;

  constructor(props: Props) {
    super(props);

    const { startDate, endDate, currentDate } = this.getDateFromProps(props);
    this.state = {
      startDate,
      endDate,
      currentDate,
    };
  }

  getDateFromProps(props: Props) {
    const { startDate, endDate, value, format } = props;
    const formatDate = format || 'MM/DD/YYYY';
    const dateState = {
      startDate: null,
      endDate: null,
      currentDate: null,
    };

    if (startDate) {
      dateState.startDate = moment(startDate, formatDate).toDate();
    } else {
      dateState.startDate = new Date();
    }
    if (endDate) {
      dateState.endDate = moment(endDate, formatDate).toDate();
    } else {
      dateState.endDate = new Date();
    }
    if (value) {
      dateState.currentDate = value;
    } else {
      const now = new Date();
      dateState.currentDate = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate());
    }
    return dateState;
  }

  shouldComponentUpdate(nextProps: Props) {
    const { isOpen, value, center } = this.props;

    if (!center) {
      if (!isOpen && nextProps.isOpen) {
        if (this.contentHeight !== 0) {
          this.toggleUp();
        } else {
          this.shouldOpen = true;
        }
      } else if (isOpen && !nextProps.isOpen) {
        this.toggleDown();

        return false;
      }
    } else if (!isOpen && nextProps.isOpen) {
      this.state.currentDate = nextProps.value;
    }

    return isOpen !== nextProps.isOpen || value !== nextProps.value;
  }

  onContentLayout = ({
    nativeEvent: {
      layout: { height },
    },
  }: LayoutChangeEvent) => {
    const heightPlusBottom = height + DEVICE_BOTTOM_SAFE + csstyles.vars.csBoxSpacing;

    if (this.contentHeight === 0) {
      this.animateValue.setValue(-heightPlusBottom);
    }

    this.contentHeight = heightPlusBottom;

    if (this.shouldOpen) {
      this.toggleUp();
    }
  };

  toggleUp = () => {
    const { value } = this.props;

    this.selectedDate = value;

    Animated.spring(this.animateValue, {
      toValue: 0,
    }).start(() => {
      this.shouldOpen = false;
    });
  };

  toggleDown = () => {
    Animated.timing(this.animateValue, {
      duration: 250,
      toValue: -this.contentHeight,
      easing: Easing.inOut(Easing.ease),
    }).start(() => {
      this.forceUpdate();
    });
  };

  onDateChange = (value: Date) => {
    if (value) {
      this.setState({ currentDate: value });
    }
  };

  onClose = () => {
    const { onChange, value } = this.props;
    onChange(value);
  };

  onDone = () => {
    const { onChange } = this.props;

    onChange(this.state.currentDate);
  };

  renderContent = () => {
    const { value, picking, center } = this.props;

    return (
      <View
        style={[styles.contentContainer, center && styles.contentContainerCenter]}
        onLayout={center ? null : this.onContentLayout}>
        <DatePickerIOS
          date={this.state.currentDate}
          maximumDate={this.state.endDate}
          onDateChange={this.onDateChange}
          mode={picking}
          timeZoneOffsetInMinutes={new Date().getTimezoneOffset() * -1}
          locale={'vi'}
        />
        <View style={[styles.actionBtnContainer]}>
          <CSButton type="primary" leftIcon="check" iconOnly onPress={this.onDone} />
        </View>
      </View>
    );
  };

  renderBgTouchable = () => {
    const { center } = this.props;
    const horizontalPosition = 20;

    return (
      <TouchableOpacity
        style={[
          csstyles.base.absoluteFull,
          center && {
            left: horizontalPosition,
            right: horizontalPosition,
          },
        ]}
        activeOpacity={1}
        onPress={this.onClose}>
        <View />
      </TouchableOpacity>
    );
  };

  renderAnimationContent = () => {
    const { center } = this.props;

    if (center) {
      return (
        <View style={[csstyles.base.fullCenter, csstyles.base.row, csstyles.base.relative]}>
          {this.renderBgTouchable()}
          {this.renderContent()}
        </View>
      );
    }

    return (
      <>
        {this.renderBgTouchable()}
        <Animated.View
          style={[
            styles.animationView,
            {
              bottom: this.animateValue,
            },
          ]}>
          {this.renderContent()}
        </Animated.View>
      </>
    );
  };

  render() {
    const { isOpen, center } = this.props;
    return (
      <Modal
        visible={isOpen}
        animationType={center ? 'fade' : 'none'}
        onRequestClose={() => {}}
        transparent>
        <View style={styles.modalWrapper}>{this.renderAnimationContent()}</View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: csstyles.mixin.csBlackOpacity(0.5),
  },
  actionBtnContainer: {
    ...csstyles.base.rowCenter,
    paddingBottom: csstyles.vars.csBoxSpacing,
    paddingHorizontal: csstyles.vars.csBoxSpacing,
  },
  contentContainer: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: csstyles.vars.csWhite,
    borderColor: csstyles.vars.csGreen,
    borderWidth: csstyles.vars.csBoxBorderWidth,
    borderRadius: csstyles.vars.csBoxBorderRadius2x,
    marginBottom: DEVICE_BOTTOM_SAFE + csstyles.vars.csBoxSpacing,
  },
  contentContainerCenter: {
    // paddingTop: csstyles.vars.csBoxSpacing
  },
  actionBtnContainerCenter: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  animationView: {
    position: 'absolute',
    left: csstyles.vars.csBoxSpacing2x,
    right: csstyles.vars.csBoxSpacing2x,
  },
});

export default DatePicker;
