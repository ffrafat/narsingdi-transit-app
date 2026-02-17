import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme, Menu } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

const SearchableModalSelector = ({ options, selected, onChange, label, onNavigateToAllStations }) => {
    const [visible, setVisible] = useState(false);
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={
                    <TouchableOpacity
                        style={[
                            styles.trigger,
                            { backgroundColor: theme.colors.surfaceVariant }
                        ]}
                        onPress={() => setVisible(!visible)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.triggerText, { color: theme.colors.onSurface }]} numberOfLines={1}>
                            {selected}
                        </Text>
                        <Icon name="chevron-down" size={20} color={theme.colors.onSurface} />
                    </TouchableOpacity>
                }
                contentStyle={styles.menuContent}
            >
                {options.map((item) => (
                    <Menu.Item
                        key={item}
                        onPress={() => {
                            onChange(item);
                            setVisible(false);
                        }}
                        title={item}
                        titleStyle={[
                            styles.menuItemTitle,
                            item === selected && { color: theme.colors.primary, fontFamily: 'AnekBangla_700Bold' }
                        ]}
                        trailingIcon={item === selected ? "check" : undefined}
                    />
                ))}

                {onNavigateToAllStations && (
                    <Menu.Item
                        onPress={() => {
                            setVisible(false);
                            onNavigateToAllStations();
                        }}
                        title="অন্য স্টেশন"
                        titleStyle={[styles.menuItemTitle, { color: theme.colors.primary, fontFamily: 'AnekBangla_600SemiBold' }]}
                        leadingIcon="map-marker-plus"
                        style={styles.otherStationsItem}
                    />
                )}
            </Menu>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
    },
    triggerText: {
        flex: 1,
        fontFamily: 'AnekBangla_700Bold',
        fontSize: 16,
    },
    menuContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        maxHeight: 400,
    },
    menuItemTitle: {
        fontFamily: 'AnekBangla_500Medium',
        fontSize: 16,
    },
    otherStationsItem: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
});

export default SearchableModalSelector;
