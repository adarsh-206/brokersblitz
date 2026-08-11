import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomAlertModal from "../../components/CustomAlertModal";
import { db } from "../../db";

export default function MoreScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePress = (target: string) => {
    if (target === "reset") {
      setShowResetModal(true);
    }
  };

  const handleFactoryReset = () => {
    try {
      db.execSync(`
        DELETE FROM leads;
        DELETE FROM inventory;
        DELETE FROM sqlite_sequence WHERE name IN ('inventory', 'leads');
      `);
      setShowResetModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      setShowResetModal(false);
    }
  };

  const handleGoHome = () => {
    setShowSuccessModal(false);
    router.replace("/(tabs)");
  };

  return (
    <React.Fragment>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#F8F9FD" }}
        contentContainerStyle={{
          paddingTop: insets.top > 0 ? insets.top + 24 : 36,
          paddingHorizontal: 24,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "900",
              color: "#1E1B4B",
              letterSpacing: -0.5,
            }}
          >
            Tools & Support
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              color: "#6B7280",
              marginTop: 4,
            }}
          >
            Manage your professional toolkit
          </Text>
        </View>

        <View style={{ gap: 16, marginBottom: 32 }}>
          <TouchableOpacity
            onPress={() => handlePress("emi")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 20,
              paddingVertical: 18,
              borderRadius: 24,
              elevation: 2,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.02,
              shadowRadius: 8,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                backgroundColor: "rgba(93, 69, 249, 0.08)",
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <Ionicons name="calculator" size={20} color="#5D45F9" />
            </View>
            <Text
              style={{
                flex: 1,
                fontSize: 16,
                fontWeight: "800",
                color: "#1E1B4B",
              }}
            >
              EMI Calculator
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handlePress("brokerage")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 20,
              paddingVertical: 18,
              borderRadius: 24,
              elevation: 2,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.02,
              shadowRadius: 8,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                backgroundColor: "rgba(93, 69, 249, 0.08)",
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <Ionicons name="pie-chart" size={20} color="#5D45F9" />
            </View>
            <Text
              style={{
                flex: 1,
                fontSize: 16,
                fontWeight: "800",
                color: "#1E1B4B",
              }}
            >
              Brokerage Calculator
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 32 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
              paddingLeft: 4,
            }}
          >
            <View
              style={{
                width: 3,
                height: 14,
                backgroundColor: "#5D45F9",
                borderRadius: 2,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontSize: 11,
                fontWeight: "800",
                color: "#9CA3AF",
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              Support
            </Text>
          </View>

          <View style={{ gap: 16 }}>
            <TouchableOpacity
              onPress={() => handlePress("help")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 20,
                paddingVertical: 18,
                borderRadius: 24,
                elevation: 2,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.02,
                shadowRadius: 8,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "rgba(93, 69, 249, 0.08)",
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                }}
              >
                <Ionicons name="help-circle" size={22} color="#5D45F9" />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: "800",
                  color: "#1E1B4B",
                }}
              >
                Help & Support
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handlePress("about")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 20,
                paddingVertical: 18,
                borderRadius: 24,
                elevation: 2,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.02,
                shadowRadius: 8,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "rgba(93, 69, 249, 0.08)",
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                }}
              >
                <Ionicons name="information-circle" size={22} color="#5D45F9" />
              </View>
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: "800",
                  color: "#1E1B4B",
                }}
              >
                About BrokersBlitz
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
              paddingLeft: 4,
            }}
          >
            <View
              style={{
                width: 3,
                height: 14,
                backgroundColor: "#EF4444",
                borderRadius: 2,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                fontSize: 11,
                fontWeight: "800",
                color: "#9CA3AF",
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              System Data
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handlePress("reset")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 20,
              paddingVertical: 18,
              borderRadius: 24,
              elevation: 2,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.02,
              shadowRadius: 8,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                backgroundColor: "rgba(239, 68, 68, 0.08)",
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
              }}
            >
              <Ionicons name="refresh-circle" size={22} color="#EF4444" />
            </View>
            <Text
              style={{
                flex: 1,
                fontSize: 16,
                fontWeight: "800",
                color: "#EF4444",
              }}
            >
              Factory Reset
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#FCA5A5" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomAlertModal
        visible={showResetModal}
        type="danger"
        title="Factory Reset App?"
        message="This action will permanently delete all your local inventory listings, client leads, and saved records. You will not be able to restore this data."
        confirmText="Reset Data"
        cancelText="Cancel"
        onConfirm={handleFactoryReset}
        onCancel={() => setShowResetModal(false)}
      />

      <CustomAlertModal
        visible={showSuccessModal}
        type="success"
        title="Reset Successful"
        message="Your database has been cleared completely and restored to fresh factory settings."
        confirmText="Go Home"
        onConfirm={handleGoHome}
      />
    </React.Fragment>
  );
}
