import AddButton from "../AddButton";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text, FlatList } from 'react-native';

class FlatList extends Component {
  _keyExtractor = (item, index) => item.id != null ? item.id : index ;

  renderItem: ListRenderItem<Provider> = ({ item, index }) => (
    <ProviderItem
      data={item}
      onSelected={this.categoryOnPress}
      onPressDetail={this.onPressDetail}
      providerId={this.props.providerId}
    />
  );
  
  render() {
    const { data } = this.props;
    return(
      <View>
          <FlatList
          //   refreshControl={refreshControl}
          style={{ flex: 1 }}
          data={data}
          keyExtractor={this._keyExtractor}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderItem}
          windowSize={26}
          onEndReachedThreshold={0.75}
          onEndReached={this.onEndReached}
        />
      </View>
    )
  }
}

export default FlatList;