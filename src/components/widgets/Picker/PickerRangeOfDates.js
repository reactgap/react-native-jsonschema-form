import React, { Component, Fragment } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import _isEmpty from 'lodash/isEmpty';
import { Calendar } from 'react-native-calendars';

class PickerRangeOfDates extends Component {
  static defaultProps = {
    data: [],
    title: '',
    error: '',
    selected: -1,
    disabled: false,
    onChangeText: (value, index) => value,
  };

  state = { start: {}, end: {}, period: {} };

  onSelect = (index) => {
    let { data, valueExtractor, onChangeText } = this.props;

    let value = data[index];
    if (typeof onChangeText === 'function') {
      onChangeText(value, index);
    }
  };

  onPress = () => {};
  getDateString(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    let dateString = `${year}-`;
    if (month < 10) {
      dateString += `0${month}-`;
    } else {
      dateString += `${month}-`;
    }
    if (day < 10) {
      dateString += `0${day}`;
    } else {
      dateString += day;
    }

    return dateString;
  }
  getPeriod(startTimestamp, endTimestamp) {
    const period = {};
    let currentTimestamp = startTimestamp;
    while (currentTimestamp < endTimestamp) {
      const dateString = this.getDateString(currentTimestamp);
      period[dateString] = {
        color: 'green',
        startingDay: currentTimestamp === startTimestamp,
      };
      currentTimestamp += 24 * 60 * 60 * 1000;
    }
    const dateString = this.getDateString(endTimestamp);
    period[dateString] = {
      color: 'green',
      endingDay: true,
    };
    return period;
  }

  setDay(dayObj) {
    const { start, end } = this.state;
    const { dateString, day, month, year } = dayObj;
    // timestamp returned by dayObj is in 12:00AM UTC 0, want local 12:00AM
    const timestamp = new Date(year, month - 1, day).getTime();
    const newDayObj = { ...dayObj, timestamp };
    // if there is no start day, add start. or if there is already a end and start date, restart
    const startIsEmpty = _isEmpty(start);
    if (startIsEmpty || (!startIsEmpty && !_isEmpty(end))) {
      const period = {
        [dateString]: {
          color: 'green',
          endingDay: true,
          startingDay: true,
        },
      };
      this.setState({ start: newDayObj, period, end: {} });
    } else {
      // if end date is older than start date switch
      const { timestamp: savedTimestamp } = start;
      if (savedTimestamp > timestamp) {
        const period = this.getPeriod(timestamp, savedTimestamp);
        this.setState({ start: newDayObj, end: start, period });
      } else {
        const period = this.getPeriod(savedTimestamp, timestamp);
        this.setState({ end: newDayObj, start, period });
      }
    }
  }

  render() {
    const { disabled, style, data } = this.props;
    const { period } = this.state;
    return (
      <View>
        <Calendar onDayPress={this.setDay.bind(this)} markingType="period" markedDates={period} />
      </View>
    );
  }
}

export default PickerRangeOfDates;
