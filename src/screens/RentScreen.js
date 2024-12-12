import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "../components/Header";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

import CustomAlert from "../components/CustomAlert";

export default function RentScreen({ navigation }) {
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState(""); 
    const [bookId, setBookId] = useState("");
    const [bookName, setBookName] = useState("");
    const [isRentingForOther, setIsRentingForOther] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const showAlert = (message) => {
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const changeBook = (id, name, quantity) => {
        if (quantity === 0) {
            showAlert("Este livro não está em estoque.");
            return;
        }

        setBookId(id);
        setBookName(name);
    };

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/Books");
            setBooks(response.data.data);
        } catch (error) {
            const error_message = `Erro ao buscar os livros ${error.message}` || "";

            console.error(error_message);
            showAlert(error_message);
        } finally {
            setLoading(false);
        }
    };

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
        } catch (err) {
            const error_message = "Erro ao buscar os usuários";

            console.error(error_message);
            showAlert(error_message);

        }
    };

    const rentBook = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");

            if (!bookId) {
                showAlert("Por favor, insira o ID do livro.");
                return;
            }

            if (!userId) {
                showAlert("Por favor, insira ou selecione o ID do usuário.");
                return;
            }

            const response = await api.post("/api/Rents", {
                    bookId: bookId,
                    userId: userId,
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            if (response.status === 201) {
                showAlert("Livro alugado com sucesso!");
                fetchBooks(); 
            } else {
                showAlert("Erro ao alugar o livro");
            }
        } catch (err) {
            
            const message = err.response.data || "Erro ao alugar o livro";
            showAlert(message);
        }
    };

    const handleRentForMe = async () => {
        try {
            const loggedUserId = await AsyncStorage.getItem("authToken");
            const decoded = jwtDecode(loggedUserId);
            const isAdm = decoded.IsAdmin == "True" ? true : false;  

            setIsAdmin(isAdm);
         
            setUserId(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
            setIsRentingForOther(false);
        } catch (error) {
            showAlert("Erro ao obter o ID do usuário logado.");
        }
    };

    useEffect(() => {
        async function initializeData() {
            try {
                await fetchBooks();
                await fetchUsers();
            } catch (error) {
                console.error("Erro ao inicializar os dados:", error.message || "");
            }
        }
    
        initializeData();
    }, []);

    return (
      <>
        <Header title="Aluguel de livros" />
        <View style={styles.container}>
            <FlatList
                data={books}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.bookItem}>
                        <Text style={styles.bookTitle}>{item.title}</Text>
                        <Text style={styles.bookQuantity}>Disponíveis: {item.quantity}</Text>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                item.id.toString() === bookId && styles.buttonSelected
                            ]}
                            onPress={() => changeBook(item.id.toString(), item.title, item.quantity)}
                        >
                            <Text style={styles.buttonText}>
                                {item.id.toString() === bookId ? "Selecionado" : "Selecionar"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text>Nenhum livro disponível no momento.</Text>}
            />
            <View style={styles.form}>
                <Text style={styles.bookName}>Livro (Selecionado): { bookName }</Text>
                <View style={styles.buttons}>
                {
                    isAdmin ?? (
                        <TouchableOpacity style={styles.button} onPress={handleRentForMe}>
                            <Text style={styles.buttonText}>Alugar para mim</Text>
                        </TouchableOpacity>
                    )
                }
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setIsRentingForOther(true)}
                >
                    <Text style={styles.buttonText}>Selecionar usuário</Text>
                </TouchableOpacity>
                </View>
                {isRentingForOther && (
                    <Picker
                        selectedValue={userId}
                        onValueChange={(value) => setUserId(value)}
                        style={styles.input}
                    >
                        <Picker.Item label="Selecione um usuário" value="" />
                        {users.map((user) => (
                            <Picker.Item key={user.id} label={user.name} value={user.id} />
                        ))}
                    </Picker>
                )}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => rentBook()}
                >
                    <Text style={styles.buttonText}>Confirmar Aluguel</Text>
                </TouchableOpacity>
            </View>
        </View>
            <CustomAlert
                visible={alertVisible}
                onClose={() => setAlertVisible(false)}
                title="Atenção"
                message={alertMessage}
            />  
      </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    bookItem: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    form: {
        marginTop: 16,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        borderRadius: 4,
    },
    bookTitle: {
        fontWeight: "bold",
        fontSize: 16
    },
    button: {
        backgroundColor: '#ff5722',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
        buttonText: {
        color: '#fff',
        fontSize: 16,
    },
        bookQuantity: {
        fontWeight: "bold",
        marginBottom: 10
    },
        bookName: {
        fontWeight: "bold",
        fontSize: 15,
        marginBottom: 15
    },
    buttonSelected: {
        backgroundColor: '#4caf50',
    },
    buttonTextSelected: {
        color: '#fff', 
        fontWeight: 'bold',
    },
});
