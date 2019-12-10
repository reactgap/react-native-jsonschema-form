import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

const REQUIRED_FIELD_SYMBOL = '*';

function TitleField(props) {
  const { title, required } = props;
  if (!title || title.length === 0) {
    return <Fragment />;
  }
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
