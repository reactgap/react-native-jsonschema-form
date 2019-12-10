import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, Platform } from 'react-native';
import MenuItem from './card/MenuItem';

// import styles from '../styles';

class ObjectFlatList extends Component {
  _keyExtractor = (item, index) => (item.key != null ? item.key : index.toString());

  onPressItem = data => {
    const { onAction } = this.props;
    if (onAction) {
      onAction(data);
    }
  };

  renderItem = ({ item, index }) => {
    return <MenuItem item={item} onSelected={this.onPressItem} />;
  };

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
    const { data, numColumns } = schema;
    return (
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
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    margin: 10,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  GridViewBlockStyle: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    height: 100,
    margin: 5,
    backgroundColor: '#00BCD4',
  },
  GridViewInsideTextItemStyle: {
    color: '#fff',
    padding: 10,
    fontSize: 18,
    justifyContent: 'center',
  },
});
export default ObjectFlatList;
