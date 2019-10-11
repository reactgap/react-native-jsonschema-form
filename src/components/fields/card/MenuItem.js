// @flow

import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import {
  getDefaultIcons
} from '../../../utils';

const ICON_TYPES = {
  FontAwesome: "FontAwesome",
  MaterialCommunityIcons: "MaterialCommunityIcons",
  SimpleLineIcons: "SimpleLineIcons",
  MaterialIcons: "MaterialIcons",
  Foundation: "Foundation",
  EvilIcons: "EvilIcons",
  Ionicons: "Ionicons",
  Octicons: "Octicons",
  Feather: "Feather",
  Entypo: "Entypo",
  Zocial: "Zocial"
}

type Props = {
  // type: 'EvilIcon',
  // icon?: null,
  // onPress: () => void,
  // onLongPress?: () => void,
  // title: string,
}

function getIconComponent(type, icon, icons) {
  const iconName = ICON_TYPES[type];

  if (iconName in icons) {
    const IconView = icons[iconName]
    return <IconView name="user" size={44} />
  } else {
    return <View />
  }
}

class MenuItem extends Component<Props> {

  onPress = () => {
    const { item, onSelected } = this.props;
    if (onSelected) {
      onSelected(item);
    }
  }

  render() {
    const { item } = this.props;
    const { title, type, icon } = item;
    const { icons } = getDefaultIcons();
    return(
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.onPress}
        style={styles.GridViewBlockStyle}
      >
        <View>
          {getIconComponent(type, icon, icons)}
          <Text style={styles.GridViewInsideTextItemStyle}>{title}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}


const styles = StyleSheet.create({
  MainContainer :{
    justifyContent: 'center',
    flex:1,
    margin: 10,
    paddingTop: (Platform.OS) === 'ios' ? 20 : 0
  },
  GridViewBlockStyle: {
    justifyContent: 'center',
    flex:1,
    alignItems: 'center',
    height: 100,
    margin: 5,
    backgroundColor: '#00BCD4'  
  },
  GridViewInsideTextItemStyle: {
    color: '#fff',
    padding: 10,
    fontSize: 18,
    justifyContent: 'center',
  }
});
export default MenuItem
