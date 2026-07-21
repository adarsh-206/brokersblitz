import { Text, View } from "react-native";

export default function InventoryScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F7F8FC",
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700", color: "#1E1B4B" }}>
        Inventory List
      </Text>
    </View>
  );
}
