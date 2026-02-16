import React, { useState, useMemo } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    FlatList,
    TouchableOpacity,
    TextInput,
    Dimensions,
} from 'react-native';
import { Surface, Text, useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SearchableModalSelector = ({ options, selected, onChange, label }) => {
    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState('');
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    const filteredOptions = useMemo(() => {
        if (!search) return options;
        return options.filter(opt =>
            opt.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, options]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.item,
                item === selected && { backgroundColor: theme.colors.primaryContainer }
            ]}
            onPress={() => {
                onChange(item);
                setVisible(false);
                setSearch('');
            }}
        >
            <Text style={[
                styles.itemText,
                item === selected && { color: theme.colors.primary, fontFamily: 'AnekBangla_700Bold' }
            ]}>
                {item}
            </Text>
            {item === selected && (
                <Icon name="check" size={20} color={theme.colors.primary} />
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setVisible(true)}
                style={[
                    styles.trigger,
                    { backgroundColor: theme.colors.surfaceVariant + '40' }
                ]}
            >
                <Icon name="map-marker" size={18} color={theme.colors.primary} style={styles.triggerIcon} />
                <Text style={[styles.triggerText, { color: theme.colors.primary }]} numberOfLines={1}>
                    {selected}
                </Text>
                <Icon name="chevron-down" size={16} color={theme.colors.primary} />
            </TouchableOpacity>

            <Modal
                visible={visible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Surface style={[styles.modalContent, { paddingTop: insets.top }]}>
                        <View style={styles.header}>
                            <View style={styles.headerTop}>
                                <Text style={styles.headerTitle}>{label || 'স্টেশন নির্বাচন করুন'}</Text>
                                <IconButton
                                    icon="close"
                                    onPress={() => {
                                        setVisible(false);
                                        setSearch('');
                                    }}
                                />
                            </View>

                            <View style={[styles.searchContainer, { backgroundColor: theme.colors.surfaceVariant + '60' }]}>
                                <Icon name="magnify" size={20} color={theme.colors.outline} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="খুঁজুন..."
                                    value={search}
                                    onChangeText={setSearch}
                                    autoFocus={false}
                                />
                                {search.length > 0 && (
                                    <TouchableOpacity onPress={() => setSearch('')}>
                                        <Icon name="close-circle" size={18} color={theme.colors.outline} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        <FlatList
                            data={filteredOptions}
                            keyExtractor={item => item}
                            renderItem={renderItem}
                            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                            initialNumToRender={20}
                            maxToRenderPerBatch={20}
                            windowSize={10}
                            keyboardShouldPersistTaps="handled"
                            ListEmptyComponent={
                                <View style={styles.emptyState}>
                                    <Text style={{ color: theme.colors.outline }}>কোনো স্টেশন পাওয়া যায়নি</Text>
                                </View>
                            }
                        />
                    </Surface>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    trigger: {
        height: 48,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    triggerIcon: {
        marginRight: 8,
    },
    triggerText: {
        flex: 1,
        fontFamily: 'AnekBangla_700Bold',
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: SCREEN_HEIGHT * 0.8,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'AnekBangla_800ExtraBold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 44,
        borderRadius: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontFamily: 'AnekBangla_500Medium',
        fontSize: 15,
        paddingVertical: 8,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    itemText: {
        fontSize: 16,
        fontFamily: 'AnekBangla_500Medium',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
});

export default SearchableModalSelector;
