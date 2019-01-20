import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

const REQUIRED_FIELD_SYMBOL = '*';

function TitleField(props) {
  const { id, title, required } = props;
  console.log('TitleField',title);
  const textValue = required ? title + REQUIRED_FIELD_SYMBOL : title;
  return <Text>{textValue}</Text>;
}

if (process.env.NODE_ENV !== 'production') {
  TitleField.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    required: PropTypes.bool,
  };
}

export default TitleField;
