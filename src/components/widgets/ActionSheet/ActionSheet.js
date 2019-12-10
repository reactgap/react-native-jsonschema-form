// @flow

import React, { Component } from 'react';
import {
  View,
  Modal,
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  type LayoutChangeEvent,
} from 'react-native';
import csstyles from '../../styles';
import { DEVICE_BOTTOM_SAFE } from '../../../deviceHelper';
import CSButton from '../Button/CSButton/CSButton';
import CSBackButton from '../Button/CSBackButton/CSBackButton';

type Props = ActionSheetConfig;

export type ActionSheetConfig = {
  isOpen: boolean,
  onClose?: () => any,
  onDismiss?: () => any,
  title?: string,
  actions?: ActionSheetAction[],
};

export type ActionSheetAction = {
  key: string,
  title: string,
  icon?: string,
  type: 'primary' | 'secondary' | 'danger',
  onPress?: () => void,
};

class ActionSheet extends Component<Props> {
  animateValue: Animated.Value = new Animated.Value(-999);

  contentHeight: number = 0;

  shouldOpen = false;

  shouldComponentUpdate(nextProps: Props) {
    const { isOpen } = this.props;

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

    return isOpen !== nextProps.isOpen;
  }

  componentDidUpdate(prevProps: Props) {
    const { isOpen, onDismiss } = this.props;

    if (Platform.OS === 'android' && !isOpen && isOpen === prevProps.isOpen && onDismiss) {
      onDismiss();
    }
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

  onClose = () => {
    const { onClose } = this.props;

    onClose && onClose();
  };

  renderContent = () => {
    const { actions, title } = this.props;

    if (!actions) return null;

    return (
      <View
        style={[
          styles.contentContainer,
          {
            marginHorizontal: 0,
          },
        ]}
        onLayout={this.onContentLayout}>
        <View style={styles.contentWrapper}>
          <CSBackButton
            forceCloseIcon
            onPress={this.onClose}
            wrapperStyle={csstyles.base.absoluteTopLeft}
          />
          <View style={styles.textContainer}>
            <Text style={styles.desc}>{title}</Text>
          </View>
          <View style={csstyles.base.w100}>
            {actions.map(({ title: btnTitle, key, onPress, icon, type: btnType }) => (
              <CSButton
                type={btnType}
                onPress={onPress}
                title={btnTitle}
                leftIcon={icon}
                key={key}
                style={styles.actionsBtn}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  renderBgTouchable = () => (
    <TouchableOpacity style={csstyles.base.absoluteFull} activeOpacity={1} onPress={this.onClose}>
      <View />
    </TouchableOpacity>
  );

  renderAnimationContent = () => (
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

  render() {
    const { isOpen, onDismiss } = this.props;

    return (
      <Modal
        visible={isOpen}
        animationType="none"
        onRequestClose={this.onClose}
        transparent
        onDismiss={onDismiss}>
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
  contentContainer: {
    marginHorizontal: 0,
    overflow: 'hidden',
    paddingHorizontal: csstyles.vars.csBoxSpacing2x,
    borderRadius: csstyles.vars.csBoxBorderRadius2x,
    marginBottom: DEVICE_BOTTOM_SAFE + csstyles.vars.csBoxSpacing,
    backgroundColor: csstyles.vars.csGrey,
    elevation: 6,
    shadowColor: csstyles.vars.csBlack,
    shadowRadius: 5 * StyleSheet.hairlineWidth,
    shadowOffset: {
      width: 0,
      height: -5 * StyleSheet.hairlineWidth,
    },
    shadowOpacity: 0.8,
  },
  contentWrapper: {
    ...csstyles.base.fullCenter,
    position: 'relative',
    marginTop: csstyles.vars.csBoxSpacing,
    marginBottom: csstyles.vars.csBoxSpacing,
  },
  animationView: {
    position: 'absolute',
    left: csstyles.vars.csBoxSpacing2x,
    right: csstyles.vars.csBoxSpacing2x,
  },
  actionsBtn: {
    marginBottom: csstyles.vars.csBoxSpacing,
  },
  textContainer: {
    paddingHorizontal: csstyles.vars.csInputHeight,
    minHeight: csstyles.vars.csInputHeight,
    ...csstyles.base.rowCenterLine,
    marginBottom: csstyles.vars.csBoxSpacing2x,
  },
  desc: {
    ...csstyles.text.medium,
    color: csstyles.vars.csWhite,
    textAlign: 'center',
    fontSize: 15,
  },
});

export default ActionSheet;
