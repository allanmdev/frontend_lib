import { useState } from "react";
import { Text, TouchableOpacity, View, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function LoginScreen({ navigation }) {
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg ] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setErrMsg("Preencha todos os campos!");
            return;
        } 

        setLoading(true);
        setErrMsg("");


        try {
            const response = await api.post("/api/Auth/login", {
                email,
                password
            });

            const { token } = response.data;

            await AsyncStorage.setItem("authToken", token);

            navigation.navigate("Home");
        } catch (err) {
            console.log(err)
            if (err.response) {
                setErrMsg(err.response.data.message || "Erro ao fazer login");
            } else if (err.request) {
                setErrMsg("Erro ao conectar ao servidor.");
            } else {
                setErrMsg("Algo deu errado!");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                <Text style={styles.logoSpan}>_</Text>
                Biblioteca
            </Text>

            {errMsg ? (
                <View style={styles.boxAlert}>
                    <Icon name="error" size={20} color="#d32f2f" style={styles.icon} />
                    <Text style={styles.textAlert}>{errMsg}</Text>
                </View>
            ) : null }

            <TextInput 
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />

            <TextInput 
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                style={styles.input}
            />

            <TouchableOpacity 
                onPress={handleLogin}
                style={[styles.button, loading && styles.buttonDisabled]}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Acessar</Text>
                )}

            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",

        marginBottom: 20,
        color: "#777"
    },
    logoSpan: {
        color: "#ff5722"
    },  
    input: {
        paddingLeft: 20, 

        width: "100%",
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#eee",
        marginBottom: 10
    },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: "#ff5722",
        justifyContent: "center",
        borderRadius: 12,
        marginTop: 10
    },
    buttonText: {
        textAlign: "center",
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
        textTransform: "uppercase"
    },
    buttonDisabled: {
        backgroundColor: "#ffab91"
    },
    boxAlert: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "#ffcccc",
        padding: 10,
        borderRadius: 8,
        marginBottom: 15
    },
    iconAlert: {
        marginRight: 50,
    },
    textAlert: {
        color: "#d32f2f",
        fontSize: 14,
        textAlign: "center"
    }
}); 