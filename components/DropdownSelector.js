import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, Button, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DropdownSelector = ({ label, options, selected, onChange, style }) => {
  const [visible, setVisible] = React.useState(false);
  const theme = useTheme();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={style}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="contained"
            onPress={openMenu}
            style={[
              styles.button,
              { backgroundColor: theme.colors.surfaceVariant + '40' }
            ]}
            contentStyle={styles.content}
            labelStyle={[styles.label, { color: theme.colors.primary }]}
            icon={() => <Icon name="map-marker" size={18} color={theme.colors.primary} />}
            uppercase={false}
          >
            {selected}
          </Button>
        }
        contentStyle={styles.menuContent}
      >
        {options.map(opt => (
          <Menu.Item
            key={opt}
            onPress={() => {
              onChange(opt);
              closeMenu();
            }}
            title={opt}
            titleStyle={{
              fontWeight: opt === selected ? 'bold' : 'normal',
              color: opt === selected ? theme.colors.primary : theme.colors.onSurface
            }}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    elevation: 0,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'left',
  },
  menuContent: {
    borderRadius: 12,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
  }
});

export default DropdownSelector;
