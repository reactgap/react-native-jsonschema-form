// @flow

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import csstyles from '../../styles'

type Props = {
  onPress: (id: string) => void,
  id: string,
  leftTitle: string,
  rightTitle: string,
  selected: boolean
}

class ListGroupSelectableItem extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    const { selected } = this.props

    return nextProps.selected !== selected
  }

  onPress = () => {
    const { id, onPress } = this.props

    onPress(id)
  }

  render() {
    const { leftTitle, rightTitle, selected } = this.props

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={this.onPress} style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.contentWrapper}>
            <Text style={styles.leftTitle}>{leftTitle}</Text>
            <Text style={styles.rightTitle}>{rightTitle}</Text>
          </View>
          <View style={styles.iconContainer}>
            {selected && <FontAwesome5 color={csstyles.vars.csGreen} size={20} name="check" />}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {},
  container: {
    ...csstyles.base.rowCenterLine,
    marginHorizontal: csstyles.vars.csBoxSpacing2x,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: csstyles.vars.csGreen,
    height: csstyles.vars.csInputHeight
  },
  contentWrapper: {
    ...csstyles.base.rowCenterLine,
    justifyContent: 'space-between',
    ...csstyles.base.full
  },
  iconContainer: {
    width: csstyles.vars.csInputHeight,
    alignItems: 'flex-end'
  },
  leftTitle: {
    ...csstyles.text.textMain,
    ...csstyles.text.medium,
    fontSize: 14
  },
  rightTitle: {
    ...csstyles.text.textMain,
    ...csstyles.text.regular,
    fontSize: 14
  }
})

export default ListGroupSelectableItem
