import React from "react";
import { View, Text } from 'react-native';

export default function ErrorList(props) {
  const { errors } = props;
  return (
    <View>
      <Text>Error</Text>
      {
        errors.map((error, i) => (
        <Text key={i}> {error.stack}</Text>
        ))
      }
    </View>
  );
}
