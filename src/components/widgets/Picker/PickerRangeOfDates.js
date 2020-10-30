import React, { Component, Fragment } from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import { Calendar } from 'react-native-calendars';
import { rangeOfMinMax } from '../../../utils';
import csstyles from '../../styles';

const MAX_RANGE_OF_DATES = 32;

class PickerRangeOfDates extends Component {
  static defaultProps = {
    title: '',
  };

  constructor(props) {
    super(props);
    const maxDate = moment().format('YYYY/MM/DD');
    this.state = { start: {}, end: {}, period: {}, min: null, max: maxDate, error: null };
  }

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
      const rangeDatesObj = { start: newDayObj, period, end: {} };
      this.setState({ ...rangeDatesObj }, () => {
        this.props.onRangeDatesPicker(rangeDatesObj);
      });
    } else {
      // if end date is older than start date switch
      const { timestamp: savedTimestamp } = start;
      if (savedTimestamp > timestamp) {
        // end to start
        console.log('endate >>');
        const period = this.getPeriod(timestamp, savedTimestamp);
        const days = Object.keys(period).length;
        if (days >= MAX_RANGE_OF_DATES) {
          this.setState({
            error: 'Bạn chỉ được chọn khoảng thời gian trong vòng 31 ngày',
          });
        } else {
          const rangeDatesObj = { start: newDayObj, end: start, period, error: null };
          this.setState({ ...rangeDatesObj }, () => {
            this.props.onRangeDatesPicker(rangeDatesObj);
          });
        }
      } else {
        // start -> end
        console.log('start >>');
        const period = this.getPeriod(savedTimestamp, timestamp);
        const days = Object.keys(period).length;
        if (days >= MAX_RANGE_OF_DATES) {
          this.setState({
            error: 'Bạn chỉ được chọn khoảng thời gian trong vòng 1 tháng',
          });
        } else {
          const rangeDatesObj = { end: newDayObj, start, period, error: null };
          this.setState({ ...rangeDatesObj }, () => {
            this.props.onRangeDatesPicker(rangeDatesObj);
          });
        }
      }
    }
  }

  render() {
    const { disabled, style, data } = this.props;
    const { period, min, max, error } = this.state;
    return (
      <View>
        <Calendar
          onDayPress={this.setDay.bind(this)}
          markingType="period"
          markedDates={period}
          maxDate={max}
          minDate={min}
        />
        {error && (
          <Text
            style={{
              color: csstyles.vars.csDanger,
              lineHeight: 24,
              marginTop: 8,
              paddingBottom: 8,
              textAlign: 'center',
            }}>{`${error}`}</Text>
        )}
      </View>
    );
  }
}

export default PickerRangeOfDates;
