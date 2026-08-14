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
    if (target === "emi") {
      router.push("/emi-calculator");
    } else if (target === "brokerage") {
      router.push("/brokerage-calculator");
    } else if (target === "cheatsheet") {
      router.push("/cheat-sheet");
    } else if (target === "about") {
      router.push("/about");
    } else if (target === "reset") {
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
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: 28 }}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "900",
              color: "#1E1B4B",
              letterSpacing: -0.5,
            }}
          >
            Tools & Toolkit
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#6B7280",
              marginTop: 4,
            }}
          >
            Real Estate • Vehicles • Insurance • Loan DSA
          </Text>
        </View>

        <View style={{ gap: 14, marginBottom: 28 }}>
          <TouchableOpacity
            onPress={() => handlePress("emi")}
            activeOpacity={0.75}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 18,
              paddingVertical: 16,
              borderRadius: 22,
              elevation: 2,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
            }}
          >
            <View
              style={{
                width: 46,
                height: 46,
                backgroundColor: "rgba(93, 69, 249, 0.08)",
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Ionicons name="calculator" size={22} color="#5D45F9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: "#1E1B4B",
                }}
              >
                All-in-One Loan EMI
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: "#6B7280",
                  marginTop: 2,
                }}
              >
                Home, Car/Bike & Personal loan schedules
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handlePress("brokerage")}
            activeOpacity={0.75}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 18,
              paddingVertical: 16,
              borderRadius: 22,
              elevation: 2,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
            }}
          >
            <View
              style={{
                width: 46,
                height: 46,
                backgroundColor: "rgba(93, 69, 249, 0.08)",
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Ionicons name="pie-chart" size={22} color="#5D45F9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: "#1E1B4B",
                }}
              >
                Commission & Brokerage
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: "#6B7280",
                  marginTop: 2,
                }}
              >
                Property, Auto, Insurance POSP & Loan DSA
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 28 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 14,
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
              Industry Knowledge
            </Text>
          </View>

          <View style={{ gap: 14 }}>
            <TouchableOpacity
              onPress={() => handlePress("cheatsheet")}
              activeOpacity={0.75}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 18,
                paddingVertical: 16,
                borderRadius: 22,
                elevation: 2,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
              }}
            >
              <View
                style={{
                  width: 46,
                  height: 46,
                  backgroundColor: "rgba(93, 69, 249, 0.08)",
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}
              >
                <Ionicons name="book-outline" size={22} color="#5D45F9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "800",
                    color: "#1E1B4B",
                  }}
                >
                  Agent Guide & Cheatsheet
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: "#6B7280",
                    marginTop: 2,
                  }}
                >
                  Land Units, Vehicle IDV, Insurance & CIBIL
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handlePress("about")}
              activeOpacity={0.75}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 18,
                paddingVertical: 16,
                borderRadius: 22,
                elevation: 2,
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
              }}
            >
              <View
                style={{
                  width: 46,
                  height: 46,
                  backgroundColor: "rgba(93, 69, 249, 0.08)",
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}
              >
                <Ionicons name="information-circle" size={22} color="#5D45F9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "800",
                    color: "#1E1B4B",
                  }}
                >
                  About BrokersBlitz
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: "#6B7280",
                    marginTop: 2,
                  }}
                >
                  Multi-domain broker CRM & offline database
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 14,
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
            activeOpacity={0.75}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 18,
              paddingVertical: 16,
              borderRadius: 22,
              elevation: 2,
              shadowColor: "#000000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
            }}
          >
            <View
              style={{
                width: 46,
                height: 46,
                backgroundColor: "rgba(239, 68, 68, 0.08)",
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Ionicons name="refresh-circle" size={22} color="#EF4444" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: "#EF4444",
                }}
              >
                Factory Reset
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: "#9CA3AF",
                  marginTop: 2,
                }}
              >
                Wipe all local inventory and clients
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#FCA5A5" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomAlertModal
        visible={showResetModal}
        type="danger"
        title="Factory Reset App?"
        message="This action will permanently delete all your local inventory listings, client leads, and saved records across all categories. You will not be able to restore this data."
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
