import React from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";

export default function CustomAlert({ visible, onClose, title, message }) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>{title || "Alerta"}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <Pressable style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>OK</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    container: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#ff5722",
    },
    message: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#ff5722",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        textTransform: "uppercase",
    },
});