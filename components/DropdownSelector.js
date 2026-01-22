import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Menu, Button, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DropdownSelector = ({ label, options, selected, onChange }) => {
  const [visible, setVisible] = React.useState(false);
  const theme = useTheme();

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
          style={[styles.button, { borderColor: theme.colors.primary }]}
          contentStyle={styles.content}
          icon={() => <Icon name="map-marker" size={18} color={theme.colors.primary} />}
          labelStyle={{ color: theme.colors.primary, fontWeight: '700' }}
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
    minWidth: 130,
    justifyContent: 'flex-start',
  },
});

export default DropdownSelector;

