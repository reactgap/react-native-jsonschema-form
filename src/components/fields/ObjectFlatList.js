import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, FlatList, StyleSheet, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MenuItem from './card/MenuItem';

// import styles from '../styles';

class ObjectFlatList extends Component {
  _keyExtractor = (item, index) => item.key != null ? item.key : index.toString();

  renderItem = ({ item, index }) => (
    <MenuItem item={item} />
  );
  
  render() {
    const {
      schema,
      name,
      uiSchema,
      idSchema,
      formData,
      required,
      disabled,
      readonly,
      autofocus,
      onChange,
      rawErrors,
    } = this.props;
    console.log("FlatList",this.props);
    const { data, numColumns} = schema;
    return(
        <View>
          <FlatList
            // style={{ flex: 1 }}
            data={data}
            keyExtractor={this._keyExtractor}
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            renderItem={this.renderItem}
          />
        </View>
       
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
export default ObjectFlatList;