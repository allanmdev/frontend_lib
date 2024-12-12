import {
    ActivityIndicator,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { Header } from "../components/Header";
import InputField from "../components/InputField";
import { useState } from "react";
import CustomAlert from "../components/CustomAlert";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const showAlert = (message) => {
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false); 
        if (selectedDate) {
            setDateOfBirth(selectedDate);
        }
    };

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            showAlert("Por favor, preencha todos os campos.");
            return;
        }

        if (password !== confirmPassword) {
            showAlert("As senhas não coincidem.");
            return;
        }

        setLoading(true);

        try {
            const token = await AsyncStorage.getItem("authToken");
            const response = await api.post(
                "/api/Auth/register",
                {
                    name: name.trim(),
                    email: email.trim(),
                    password: password.trim(),
                    confirmPassword: confirmPassword.trim(),
                    isAdmin: isAdmin,
                    dateOfBirth: dateOfBirth.toISOString(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201 || response.status === 200) {
                showAlert("Usuário registrado com sucesso!");
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                
            }
        } catch (err) {
            if (err.response) {
                showAlert(err.response.data.message || "Erro ao registrar o usuário.");
            } else {
                showAlert("Erro de conexão. Tente novamente mais tarde.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header title="Registrar Usuários" />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.container}>
                        <InputField
                            label="Nome"
                            placeholder="Digite seu nome"
                            value={name}
                            onChangeText={setName}
                        />

                        <InputField
                            label="E-mail"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />

                        <View style={styles.datePickerContainer}>
                            <Text style={styles.label}>Data de Nascimento</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={styles.datePickerButton}
                            >
                                <Text style={styles.datePickerText}>
                                    {dateOfBirth.toLocaleDateString("pt-BR")} 
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {showDatePicker && (
                            <DateTimePicker
                                value={dateOfBirth}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}

                        <InputField
                            label="Senha"
                            placeholder="Digite sua senha"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <InputField
                            label="Confirmar Senha"
                            placeholder="Confirme sua senha"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                        <View style={styles.checkContainer}>
                            <Text style={styles.label}>Administrador</Text>
                            <Switch
                                value={isAdmin}
                                onValueChange={setIsAdmin}
                                thumbColor={isAdmin ? "#ff5722" : "#f4f3f4"}
                                trackColor={{ false: "#767577", true: "#ddd" }}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleRegister}
                            style={[styles.button, loading && styles.buttonDisabled]}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Salvar</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('ListUsers')}
                            style={styles.buttonDefault}
                        >
                          <Text
                            style={styles.buttonDefaultText}
                          >Listar usuários</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

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
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
    },
    checkContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: "#ff5722",
        justifyContent: "center",
        borderRadius: 12,
        marginTop: 10,
    },
    buttonText: {
        textAlign: "center",
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    buttonDisabled: {
        backgroundColor: "#ffab91",
    },
    datePickerContainer: {
        marginBottom: 15,
    },
    datePickerButton: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#ccc",
        backgroundColor: "#fff",
    },
    datePickerText: {
        color: "#333",
    },
    buttonDefault: {
        backgroundColor: "transparent",
        marginTop: 50
    },
    buttonDefaultText: {
        color: "#1167ac",
        fontSize: 16,
        textAlign: "center"
    }
});
