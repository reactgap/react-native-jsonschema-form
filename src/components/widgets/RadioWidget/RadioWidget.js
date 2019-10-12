import React, { PureComponent } from 'react'
import { Text, View } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import csstyles from '../../styles'

type Props = {
  value: string,
  onChange: (value: String) => void,
}

type State = {
}

class RadioWidget extends PureComponent<Props, State> {

  _onChange = (value) => {
    const { options } = this.props;
    this.props.onChange(value === '' ? options.emptyValue : value);
  }

  render() {
    return (
      <View>
        <Text>Radio Here</Text>
      </View>
    )
  }
}

export default RadioWidget;