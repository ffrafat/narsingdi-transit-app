import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, Text, useTheme } from 'react-native-paper';
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
          <TouchableOpacity
            onPress={openMenu}
            activeOpacity={0.7}
            style={[
              styles.button,
              { backgroundColor: theme.colors.surfaceVariant + '40' } // Subtle background
            ]}
          >
            <View style={styles.content}>
              <Icon
                name="map-marker"
                size={18}
                color={theme.colors.primary}
                style={styles.icon}
              />
              <Text style={[styles.label, { color: theme.colors.primary }]} numberOfLines={1}>
                {selected}
              </Text>
              <Icon
                name="chevron-down"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
            </View>
          </TouchableOpacity>
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
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
    flex: 1,
  },
  menuContent: {
    borderRadius: 12,
    marginTop: 4,
  }
});

export default DropdownSelector;
