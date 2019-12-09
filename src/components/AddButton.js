/* eslint-disable react/react-in-jsx-scope */
import { View, Button } from 'react-native';

export default function AddButton({ onClick, disabled }) {
  return (
    <View>
      <Button onPress={onClick} title="Add" disabled={disabled} />
    </View>
  );
}
