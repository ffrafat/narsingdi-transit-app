import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Menu, Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DropdownSelector = ({ label, options, selected, onChange }) => {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <Button
          mode="outlined"
          onPress={openMenu}
          style={styles.button}
          contentStyle={styles.content}
          icon={() => <Icon name="map-marker" size={18} color="#4caf50" />}
          labelStyle={{ color: '#4caf50', fontWeight: '700' }}
          uppercase={false}
        >
          {selected}
        </Button>
      }
    >
      {options.map(opt => (
        <Menu.Item
          key={opt}
          onPress={() => {
            onChange(opt);
            closeMenu();
          }}
          title={opt}
        />
      ))}
    </Menu>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    borderColor: '#4caf50',
    minWidth: 130,
    justifyContent: 'flex-start',
  },
});

export default DropdownSelector;
