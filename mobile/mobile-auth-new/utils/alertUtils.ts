import { Platform, Alert } from 'react-native';

interface DialogMessage {
    title: string;
    message: string;
}

interface AlertUtils {
    setDialogMessage: (message: DialogMessage) => void;
    setDialogVisible: (visible: boolean) => void;
    setDialogCallback: (callback: (() => void) | null) => void;
}

export const showAlert = (
    title: string,
    message: string,
    onOk: (() => void) | null,
    alertUtils: AlertUtils
) => {
    const { setDialogMessage, setDialogVisible, setDialogCallback } = alertUtils;

    if (Platform.OS === 'web') {
        setDialogMessage({ title, message });
        setDialogVisible(true);
        if (onOk) {
            setDialogCallback(() => onOk);
        }
    } else {
        Alert.alert(title, message, [{ text: 'OK', onPress: onOk ? () => onOk() : undefined }]);
    }
};

export const handleAlert = (
    title: string,
    message: string,
    callback: (() => void) | null,
    alertUtils: AlertUtils
) => {
    showAlert(title, message, callback, alertUtils);
};