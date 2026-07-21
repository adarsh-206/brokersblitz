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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetRequest = () => {
    if (identifier.trim() !== "") {
      setIsSubmitted(true);
    }
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
          <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
                marginBottom: 32,
              }}
            >
              <TouchableOpacity
                onPress={() => router.back()}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: "#FFFFFF",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  elevation: 2,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                }}
              >
                <Ionicons name="arrow-back" size={20} color="#1E1B4B" />
              </TouchableOpacity>
            </View>

            {!isSubmitted ? (
              <View style={{ width: "100%" }}>
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      width: 74,
                      height: 74,
                      backgroundColor: "rgba(93, 69, 249, 0.08)",
                      borderRadius: 22,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 32,
                      borderWidth: 1,
                      borderColor: "rgba(93, 69, 249, 0.15)",
                    }}
                  >
                    <Ionicons name="key-outline" size={36} color="#5D45F9" />
                  </View>

                  <Text
                    style={{
                      fontSize: 26,
                      fontWeight: "900",
                      color: "#1E1B4B",
                      textAlign: "center",
                      letterSpacing: -0.5,
                    }}
                  >
                    Forgot Password?
                  </Text>

                  <Text
                    style={{
                      fontSize: 13,
                      color: "#6B7280",
                      marginTop: 8,
                      marginBottom: 16,
                      textAlign: "center",
                      paddingHorizontal: 16,
                      lineHeight: 20,
                      fontWeight: "500",
                    }}
                  >
                    Enter your registered details below and we will send you
                    recovery instructions.
                  </Text>
                </View>

                <View style={{ marginTop: 32, marginBottom: 48 }}>
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
                      elevation: 1,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.02,
                      shadowRadius: 2,
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
                  }}
                  onPress={handleResetRequest}
                >
                  <Text
                    style={{ color: "white", fontWeight: "800", fontSize: 16 }}
                  >
                    Send OTP
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ width: "100%" }}>
                <View style={{ alignItems: "center", marginBottom: 32 }}>
                  <View
                    style={{
                      width: 80,
                      height: 80,
                      backgroundColor: "rgba(34, 197, 94, 0.08)",
                      borderRadius: 24,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                      borderWidth: 1,
                      borderColor: "rgba(34, 197, 94, 0.15)",
                    }}
                  >
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={44}
                      color="#22C55E"
                    />
                  </View>

                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "900",
                      color: "#1E1B4B",
                      textAlign: "center",
                      letterSpacing: -0.5,
                    }}
                  >
                    Reset Link Sent!
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      color: "#6B7280",
                      marginTop: 10,
                      textAlign: "center",
                      lineHeight: 22,
                      fontWeight: "500",
                      paddingHorizontal: 8,
                    }}
                  >
                    We have successfully sent security instructions to{"\n"}
                    <Text style={{ color: "#1E1B4B", fontWeight: "700" }}>
                      {identifier}
                    </Text>
                  </Text>
                </View>

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
                  }}
                  onPress={() => router.replace("/(auth)/login")}
                >
                  <Text
                    style={{ color: "white", fontWeight: "800", fontSize: 16 }}
                  >
                    Back to Log In
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
