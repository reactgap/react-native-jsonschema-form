import React, { Component, Fragment } from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import { Calendar } from 'react-native-calendars';
import { rangeOfMinMax } from '../../../utils';
import csstyles from '../../styles';

const MAX_RANGE_OF_DATES = 32;
const DATE_FORMAT = 'YYYY-MM-DD';
class PickerRangeOfDates extends Component {
  static defaultProps = {
    title: '',
  };

  constructor(props) {
    super(props);
    let minDate = null;
    if (!_isEmpty(props.minDate)) {
      minDate = moment(props.minDate, 'DD-MM-YYYY').format(DATE_FORMAT);
      console.log('props.minDate', props.minDate);
      console.log('minDateState', minDate);
    }
    let maxDate = null;
    if (_isEmpty(props.maxDate)) {
      maxDate = moment().format(DATE_FORMAT);
    } else {
      maxDate = moment(props.maxDate, 'DD-MM-YYYY').format(DATE_FORMAT);
    }

    if (props.numberMonthsFuture && typeof props.numberMonthsFuture === 'number') {
      const endOfMonth = moment().clone().endOf('month');
      const futureMonth = endOfMonth.add(props.numberMonthsFuture, 'M');
      maxDate = futureMonth.format(DATE_FORMAT);
    }
    this.state = { start: {}, end: {}, period: {}, min: minDate, max: maxDate, error: null };
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
        color: '#A7E0A3',
        startingDay: currentTimestamp === startTimestamp,
      };
      currentTimestamp += 24 * 60 * 60 * 1000;
    }
    const dateString = this.getDateString(endTimestamp);
    period[dateString] = {
      color: '#A7E0A3',
      endingDay: true,
    };
    if (!_isEmpty(period)) {
      period[Object.keys(period)[0]].color = csstyles.vars.csGreen;
      period[Object.keys(period).pop()].color = csstyles.vars.csGreen;
    }
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
          color: '#A7E0A3',
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
