import { StyleSheet, Text, TextInput, View } from "react-native";

export default function InputField({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType }) {
    return (
        <View style={styles.container}>
            { label && <Text style={styles.label}>{label}</Text>}

            <TextInput 
                style={styles.input}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"

            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333"
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
        color: "#000"
    }
});