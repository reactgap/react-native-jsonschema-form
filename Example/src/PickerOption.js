// @flow

import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { PickerOption as Picker } from 'react-native-jsonschema-form';

type Props = {};
const timeList = [
  {
    id: 0,
    key: 'today',
    name: 'Hôm nay',
  },
  {
    id: 1,
    key: 'yesterday',
    name: 'Hôm qua',
  },
  {
    id: 2,
    key: '7days_ago',
    name: '7 ngày qua',
  },
  {
    id: 3,
    key: '14days_ago',
    name: '14 ngày qua',
  },
  {
    id: 4,
    key: 'this_month',
    name: 'Tháng này',
  },
  {
    id: 5,
    key: 'last_month',
    name: 'Tháng trước',
  },
  {
    id: 6,
    key: 'three_months_ago',
    name: '3 tháng trước',
  },
  {
    id: 7,
    key: 'range_of_dates',
    name: 'Tuỳ chọn',
  },
];

class PickerOption extends PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = {
      time: timeList[0],
    };
  }

  pickerOnchange = (value: string, index: number, type: string) => {
    console.log('index', index);
    this.setState({
      time: timeList[index],
    });
  };

  render() {
    const time = this.state.time;
    return (
      <View style={styles.viewPicker} testID={'productPicker'}>
        <Picker
          label="Time Option"
          value={time.name}
          data={timeList}
          onChange={this.pickerOnchange}
          pickerCenter={false}
          fontSize={13}
          type="time"
          currentIndex={time.id}
          themeMode="light"
          mainColor={'grey'}
          textStyle={{ paddingLeft: 5 }}
          numberMonthsFuture={3}
          minDate={'28-01-2021'}
          maxDate={'02-02-2021'}
        />
      </View>
    );
  }
}

export default PickerOption;

const styles = StyleSheet.create({
  viewPicker: {
    marginTop: 40,
    flex: 1,
  },
});
