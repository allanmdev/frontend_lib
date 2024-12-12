import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CardReturn({ data, onReturn }) {
    if (!data) {
        return (
            <View style={styles.card}>
                <Text style={styles.error}>Erro: Nenhum dado disponível.</Text>
            </View>
        );
    }

    const { title, author, name_user, email, createdAt, returnDate } = data;

    const handleReturn = () => {
        if (onReturn) {
            onReturn(data);
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title || 'Título não disponível'}</Text>
            <Text style={styles.text}>Autor do livro: {author || 'Desconhecido'}</Text>
            <Text style={styles.text}>Nome do Cliente: {name_user || 'Não informado'}</Text>
            <Text style={styles.text}>Email do Cliente: {email || 'Não informado'}</Text>
            <Text style={styles.text}>
                Alugado em: {createdAt ? new Date(createdAt).toLocaleDateString() : 'Data não disponível'}
            </Text>
            {returnDate && (
                <Text style={styles.returnDate}>
                    Entregue em: {new Date(returnDate).toLocaleDateString()}
                </Text>
            )}
            <TouchableOpacity
                style={[
                    styles.button,
                    returnDate ? styles.buttonDisabled : styles.buttonActive,
                ]}
                onPress={handleReturn}
                disabled={!!returnDate}
            >
                <Text
                    style={[
                        styles.buttonText,
                        returnDate ? styles.textDelivered : styles.textPending,
                    ]}
                >
                    {returnDate ? 'Entregue' : 'Devolver'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        margin: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    text: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    returnDate: {
        fontSize: 14,
        color: 'green',
        fontWeight: 'bold',
        marginTop: 8,
    },
    button: {
        marginTop: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonActive: {
        backgroundColor: '#FFC107',
    },
    buttonDisabled: {
        backgroundColor: '#D4EDDA',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    textPending: {
        color: '#000',
    },
    textDelivered: {
        color: 'green',
    },
    error: {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
    },
});
