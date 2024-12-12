import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text, ActivityIndicator, Alert } from 'react-native';
import { Header } from '../components/Header';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListUsersScreen() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                
                const response = await api.get('/api/Auth/list-users', 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setUsers(response.data);
            } catch (error) {
                Alert.alert('Erro', 'Não foi possível carregar os usuários.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const renderUser = ({ item }) => (
        <View style={styles.row}>
            <Text style={[styles.cell, styles.titleBold]}>{item.name}</Text>
            <Text style={styles.cell}>{item.email}</Text>
        </View>
    );

    return (
        <>
            <Header title="Listar Usuários" />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Nome</Text>
                    <Text style={styles.headerText}>Email</Text>
                </View>
                {loading ? (
                    <ActivityIndicator size="large" color="#6200ee" style={styles.loader} />
                ) : (
                    <FlatList
                        data={users}
                        renderItem={renderUser}
                        keyExtractor={(item) => item.id.toString()}
                        ListEmptyComponent={() => <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>}
                    />
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    header: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#ff5722',
        borderRadius: 8,
        marginBottom: 10,
    },
    headerText: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
        textTransform: "uppercase"
    },
    row: {
        flexDirection: 'row',
        padding: 15,
        marginBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        color: '#333',
    },
    loader: {
        marginTop: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
        fontSize: 16,
    },
    titleBold: {
        fontWeight: "bold"
    }
});
