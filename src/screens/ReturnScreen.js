import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../services/api";
import { Header } from "../components/Header";
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import CardReturn from "../components/CardReturn";

export default function ReturnScreen({ navigation }) {
    const [rent, setRent] = useState([]);
    const [filteredRent, setFilteredRent] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const showAlert = (message) => {
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const [counts, setCounts] = useState({ toReturn: 0, returned: 0 });

    useEffect(() => {
        fetchRents();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [activeFilter, rent]);

    const onReturn = async (data) => {
        const { bookId, userId } = data;

        try {
            const token = await AsyncStorage.getItem("authToken");

            const response = await api.post(`/api/Rents/${bookId}`, 
                { userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            showAlert(response.data.Message || "Livro devolvido com sucesso.");
            fetchRents(); 
        } catch (error) {
            console.error("Erro ao devolver livro:", error);
            showAlert(error.response?.data || "Erro ao processar devolução.");
        }
    };

    const fetchRents = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("authToken");

            const { data } = await api.get("/api/Rents", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setRent(data);

            const returned = data.filter(item => item.returnDate).length;
            const toReturn = data.length - returned;
            setCounts({ toReturn, returned });

        } catch (err) {
            console.error(err || "Não conseguimos processar sua solicitação.");
            showAlert("Erro ao carregar locações.");
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = () => {
        if (activeFilter === "all") {
            setFilteredRent(rent);
        } else if (activeFilter === "returned") {
            setFilteredRent(rent.filter(item => item.returnDate));
        } else if (activeFilter === "toReturn") {
            setFilteredRent(rent.filter(item => !item.returnDate));
        }
    };

    return (
        <>
            <Header title="Devolver Livro" />
            <View style={styles.container}>
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            activeFilter === "all" && styles.activeFilterButton,
                        ]}
                        onPress={() => setActiveFilter("all")}
                    >
                        <Text style={[styles.filterText, activeFilter === "all" && styles.activeFilterText]}>Todos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            activeFilter === "toReturn" && styles.activeFilterButton,
                        ]}
                        onPress={() => setActiveFilter("toReturn")}
                    >
                        <Text style={[styles.filterText, activeFilter === "toReturn" && styles.activeFilterText]}>Não Entregues</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            activeFilter === "returned" && styles.activeFilterButton,
                        ]}
                        onPress={() => setActiveFilter("returned")}
                    >
                        <Text style={[styles.filterText, activeFilter === "returned" && styles.activeFilterText]}>Entregues</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={filteredRent}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        const data = {
                            id: item.id,
                            bookId: item.book.id,
                            userId: item.user.id,
                            title: item.book.title,
                            author: item.book.author,
                            name_user: item.user.name,
                            email: item.user.email,
                            createdAt: item.createdAt,
                            returnDate: item.returnDate,
                        };

                        return <CardReturn data={data} onReturn={onReturn} />;
                    }}
                />
            </View>
            <View style={[styles.footer, counts.toReturn === 0 && { backgroundColor: '#28A745' }]}>
                <Text style={styles.footerText}>
                    Livros para devolver: {counts.toReturn}
                </Text>
                <Text style={styles.footerText}>
                    Livros devolvidos: {counts.returned}
                </Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    filterButton: {
        flex: 1,
        padding: 10,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: "#ff5722",
        borderRadius: 5,
        alignItems: "center",
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center", 
        marginBottom: 16,
    },
    activeFilterButton: {
        backgroundColor: "#ff5722",
    },
    filterText: {
        color: "#ff5722",
        fontWeight: "bold",
    },
    activeFilterText: {
        color: "#fff",
        fontWeight: "bold",
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ff5722",
        padding: 16,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    footerText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
