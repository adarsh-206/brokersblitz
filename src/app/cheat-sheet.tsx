import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ActiveTab = "property" | "vehicle" | "insurance" | "loans";

export default function CheatSheetScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<ActiveTab>("property");

  const [inputSqFt, setInputSqFt] = useState("1000");
  const sqFt = parseFloat(inputSqFt) || 0;

  const conversions = [
    {
      unit: "Gaj (Square Yards)",
      val: (sqFt / 9).toFixed(2),
      note: "1 Gaj = 9 Sq. Ft (North India)",
    },
    {
      unit: "Square Meters",
      val: (sqFt * 0.092903).toFixed(2),
      note: "1 Sq. M = 10.76 Sq. Ft",
    },
    {
      unit: "Guntha",
      val: (sqFt / 1089).toFixed(3),
      note: "1 Guntha = 1,089 Sq. Ft (MH/KA)",
    },
    {
      unit: "Bigha (Standard)",
      val: (sqFt / 27000).toFixed(4),
      note: "Approx 27,000 Sq. Ft",
    },
    {
      unit: "Acres",
      val: (sqFt / 43560).toFixed(4),
      note: "1 Acre = 43,560 Sq. Ft = 4840 Gaj",
    },
  ];

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
          Broker Knowledge Guide
        </Text>
      </View>

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={Platform.OS === "ios" ? 40 : 120}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#ECEFFE",
            borderRadius: 16,
            padding: 4,
            marginBottom: 20,
          }}
        >
          {(
            [
              { key: "property", label: "Property" },
              { key: "vehicle", label: "Vehicles" },
              { key: "insurance", label: "Insurance" },
              { key: "loans", label: "Loans" },
            ] as const
          ).map((item) => {
            const active = tab === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => setTab(item.key)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: active ? "#FFFFFF" : "transparent",
                  alignItems: "center",
                  shadowColor: active ? "#000" : "transparent",
                  shadowOpacity: active ? 0.05 : 0,
                  shadowRadius: 4,
                  elevation: active ? 2 : 0,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: active ? "800" : "600",
                    color: active ? "#5D45F9" : "#6B7280",
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {tab === "property" && (
          <View style={{ gap: 16 }}>
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 24,
                padding: 20,
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "800", color: "#1E1B4B" }}
              >
                Land Area Converter
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#6B7280",
                  marginTop: 2,
                  marginBottom: 14,
                }}
              >
                Enter Square Feet to calculate regional units:
              </Text>

              <TextInput
                keyboardType="numeric"
                value={inputSqFt}
                onChangeText={setInputSqFt}
                placeholder="Enter Sq. Ft"
                style={{
                  borderWidth: 1.5,
                  borderColor: "#5D45F9",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  fontSize: 18,
                  fontWeight: "800",
                  color: "#1E1B4B",
                  backgroundColor: "#F5F3FF",
                  marginBottom: 16,
                }}
              />

              <View style={{ gap: 10 }}>
                {conversions.map((c, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingVertical: 8,
                      borderBottomWidth: i === conversions.length - 1 ? 0 : 1,
                      borderBottomColor: "#F3F4F6",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: "#1E1B4B",
                        }}
                      >
                        {c.unit}
                      </Text>
                      <Text style={{ fontSize: 11, color: "#9CA3AF" }}>
                        {c.note}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "900",
                        color: "#5D45F9",
                      }}
                    >
                      {c.val}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                padding: 18,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "800",
                  color: "#1E1B4B",
                  marginBottom: 8,
                }}
              >
                Area Definitions (RERA)
              </Text>
              <Text style={{ fontSize: 13, color: "#4B5563", lineHeight: 20 }}>
                • <Text style={{ fontWeight: "700" }}>Carpet Area:</Text> Usable
                floor area inside apartment walls.{"\n"}•{" "}
                <Text style={{ fontWeight: "700" }}>Built-up Area:</Text> Carpet
                Area + wall thickness + balcony (+10-15%).{"\n"}•{" "}
                <Text style={{ fontWeight: "700" }}>Super Area:</Text> Built-up
                + Lift lobby & staircase share (+25-35%).
              </Text>
            </View>
          </View>
        )}

        {tab === "vehicle" && (
          <View style={{ gap: 16 }}>
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
                  marginBottom: 8,
                }}
              >
                <Ionicons
                  name="car-sport-outline"
                  size={20}
                  color="#5D45F9"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{ fontSize: 15, fontWeight: "800", color: "#1E1B4B" }}
                >
                  Vehicle IDV Depreciation Chart
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: "#4B5563", lineHeight: 20 }}>
                Insured Declared Value (IDV) for insurance and vehicle resale:
                {"\n"}• Up to 6 Months:{" "}
                <Text style={{ fontWeight: "700" }}>5%</Text> depreciation{"\n"}
                • 6 Months to 1 Year:{" "}
                <Text style={{ fontWeight: "700" }}>15%</Text> depreciation
                {"\n"}• 1 to 2 Years:{" "}
                <Text style={{ fontWeight: "700" }}>20%</Text> depreciation
                {"\n"}• 2 to 3 Years:{" "}
                <Text style={{ fontWeight: "700" }}>30%</Text> depreciation
                {"\n"}• 3 to 4 Years:{" "}
                <Text style={{ fontWeight: "700" }}>40%</Text> depreciation
                {"\n"}• 4 to 5 Years:{" "}
                <Text style={{ fontWeight: "700" }}>50%</Text> depreciation
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
                  marginBottom: 8,
                }}
              >
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#10B981"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{ fontSize: 15, fontWeight: "800", color: "#1E1B4B" }}
                >
                  RTO Transfer Forms (India)
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: "#4B5563", lineHeight: 20 }}>
                • <Text style={{ fontWeight: "700" }}>Form 28:</Text> No
                Objection Certificate (NOC) for inter-state transfer.{"\n"}•{" "}
                <Text style={{ fontWeight: "700" }}>Form 29:</Text> Notice of
                vehicle transfer to RTO.{"\n"}•{" "}
                <Text style={{ fontWeight: "700" }}>Form 30:</Text> Application
                for intimation and transfer of ownership.
              </Text>
            </View>
          </View>
        )}

        {tab === "insurance" && (
          <View style={{ gap: 16 }}>
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
                  marginBottom: 8,
                }}
              >
                <Ionicons
                  name="shield-outline"
                  size={20}
                  color="#5D45F9"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{ fontSize: 15, fontWeight: "800", color: "#1E1B4B" }}
                >
                  No Claim Bonus (NCB) Slabs
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: "#4B5563", lineHeight: 20 }}>
                NCB discount on vehicle Own Damage (OD) premium:{"\n"}• 1
                Claim-Free Year: <Text style={{ fontWeight: "700" }}>20%</Text>
                {"\n"}• 2 Consecutive Years:{" "}
                <Text style={{ fontWeight: "700" }}>25%</Text>
                {"\n"}• 3 Consecutive Years:{" "}
                <Text style={{ fontWeight: "700" }}>35%</Text>
                {"\n"}• 4 Consecutive Years:{" "}
                <Text style={{ fontWeight: "700" }}>45%</Text>
                {"\n"}• 5 Consecutive Years:{" "}
                <Text style={{ fontWeight: "700" }}>50% (Max)</Text>
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
                  marginBottom: 8,
                }}
              >
                <Ionicons
                  name="medkit-outline"
                  size={20}
                  color="#10B981"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{ fontSize: 15, fontWeight: "800", color: "#1E1B4B" }}
                >
                  Health Insurance Waiting Periods
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: "#4B5563", lineHeight: 20 }}>
                • Initial Period:{" "}
                <Text style={{ fontWeight: "700" }}>30 Days</Text> (accidents
                covered from day 1).{"\n"}• Specific Diseases (Cataract, Hernia,
                Joint replacements):{" "}
                <Text style={{ fontWeight: "700" }}>24 Months</Text>.{"\n"}•
                Pre-Existing Diseases (PED - BP, Diabetes):{" "}
                <Text style={{ fontWeight: "700" }}>24 to 36 Months</Text>.
              </Text>
            </View>
          </View>
        )}

        {tab === "loans" && (
          <View style={{ gap: 16 }}>
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
                  marginBottom: 8,
                }}
              >
                <Ionicons
                  name="speedometer-outline"
                  size={20}
                  color="#5D45F9"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{ fontSize: 15, fontWeight: "800", color: "#1E1B4B" }}
                >
                  CIBIL Score Eligibility
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: "#4B5563", lineHeight: 20 }}>
                • <Text style={{ fontWeight: "700" }}>750 - 900:</Text>{" "}
                Excellent (Instant sanction, lowest ROI).{"\n"}•{" "}
                <Text style={{ fontWeight: "700" }}>700 - 749:</Text> Good
                (Standard approval rates).{"\n"}•{" "}
                <Text style={{ fontWeight: "700" }}>650 - 699:</Text> Fair
                (Higher ROI, higher guarantor requirement).{"\n"}•{" "}
                <Text style={{ fontWeight: "700" }}>Below 650:</Text> High risk
                (Requires secured lending).
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
                  marginBottom: 8,
                }}
              >
                <Ionicons
                  name="wallet-outline"
                  size={20}
                  color="#10B981"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{ fontSize: 15, fontWeight: "800", color: "#1E1B4B" }}
                >
                  FOIR (Fixed Obligation to Income Ratio)
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: "#4B5563", lineHeight: 20 }}>
                Banks cap all total monthly EMIs at{" "}
                <Text style={{ fontWeight: "700" }}>50% to 65%</Text> of net
                monthly take-home salary.
              </Text>
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}
