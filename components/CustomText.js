import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

const CustomText = ({ style, ...props }) => {
    return <RNText style={[styles.defaultFont, style]} {...props} />;
};

const styles = StyleSheet.create({
    defaultFont: {
        fontFamily: 'AnekBangla_400Regular',
    },
});

export default CustomText;
