
import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import csstyles from '../../styles'
export default function ErrorList(props) {
  const { errors } = props;
  return (
    <View style={styles.errorWrapper}>
      {
        errors.map((error, i) => (
        <Text key={i} style={styles.errorText}> {error}</Text>
        ))
      }
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: csstyles.vars.csBoxSpacing
  },
  textInputInvalid: {
    borderColor: csstyles.vars.csDanger
  },
  errorWrapper: {
    marginTop: 3,
    paddingHorizontal: csstyles.vars.csInputHeight
  },
  errorText: {
    ...csstyles.text.medium,
    color: csstyles.vars.csDanger,
    fontStyle: 'italic',
    fontSize: 13
  }
})