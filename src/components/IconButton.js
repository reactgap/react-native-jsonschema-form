import React from 'react';
import { Button } from 'react-native';

export default function IconButton(props) {
  const { icon, className, onClick, disabled, ...otherProps } = props;
  return <Button onPress={onClick} title="Add-ICON" disabled={disabled} />;
}
