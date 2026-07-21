import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = () => {
    router.replace("/(tabs)");
  };

  const handleGuestLogin = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FC" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              paddingHorizontal: 24,
              paddingVertical: 16,
            }}
          >
            <View
              style={{ alignItems: "center", marginTop: 24, marginBottom: 20 }}
            >
              <View
                style={{
                  width: 74,
                  height: 74,
                  backgroundColor: "#5D45F9",
                  borderRadius: 22,
                  alignItems: "center",
                  justifyContent: "center",
                  elevation: 6,
                  shadowColor: "#5D45F9",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.2,
                  shadowRadius: 10,
                  marginBottom: 16,
                }}
              >
                <Ionicons name="flash" size={38} color="#FFFFFF" />
              </View>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "900",
                  color: "#1E1B4B",
                  letterSpacing: -0.5,
                }}
              >
                Brokers<Text style={{ color: "#5D45F9" }}>Blitz</Text>
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                  marginTop: 6,
                  fontWeight: "500",
                }}
              >
                Log in to close deals faster
              </Text>
            </View>

            <View
              style={{ flex: 1, justifyContent: "center", marginBottom: 24 }}
            >
              <View style={{ marginBottom: 18 }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "800",
                    color: "#1E1B4B",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Email or Mobile
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                    paddingHorizontal: 16,
                    height: 54,
                  }}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#5D45F9"
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      color: "#1E1B4B",
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                    placeholder="Enter email or phone"
                    placeholderTextColor="#9CA3AF"
                    value={identifier}
                    onChangeText={setIdentifier}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "800",
                    color: "#1E1B4B",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Password
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                    paddingHorizontal: 16,
                    height: 54,
                  }}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#5D45F9"
                    style={{ marginRight: 12 }}
                  />
                  <TextInput
                    style={{
                      flex: 1,
                      color: "#1E1B4B",
                      fontSize: 14,
                      fontWeight: "500",
                    }}
                    placeholder="Enter password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!isPasswordVisible}
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    <Ionicons
                      name={
                        isPasswordVisible ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={{ alignSelf: "flex-end", paddingVertical: 4 }}
                onPress={() => router.push("/(auth)/forgot-password")}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: "700", color: "#5D45F9" }}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ width: "100%" }}>
              <TouchableOpacity
                style={{
                  width: "100%",
                  backgroundColor: "#5D45F9",
                  paddingVertical: 16,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  elevation: 4,
                  shadowColor: "#5D45F9",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.25,
                  shadowRadius: 8,
                  marginBottom: 16,
                }}
                onPress={handleLogin}
              >
                <Text
                  style={{ color: "white", fontWeight: "800", fontSize: 16 }}
                >
                  Log In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: "100%",
                  backgroundColor: "rgba(93, 69, 249, 0.08)",
                  paddingVertical: 15,
                  borderRadius: 18,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  borderWidth: 1.5,
                  borderColor: "rgba(93, 69, 249, 0.15)",
                  marginBottom: 24,
                }}
                onPress={handleGuestLogin}
              >
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="#5D45F9"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{ color: "#5D45F9", fontWeight: "700", fontSize: 14 }}
                >
                  Explore as Guest
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{ fontSize: 13, color: "#6B7280", fontWeight: "500" }}
                >
                  New broker here?{" "}
                </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "800",
                      color: "#5D45F9",
                    }}
                  >
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
