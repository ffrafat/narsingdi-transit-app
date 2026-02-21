import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView } from 'react-native';
import { Text, useTheme, Surface, Divider } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SearchableModalSelector = ({ options, selected, onChange, label, onNavigateToAllStations }) => {
    const [visible, setVisible] = useState(false);
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    const handleSelect = (item) => {
        onChange(item);
        setVisible(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.trigger,
                    { backgroundColor: theme.colors.surfaceVariant }
                ]}
                onPress={() => setVisible(true)}
                activeOpacity={0.7}
            >
                <Text style={[styles.triggerText, { color: theme.colors.onSurface }]} numberOfLines={1}>
                    {selected}
                </Text>
                <Icon name="chevron-down" size={20} color={theme.colors.onSurface} />
            </TouchableOpacity>

            <Modal
                visible={visible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setVisible(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={styles.modalContentWrapper}
                    >
                        <Surface style={[
                            styles.modalContent,
                            {
                                backgroundColor: theme.dark ? theme.colors.elevation.level3 : theme.colors.surface,
                            }
                        ]} elevation={4}>
                            <View style={styles.modalHeader}>
                                <Text style={[styles.modalTitle, { color: theme.colors.primary }]}>{label}</Text>
                            </View>
                            <Divider style={styles.divider} />

                            <ScrollView
                                showsVerticalScrollIndicator={true}
                                persistentScrollbar={true}
                                style={styles.scrollView}
                            >
                                {options.map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={[
                                            styles.item,
                                            item === selected && { backgroundColor: theme.colors.primaryContainer + '40' }
                                        ]}
                                        onPress={() => handleSelect(item)}
                                    >
                                        <Text style={[
                                            styles.itemText,
                                            { color: theme.colors.onSurface },
                                            item === selected && { color: theme.colors.primary, fontFamily: 'AnekBangla_700Bold' }
                                        ]}>
                                            {item}
                                        </Text>
                                        {item === selected && (
                                            <Icon name="check" size={18} color={theme.colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {onNavigateToAllStations && (
                                <View style={styles.stickyFooter}>
                                    <Divider style={styles.divider} />
                                    <TouchableOpacity
                                        style={styles.item}
                                        onPress={() => {
                                            setVisible(false);
                                            onNavigateToAllStations();
                                        }}
                                    >
                                        <Icon name="map-marker-plus" size={18} color={theme.colors.primary} style={{ marginRight: 10 }} />
                                        <Text style={[styles.itemText, { color: theme.colors.primary, fontFamily: 'AnekBangla_600SemiBold' }]}>
                                            অন্য স্টেশন
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Surface>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    modalContentWrapper: {
        width: '100%',
        maxWidth: 280,
    },
    modalContent: {
        width: '100%',
        maxHeight: SCREEN_HEIGHT * 0.5,
        borderRadius: 16,
        overflow: 'hidden',
    },
    modalHeader: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16,
        fontFamily: 'AnekBangla_800ExtraBold',
    },
    scrollView: {
        flexGrow: 0,
    },
    stickyFooter: {
        backgroundColor: 'transparent',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    itemText: {
        fontSize: 15,
        fontFamily: 'AnekBangla_500Medium',
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
});

export default SearchableModalSelector;
