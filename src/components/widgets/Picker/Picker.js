// @flow

import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  Animated,
  DatePickerIOS,
  Easing,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  type LayoutChangeEvent, Platform,
} from 'react-native';
import _isEmpty from 'lodash/isEmpty';

import csstyles from '../../styles';
import {
  DEVICE_BOTTOM_SAFE,
  DEVICE_SCREEN_HEIGHT,
  DEVICE_SCREEN_WIDTH,
} from '../../../deviceHelper';
import CSButton from '../Button/CSButton/CSButton';
import ListGroupSelectableItem from './ListGroupSelectableItem';
import localData from '../../../data/vietnam_provinces_districts.json';
// import { currLanguage } from '../../../utils/i18n'
// import UniversalScreenContainer from '../../UniversalScreenContainer/UniversalScreenContainer'
import PickerRangeOfDates from './PickerRangeOfDates';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'

type Props = {
  isOpen: boolean,
  value: string,
  onChange: (value: string, index: number, type: string) => void,
  onClose: () => void,
  center?: boolean,
  mode: 'provinces' | 'districts' | 'options',
  numberMonthsFuture?: number,
  minDate?: string,
  maxDate?: string,
  rangeOfDates: boolean,
  province: string,
  district: string,
  data: any[],
  selectedIndex: number,
  onPressBackFoward: () => void,
  isFilter?: boolean,
  onChangeSearch?: () => void,
  filterValue?: string,
};

class Picker extends Component<Props> {
  static defaultProps = {
    rangeOfDates: false,
  };

  state = {
    start: {},
    end: {},
    period: {},
    error: null,
  };

  animateValue: Animated.Value = new Animated.Value(-999);

  contentHeight: number = 0;

  shouldOpen = false;

  selected: string = null;

  shouldComponentUpdate(nextProps: Props, nextState: any) {
    const { isOpen, value, center, selectedIndex, rangeOfDates, data } = this.props;
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

    return (
      isOpen !== nextProps.isOpen ||
      value !== nextProps.value ||
      rangeOfDates !== nextProps.rangeOfDates ||
      nextState !== this.state ||
      nextProps?.data !== data
    );
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
    const { onChange, onChangeDatePicker, rangeOfDates } = this.props;
    if (rangeOfDates) {
      const { start, end, period } = this.state;
      if (_isEmpty(start) || _isEmpty(end)) {
        this.setState({ error: 'Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc' });
      } else {
        const startDateStr = start.dateString;
        const endDateStr = end.dateString;

        this.setState({ error: null, start: {}, end: {}, period: {} }, () => {
          onChangeDatePicker(this.selected, `${startDateStr}|${endDateStr}`, this.selectedIndex);
        });
      }
    } else {
      onChange(this.selected, this.selectedIndex);
    }
  };

  onRangeDatesPicker = ({ start, end, period }) => {
    this.setState({
      start,
      end,
      period,
    });
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
    this.selectedIndex = data.findIndex((x) => x.id === item.id);
    this.selected = item.name;
    this.forceUpdate();
  };

  renderContent = () => {
    const {
      value,
      center,
      mode,
      data,
      rangeOfDates,
      minDate,
      maxDate,
      onPressBackFoward,
      onChangeSearch,
      numberMonthsFuture,
      isFilter,
      filterValue
    } = this.props;
    const { error } = this.state;
    let pHeight = rangeOfDates ? 450 : (DEVICE_SCREEN_HEIGHT * 1) / 3;
    if (isFilter) {
      pHeight = Platform.OS === 'android' ? DEVICE_SCREEN_HEIGHT/2 : 450
    }
    return (
      <View
        style={[styles.contentContainer, center && styles.contentContainerCenter]}
        onLayout={center ? null : this.onContentLayout}>
        <View style={[styles.actionBtnContainer, center && styles.actionBtnContainerCenter]}>
          <CSButton type="secondary" leftIcon="times" iconOnly onPress={this.onClose} />
          <CSButton type="primary" leftIcon="check" iconOnly onPress={this.onDone} />
        </View>
       {isFilter && <SearchView onChangeText={onChangeSearch} value={filterValue} />}
        <View
          style={{
            height: pHeight,
          }}>
          {rangeOfDates ? (
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <PickerRangeOfDates
                  title={''}
                  onRangeDatesPicker={this.onRangeDatesPicker}
                  numberMonthsFuture={numberMonthsFuture}
                  minDate={minDate}
                  maxDate={maxDate}
                  schemaError={error}
                />
              </View>
              <View style={{ padding: 16 }}>
                <View style={{ paddingHorizontal: 16, marginBottom: 0 }}>
                  <CSButton type="secondary" title="Trở lại" onPress={() => onPressBackFoward()} />
                </View>
              </View>
            </View>
          ) : (
            <FlatList
              style={csstyles.base.full}
              data={data}
              extraData={this.selectedIndex}
              keyExtractor={(item) => `${item.id || item._id}`}
              renderItem={this.renderItem}
              windowSize={30}
            />
          )}
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
    const { isOpen, center, data } = this.props;

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
export const SearchView = ({ onChangeText, value, onChange, onSubmitEditing }) => {
  return (
    <View style={styles.search}>
      <TextInput
        style={{ paddingVertical: 10, flex: 1, paddingHorizontal: 5 }}
        onChangeText={onChangeText}
        value={value}
        placeholder="Tìm Kiếm"
        onChange={onChange}
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
        autoCorrect={false}
      />
      <FontAwesome5Icon name="search" style={styles.searchIcon} />
    </View>
  );
};
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
  search: {
    borderColor: 'grey',
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 5,
    borderColor: csstyles.vars.csLight,
    backgroundColor: csstyles.vars.csLight,
    marginHorizontal: 10
  },
  searchIcon: { alignSelf: 'center', marginRight: 10 },
});

export default Picker;
