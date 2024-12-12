import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

export function Header({ title = "" }) {
    const navigation = useNavigation();
    
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <Text style={styles.title} numberOfLines={1}>{title}</Text>

                <View style={styles.iconContainer}></View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#ff5722",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ff5722",
        paddingHorizontal: 4,
        height: 60,
        width: "100%",
        justifyContent: "space-between",
    },
    title: {
        textAlign: "center",
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        flex: 1, 
    },
    iconContainer: {
        width: 40,
        alignItems: "center",
        justifyContent: "center",
    },
});
