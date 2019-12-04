// @flow

import React, { Component } from 'react';
import {
  View,
  FlatList,
  Modal,
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  type LayoutChangeEvent,
} from 'react-native';
import csstyles from '../../styles';
import {
  DEVICE_BOTTOM_SAFE,
  DEVICE_SCREEN_HEIGHT,
  DEVICE_SCREEN_WIDTH,
} from '../../../deviceHelper';
import CSButton from '../Button/CSButton/CSButton';
import ListGroupSelectableItem from './ListGroupSelectableItem';
// import { currLanguage } from '../../../utils/i18n'
// import UniversalScreenContainer from '../../UniversalScreenContainer/UniversalScreenContainer'

type Props = {
  isOpen: boolean,
  value: String,
  onChange: (value: String, index: Number) => void,
  onClose: () => void,
  center?: boolean,
  mode: 'provinces' | 'districts' | 'options',
  province: String,
  district: String,
  data: Array,
  selectedIndex: number,
};

class Picker extends Component<Props> {
  animateValue: Animated.Value = new Animated.Value(-999);

  contentHeight: number = 0;

  shouldOpen = false;

  selected: String = null;

  shouldComponentUpdate(nextProps: Props) {
    const { isOpen, value, center, selectedIndex } = this.props;
    if (!isOpen && nextProps.isOpen) {
      this.selectedIndex = nextProps.selectedIndex;
      this.selected = nextProps.value;
      if (this.contentHeight !== 0) {
        this.toggleUp();
      } else {
        this.shouldOpen = true;
      }
    } else if (isOpen && !nextProps.isOpen) {
      this.toggleDown();
      return false;
    }

    return isOpen !== nextProps.isOpen || value !== nextProps.value;
  }

  onContentLayout = ({
    nativeEvent: {
      layout: { height },
    },
  }: LayoutChangeEvent) => {
    if (this.contentHeight === 0) {
      this.animateValue.setValue(-height);
    }

    this.contentHeight = height;

    if (this.shouldOpen) {
      this.toggleUp();
    }
  };

  toggleUp = () => {
    Animated.timing(this.animateValue, {
      duration: 250,
      toValue: 0,
      easing: Easing.inOut(Easing.ease),
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

  onClose = () => {
    const { onClose, value } = this.props;
    onClose();
  };

  onDone = () => {
    const { onChange } = this.props;
    onChange(this.selected, this.selectedIndex);
  };

  renderItem = ({ item, index }) => {
    return (
      <ListGroupSelectableItem
        id={item}
        leftTitle={item.name}
        rightTitle={''}
        selected={index === this.selectedIndex}
        onPress={this.onSelected}
      />
    );
  };

  onSelected = (item: String) => {
    const { data } = this.props;
    this.selectedIndex = data.findIndex(x => x.id === item.id);
    this.selected = item.name;
    this.forceUpdate();
  };

  renderContent = () => {
    const { value, center, mode, data } = this.props;
    return (
      <View
        style={[styles.contentContainer, center && styles.contentContainerCenter]}
        onLayout={center ? null : this.onContentLayout}>
        <View style={[styles.actionBtnContainer, center && styles.actionBtnContainerCenter]}>
          <CSButton type="secondary" leftIcon="times" iconOnly onPress={this.onClose} />
          <CSButton type="primary" leftIcon="check" iconOnly onPress={this.onDone} />
        </View>
        <View
          style={{
            height: (DEVICE_SCREEN_HEIGHT * 1) / 3,
          }}>
          <FlatList
            style={csstyles.base.full}
            data={data}
            extraData={this.selectedIndex}
            keyExtractor={item => `${item.id || item._id}`}
            renderItem={this.renderItem}
            windowSize={30}
          />
        </View>
      </View>
    );
  };

  renderBgTouchable = () => {
    const { center } = this.props;
    const horizontalPosition = 0;

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
    ...csstyles.base.rowCenterLineBetween,
    paddingTop: csstyles.vars.csBoxSpacing,
    paddingBottom: csstyles.vars.csBoxSpacingHalf,
    paddingHorizontal: csstyles.vars.csBoxSpacing2x,
  },
  contentContainer: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: csstyles.vars.csWhite,
    borderColor: csstyles.vars.csGreen,
    borderWidth: csstyles.vars.csBoxBorderWidth,
    borderBottomColor: csstyles.vars.csWhite,
    borderTopLeftRadius: csstyles.vars.csBoxBorderRadius,
    borderTopRightRadius: csstyles.vars.csBoxBorderRadius,
    paddingBottom: DEVICE_BOTTOM_SAFE,
  },
  contentContainerCenter: {
    borderBottomColor: csstyles.vars.csGreen,
    borderBottomLeftRadius: csstyles.vars.csBoxBorderRadius,
    borderBottomRightRadius: csstyles.vars.csBoxBorderRadius,
    paddingTop: csstyles.vars.csBoxSpacing,
  },
  actionBtnContainerCenter: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  animationView: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});

export default Picker;
