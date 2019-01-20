import { Button } from 'react-native';

export default function IconButton(props) {
  const { type = "default", icon, className, ...otherProps } = props;
  return (
    <Button onPress={onClick} title="Add-ICON" disabled={disabled} />
  );
}
