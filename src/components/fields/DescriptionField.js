import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

function DescriptionField(props) {
  const { id, description } = props;
  if (!description) {
    // See #312: Ensure compatibility with old versions of React.
    return <View />;
  }
  if (typeof description === 'string') {
    return <Text>{description}</Text>;
  }
  return <View>{description}</View>;
}

if (process.env.NODE_ENV !== 'production') {
  DescriptionField.propTypes = {
    id: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  };
}

export default DescriptionField;
