import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import api from "../services/api"; 
import { Header } from "../components/Header"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Card, Button } from "react-native-paper";

export default function BookScreen() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingBookId, setEditingBookId] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const initialize = async () => {
      try {
        const tokenGenerate = await AsyncStorage.getItem("authToken");
        if (tokenGenerate) {
          setToken(tokenGenerate);
        } else {
          Alert.alert("Erro", "Token não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao obter o token:", error);
        Alert.alert("Erro", "Não foi possível obter o token.");
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (token) {
      fetchBooks();
    }
  }, [token]);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/api/Books", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data && response.data.data) {
        setBooks(response.data.data); 
      } else {
        Alert.alert("Erro", "Formato de resposta inesperado.");
        console.error("Formato de resposta:", response.data);
      }

    } catch (error) {
      console.error("Erro ao buscar os livros:", error);
      Alert.alert("Erro", "Não foi possível carregar os livros.");
    }
  };

  const addOrUpdateBook = async () => {
    if (!title || !author || !year || !quantity) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }
    try {
      if (editingBookId) {
        await api.put(
          `/api/Books/${editingBookId}`,
          { title, author, year, quantity },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        Alert.alert("Sucesso", "Livro atualizado com sucesso!");
      } else {
        await api.post(
          "/api/Books",
          { title, author, year, quantity },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        Alert.alert("Sucesso", "Livro adicionado com sucesso!");
      }
      fetchBooks();
      setTitle("");
      setAuthor("");
      setYear("");
      setQuantity("");
      setEditingBookId(null);
    } catch (error) {
      console.error("Erro ao salvar o livro:", error);
      Alert.alert("Erro", "Não foi possível salvar o livro.");
    }
  };

  const deleteBook = async (id) => {
    try {
      await api.delete(`/api/Books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Sucesso", "Livro removido com sucesso!");
      fetchBooks();
    } catch (error) {
      console.error("Erro ao excluir o livro:", error);
      Alert.alert("Erro", "Não foi possível remover o livro.");
    }
  };

  const editBook = (book) => {
    
    setTitle(book.title);
    setAuthor(book.author);
    setYear(book.year.toString());
    setQuantity(book.quantity.toString());
    setEditingBookId(book.id);
  };

  const renderBookItem = ({ item }) => (
    <Card style={{ marginBottom: 10, backgroundColor: "#F8F9FA" }}>
      <Card.Title title={item.title} subtitle={`Autor: ${item.author}`} />
      <Card.Content>
        <Text>Ano: {item.year}</Text>
        <Text>Quantidade: {item.quantity}</Text>
      </Card.Content>
      <Card.Actions>
        <Button 
          onPress={() => editBook(item)} 

        >Editar</Button>
        <Button onPress={() => deleteBook(item.id)} buttonColor="red">
          Excluir
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <>
      <Header title="Gestão de Livros" />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Autor"
          value={author}
          onChangeText={setAuthor}
        />
        <TextInput
          style={styles.input}
          placeholder="Ano"
          value={year}
          keyboardType="numeric"
          onChangeText={setYear}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          value={quantity}
          keyboardType="numeric"
          onChangeText={setQuantity}
        />
        <TouchableOpacity onPress={addOrUpdateBook} style={styles.addButton}>
          <Text style={styles.addButtonText}>
            {editingBookId ? "Atualizar Livro" : "Adicionar Livro"}
          </Text>
        </TouchableOpacity>
        <FlatList
          data={books}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
          renderItem={renderBookItem}
          style={styles.list}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f8ff",
  },
  input: {
    height: 45,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  addButton: {
    padding: 15,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 10,
    elevation: 2,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  bookItem: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  bookAuthor: {
    fontSize: 16,
    color: "#555",
    marginBottom: 2,
  },
  bookYear: {
    fontSize: 16,
    color: "#555",
    marginBottom: 2,
  },
  bookQuantity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
  button: {
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonDanger: {
    backgroundColor: "#ff4d4d",
  },
  buttonWarning: {
    backgroundColor: "#ffcc00",
  },
});