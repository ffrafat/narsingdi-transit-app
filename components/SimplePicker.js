import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SimplePicker = ({ options, selected, onChange, onNavigateToAllStations }) => {
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
                activeOpacity={0.7}
                onPress={() => setVisible(true)}
                style={[
                    styles.trigger,
                    { backgroundColor: theme.colors.surfaceVariant }
                ]}
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
                    >
                        <Surface style={[styles.modalContent, { paddingBottom: insets.bottom + 16 }]}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {options.map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={[
                                            styles.item,
                                            item === selected && { backgroundColor: theme.colors.primaryContainer }
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
                                            <Icon name="check" size={20} color={theme.colors.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}

                                {/* "Other Stations" option */}
                                <TouchableOpacity
                                    style={[styles.item, styles.otherStationsItem]}
                                    onPress={() => {
                                        setVisible(false);
                                        onNavigateToAllStations();
                                    }}
                                >
                                    <Icon name="map-marker-plus" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
                                    <Text style={[styles.itemText, { color: theme.colors.primary, fontFamily: 'AnekBangla_600SemiBold' }]}>
                                        অন্য স্টেশন
                                    </Text>
                                </TouchableOpacity>
                            </ScrollView>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        maxHeight: SCREEN_HEIGHT * 0.6,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    otherStationsItem: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        borderBottomWidth: 0,
    },
    itemText: {
        fontSize: 16,
        fontFamily: 'AnekBangla_500Medium',
        flex: 1,
    },
});

export default SimplePicker;
