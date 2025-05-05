import { TouchableOpacity, View, Modal, Text, Platform } from "react-native";
import { authStyles } from "../styles/auth.styles";
import React from 'react'


const DialogModal = ({
    visible,
    message,
    onClose,
}: {
    visible: boolean;
    message: { title: string; message: string };
    onClose: () => void;
}) => {
    if (Platform.OS === 'web') return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={authStyles.modalOverlay}>
                <View style={authStyles.modalContent}>
                    <Text style={authStyles.modalTitle}>{message.title}</Text>
                    <Text style={authStyles.modalMessage}>{message.message}</Text>
                    <TouchableOpacity
                        style={authStyles.modalButton}
                        onPress={() => {
                            onClose();
                        }}
                    >
                        <Text style={authStyles.modalButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default DialogModal;