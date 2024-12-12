import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = ({ navigation }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    navigation.navigate("Login");
  };

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("authToken");

      const decoded = jwtDecode(storedToken);
      const isAdm = decoded.IsAdmin == "True" ? true : false;  

      setIsAdmin(isAdm);
    };
    getToken();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sistema de Biblioteca</Text>
        <Text style={styles.subtitle}>Gerencie suas opções com facilidade</Text>
      </View>

      <ScrollView contentContainerStyle={styles.menuContainer}>
        {isAdmin === true && (
          <>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Book")}
              activeOpacity={0.8}
            >
              <Text style={styles.cardTitle}>📚 Livros</Text>
              <Text style={styles.cardDescription}>
                Visualize e gerencie o catálogo de livros.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.8}
            >
              <Text style={styles.cardTitle}>👤 Cadastrar Usuários</Text>
              <Text style={styles.cardDescription}>
                Adicione novos usuários ao sistema.
              </Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Rent")}
          activeOpacity={0.8}
        >
          <Text style={styles.cardTitle}>📖 Alugar Livros</Text>
          <Text style={styles.cardDescription}>
            Realize o aluguel de livros facilmente.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Return")}
          activeOpacity={0.8}
        >
          <Text style={styles.cardTitle}>📚 Devolver Livros</Text>
          <Text style={styles.cardDescription}>
            Realize a devolução de livros facilmente.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>🚪 Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    marginTop: 30,
    marginBottom: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 5,
    textAlign: "center",
  },
  menuContainer: {
    flexGrow: 1, 
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#34495e",
  },
  cardDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 20,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Home;
