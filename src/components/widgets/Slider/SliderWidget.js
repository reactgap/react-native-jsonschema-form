import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import range from 'lodash.range';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';

import csstyles from '../../styles'

const ICON_CONTAINER_WIDTH = 44;

export default class SliderWidget extends Component {
  constructor(props) {
    super(props);
    const { minValue, maxValue, step, value } = props;
    this.seekBarWidth = 240;
    this.seekTouchStart = 0;
    this.seekProgressStart = 0;

    this.distances = range(minValue, maxValue + step, step);
    this.state = {
      progress: this.convertDistanceToPercent(value, maxValue),
      distance: props.value,
      isSeeking: false,
    };
  }

  onSeekBarLayout = ({ nativeEvent }) => {
    this.seekBarWidth = nativeEvent.layout.width - ICON_CONTAINER_WIDTH;
  };

  onSeekStartResponder = () => true;

  onSeekMoveResponder = () => true;

  onSeekGrant = e => {
    this.seekTouchStart = e.nativeEvent.pageX;
    this.seekProgressStart = this.state.progress;
    this.setState({
      isSeeking: true,
    });
  };

  onSeekRelease = () => {
    this.setState({
      isSeeking: false,
    });
    const { onChange } = this.props;
    if (onChange) {
      const { distance } = this.state;
      onChange(distance);
    }
  };

  onSeek = e => {
    const diff = e.nativeEvent.pageX - this.seekTouchStart;
    const ratio = 100 / this.seekBarWidth;
    let progress = this.seekProgressStart + ratio * diff;
    if (progress < 0) {
      progress = 0;
    }
    if (progress > 100) {
      progress = 100;
    }

    const { maxValue } = this.props;
    const distance = this.convertPercentToDistance(progress, maxValue);
    const nearestDistance = this.getNearestDistance(distance);

    this.setState({
      progress: this.convertDistanceToPercent(nearestDistance, maxValue),
      distance: nearestDistance,
    });
  };

  getNearestDistance = myNumber => {
    let distance = Math.abs(this.distances[0] - myNumber);
    let idx = 0;
    for (let i = 1; i < this.distances.length; i += 1) {
      const cdistance = Math.abs(this.distances[i] - myNumber);
      if (cdistance < distance) {
        idx = i;
        distance = cdistance;
      }
    }
    return this.distances[idx];
  };

  convertDistanceToPercent = (distance, maxValue) => {
    const DISTANCE_TO_PERCENT = 100.0 / maxValue;
    return distance * DISTANCE_TO_PERCENT;
  }

  convertPercentToDistance = (percent, maxValue) => {
    const PERCENT_TO_DISTANCE = maxValue / 100.0;
    return percent * PERCENT_TO_DISTANCE;
  }

  renderIcon() {
    const { iconSize, iconName, iconColor } = this.props;
    return (
      <View style={styles.iconContainer}>
        <Icon name={iconName} color={iconColor} size={iconSize} />
      </View>
    );
  }

  renderSlider() {
    const { progress } = this.state;

    return (
      <View style={[styles.seekBarRow]}>
        {this.renderIcon()}
        <View style={[styles.seekBar]} onLayout={this.onSeekBarLayout}>
          <View style={styles.seekBarStartPoint} />
          <View style={[{ flexGrow: progress }, styles.seekBarProgress]} />
          <View
            style={[
              styles.seekBarKnob,
              this.state.isSeeking ? { transform: [{ scale: 1 }] } : {},
            ]}
            hitSlop={{
              top: 20,
              bottom: 20,
              left: 10,
              right: 20,
            }}
            onStartShouldSetResponder={this.onSeekStartResponder}
            onMoveShouldSetPanResponder={this.onSeekMoveResponder}
            onResponderGrant={this.onSeekGrant}
            onResponderMove={this.onSeek}
            onResponderRelease={this.onSeekRelease}
            onResponderTerminate={this.onSeekRelease}
          />
          <View
            style={[styles.seekBarBackground, { flexGrow: 100 - progress }]}
          />
          <View style={styles.seekBarEndPoint} />
        </View>
      </View>
    );
  }

  renderMin() {
    return (
      <Text style={styles.txtZero}>{`${this.props.minValue}`}</Text>
    );
  }

  renderMax() {
    return (
      <Text style={styles.txtMaxValue}>{`${this.props.maxValue}`}</Text>
    );
  }

  renderTextValue() {
    const { progress, distance } = this.state;
    return (
      <View style={styles.textBar}>
        <Text style={{ flexGrow: progress }} />
        <Text
          style={[
            styles.textDistance,
            {
              flexGrow: 100 - progress,
            },
          ]}
          numberOfLines={1}
        >
            {`${distance} ${this.props.unit}`}
        </Text>
      </View>
    );
  }

  renderText() {
    return (
      <View style={styles.textBar}>
        {this.renderMin()}
        {this.renderMax()}
      </View>
    );
  }

  render() {
    return (
      <View style={[styles.container]}>
        {this.renderTextValue()}
        {this.renderSlider()}
        {this.renderText()}
      </View>
    );
  }
}

SliderWidget.propTypes = {
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.number,
  iconColor: PropTypes.string,
  iconName: PropTypes.string,
  unit: PropTypes.string,
  iconSize: PropTypes.number,
  onChange: PropTypes.func,
};

SliderWidget.defaultProps = {
  minValue: 0,
  maxValue: 10000000,
  step: 100000,
  value: 0,
  iconSize: 20,
  iconColor: csstyles.vars.csGrey,
  iconName: 'hand-holding-usd',
  unit: 'VND'
};

const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    textBar: {
      flexDirection: 'row',
      marginLeft: ICON_CONTAINER_WIDTH,
    },
    iconContainer: {
      width: ICON_CONTAINER_WIDTH,
      height: ICON_CONTAINER_WIDTH,
      alignItems: 'center',
      justifyContent: 'center',
    },
    seekBarRow: {
      width: '100%',
      paddingRight: ICON_CONTAINER_WIDTH,
      flexDirection: 'row',
      alignItems: 'center',
    },
    seekBar: {
      height: 32,
      width: '100%',
      paddingRight: 11,
      flexDirection: 'row',
      alignItems: 'center',
    },
    seekBarStartPoint: {
      position: 'absolute',
      left: 0,
      width: 16,
      height: 16,
      borderRadius: 7,
      backgroundColor: csstyles.vars.csWhite,
      alignItems: 'center',
      justifyContent: 'center',
    },
    seekBarEndPoint: {
      position: 'absolute',
      right: 2,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: csstyles.vars.csWhite,
      borderWidth: 0.5,
      borderColor: csstyles.vars.csGreen,
    },
    seekBarKnob: {
      width: 24,
      height: 24,
      marginHorizontal: -12,
      marginVertical: -12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor:csstyles.vars.csWhite,
      backgroundColor: csstyles.vars.csGreen,
      transform: [{ scale: 0.8 }],
      zIndex: 1,
    },
    seekBarBackground: {
      backgroundColor: '#6a6a6a80',
      height: 1,
    },
    seekBarProgress: {
      height: 1,
      backgroundColor: csstyles.vars.csGreen,
    },
    txtZero: {
      position: 'absolute',
      color: csstyles.vars.csGrey,
      fontSize: 12,
      left: 0,
    },
    txtMaxValue: {
      position: 'absolute',
      color: csstyles.vars.csGrey,
      fontSize: 12,
      right: 0,
    },
    textDistance: {
      fontSize: 12,
      color: csstyles.vars.csGreen,
    },
  });