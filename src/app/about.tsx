import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AboutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F9FD" }}>
      <View
        style={{
          paddingTop: insets.top > 0 ? insets.top + 12 : 20,
          paddingHorizontal: 20,
          paddingBottom: 16,
          backgroundColor: "#FFFFFF",
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: "#F8F9FD",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#1E1B4B" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "800", color: "#1E1B4B" }}>
          About BrokersBlitz
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            padding: 24,
            alignItems: "center",
            marginBottom: 24,
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 24,
              backgroundColor: "#5D45F9",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="flash" size={38} color="#FFFFFF" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: "900", color: "#1E1B4B" }}>
            BrokersBlitz
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#5D45F9",
              marginTop: 4,
            }}
          >
            Version 1.0.0 (Production)
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              textAlign: "center",
              marginTop: 12,
              lineHeight: 22,
            }}
          >
            The comprehensive daily toolkit for Indian brokers, consultants, and
            agents across Real Estate, Automobiles, Insurance POSP, and Loan
            DSAs.
          </Text>
        </View>

        <View style={{ gap: 16, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              padding: 18,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Ionicons
                name="shield-checkmark"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{ fontSize: 15, fontWeight: "800", color: "#1E1B4B" }}
              >
                100% Offline & Private
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: "#4B5563", lineHeight: 20 }}>
              All client leads, property inventory, vehicle stock, and policy
              notes are stored securely on your local device via SQLite. Zero
              cloud sniffing or lead poaching.
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              padding: 18,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Ionicons
                name="speedometer"
                size={20}
                color="#5D45F9"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{ fontSize: 15, fontWeight: "800", color: "#1E1B4B" }}
              >
                Instant Deal Closures
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: "#4B5563", lineHeight: 20 }}>
              Quickly calculate client EMIs, loan payouts, vehicle transfer
              costs, and regional land conversions on the spot in front of
              clients.
            </Text>
          </View>
        </View>

        <View style={{ alignItems: "center", paddingVertical: 12 }}>
          <Text style={{ fontSize: 12, color: "#9CA3AF", fontWeight: "600" }}>
            Designed for Indian Independent Brokers & Channel Partners
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
