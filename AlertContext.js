import React, { createContext, useContext, useState, useCallback } from 'react';
import CustomAlert from './components/CustomAlert';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        buttons: [],
        icon: 'information-outline',
    });

    const showAlert = useCallback((title, message, buttons = [], icon = 'information-outline') => {
        setAlertConfig({
            visible: true,
            title,
            message,
            buttons,
            icon,
        });
    }, []);

    const hideAlert = useCallback(() => {
        setAlertConfig(prev => ({ ...prev, visible: false }));
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <CustomAlert
                {...alertConfig}
                onDismiss={hideAlert}
            />
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};
