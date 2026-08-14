import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Industry = "property" | "vehicle" | "insurance" | "loans";

export default function BrokerageCalculatorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [industry, setIndustry] = useState<Industry>("property");

  const [propDealValue, setPropDealValue] = useState("7500000");
  const [buyerPercent, setBuyerPercent] = useState("1");
  const [sellerPercent, setSellerPercent] = useState("1");

  const [vehiclePrice, setVehiclePrice] = useState("850000");
  const [vehicleCutType, setVehicleCutType] = useState<"percent" | "fixed">(
    "percent",
  );
  const [vehicleCutValue, setVehicleCutValue] = useState("2");

  const [policyPremium, setPolicyPremium] = useState("28000");
  const [pospPercent, setPospPercent] = useState("15");

  const [loanDisbursal, setLoanDisbursal] = useState("3000000");
  const [dsaPayoutPercent, setDsaPayoutPercent] = useState("0.75");

  const [includeGst, setIncludeGst] = useState(true);

  const results = useMemo(() => {
    let base = 0;
    let subtitle = "";

    if (industry === "property") {
      const deal = parseFloat(propDealValue) || 0;
      const bp = parseFloat(buyerPercent) || 0;
      const sp = parseFloat(sellerPercent) || 0;
      const bCut = (deal * bp) / 100;
      const sCut = (deal * sp) / 100;
      base = bCut + sCut;
      subtitle = `Buyer: ₹${Math.round(bCut).toLocaleString("en-IN")} | Seller: ₹${Math.round(sCut).toLocaleString("en-IN")}`;
    } else if (industry === "vehicle") {
      const price = parseFloat(vehiclePrice) || 0;
      const val = parseFloat(vehicleCutValue) || 0;
      base = vehicleCutType === "percent" ? (price * val) / 100 : val;
      subtitle =
        vehicleCutType === "percent"
          ? `${val}% commission on deal value`
          : "Fixed dealer margin / token commission";
    } else if (industry === "insurance") {
      const premium = parseFloat(policyPremium) || 0;
      const rate = parseFloat(pospPercent) || 0;
      base = (premium * rate) / 100;
      subtitle = `POSP Payout on Net OD / Base Premium`;
    } else if (industry === "loans") {
      const disbursal = parseFloat(loanDisbursal) || 0;
      const dsaRate = parseFloat(dsaPayoutPercent) || 0;
      base = (disbursal * dsaRate) / 100;
      subtitle = `Bank DSA / Channel Partner Payout`;
    }

    const gst = includeGst ? base * 0.18 : 0;
    const grandTotal = base + gst;

    return {
      baseAmount: Math.round(base),
      gstAmount: Math.round(gst),
      grandTotal: Math.round(grandTotal),
      subtitle,
    };
  }, [
    industry,
    propDealValue,
    buyerPercent,
    sellerPercent,
    vehiclePrice,
    vehicleCutType,
    vehicleCutValue,
    policyPremium,
    pospPercent,
    loanDisbursal,
    dsaPayoutPercent,
    includeGst,
  ]);

  const formatIndianNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(num);
  };

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
          Commission Calculator
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
              { key: "vehicle", label: "Vehicle" },
              { key: "insurance", label: "Insurance" },
              { key: "loans", label: "Loan DSA" },
            ] as const
          ).map((item) => {
            const active = industry === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => setIndustry(item.key)}
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

        <View
          style={{
            backgroundColor: "#1E1B4B",
            borderRadius: 24,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 12,
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Total Earning
          </Text>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 34,
              fontWeight: "900",
              marginTop: 4,
            }}
          >
            ₹{formatIndianNumber(results.grandTotal)}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 16,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: "rgba(255, 255, 255, 0.12)",
            }}
          >
            <View>
              <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
                Net Commission
              </Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 15,
                  fontWeight: "700",
                  marginTop: 2,
                }}
              >
                ₹{formatIndianNumber(results.baseAmount)}
              </Text>
            </View>
            <View>
              <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
                GST (18% if billed)
              </Text>
              <Text
                style={{
                  color: includeGst ? "#F87171" : "#9CA3AF",
                  fontSize: 15,
                  fontWeight: "700",
                  marginTop: 2,
                }}
              >
                ₹{formatIndianNumber(results.gstAmount)}
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 12,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              padding: 10,
              borderRadius: 12,
            }}
          >
            <Text
              style={{ color: "#D1D5DB", fontSize: 12, textAlign: "center" }}
            >
              {results.subtitle}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            padding: 20,
            gap: 18,
            marginBottom: 20,
          }}
        >
          {industry === "property" && (
            <>
              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#1E1B4B",
                    marginBottom: 8,
                  }}
                >
                  Property Deal Value (₹)
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={propDealValue}
                  onChangeText={setPropDealValue}
                  placeholder="e.g. 7500000"
                  style={{
                    borderWidth: 1.5,
                    borderColor: "#EEF2F6",
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#1E1B4B",
                    backgroundColor: "#F9FAFB",
                  }}
                />
              </View>

              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color: "#1E1B4B",
                      marginBottom: 8,
                    }}
                  >
                    Buyer Side (%)
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    value={buyerPercent}
                    onChangeText={setBuyerPercent}
                    placeholder="1"
                    style={{
                      borderWidth: 1.5,
                      borderColor: "#EEF2F6",
                      borderRadius: 16,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      fontSize: 15,
                      fontWeight: "700",
                      color: "#1E1B4B",
                      backgroundColor: "#F9FAFB",
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color: "#1E1B4B",
                      marginBottom: 8,
                    }}
                  >
                    Seller Side (%)
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    value={sellerPercent}
                    onChangeText={setSellerPercent}
                    placeholder="1"
                    style={{
                      borderWidth: 1.5,
                      borderColor: "#EEF2F6",
                      borderRadius: 16,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      fontSize: 15,
                      fontWeight: "700",
                      color: "#1E1B4B",
                      backgroundColor: "#F9FAFB",
                    }}
                  />
                </View>
              </View>
            </>
          )}

          {industry === "vehicle" && (
            <>
              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#1E1B4B",
                    marginBottom: 8,
                  }}
                >
                  Vehicle Selling Price (₹)
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={vehiclePrice}
                  onChangeText={setVehiclePrice}
                  placeholder="e.g. 850000"
                  style={{
                    borderWidth: 1.5,
                    borderColor: "#EEF2F6",
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#1E1B4B",
                    backgroundColor: "#F9FAFB",
                  }}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#1E1B4B",
                    marginBottom: 8,
                  }}
                >
                  Commission Cut (
                  {vehicleCutType === "percent" ? "%" : "₹ Fixed"})
                </Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TextInput
                    keyboardType="numeric"
                    value={vehicleCutValue}
                    onChangeText={setVehicleCutValue}
                    placeholder="e.g. 2"
                    style={{
                      flex: 1,
                      borderWidth: 1.5,
                      borderColor: "#EEF2F6",
                      borderRadius: 16,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      fontSize: 15,
                      fontWeight: "700",
                      color: "#1E1B4B",
                      backgroundColor: "#F9FAFB",
                    }}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setVehicleCutType(
                        vehicleCutType === "percent" ? "fixed" : "percent",
                      )
                    }
                    style={{
                      backgroundColor: "#5D45F9",
                      paddingHorizontal: 16,
                      borderRadius: 16,
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontWeight: "700",
                        fontSize: 13,
                      }}
                    >
                      {vehicleCutType === "percent"
                        ? "Switch to ₹"
                        : "Switch to %"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {industry === "insurance" && (
            <>
              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#1E1B4B",
                    marginBottom: 8,
                  }}
                >
                  Net OD / Base Premium (₹)
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={policyPremium}
                  onChangeText={setPolicyPremium}
                  placeholder="e.g. 28000"
                  style={{
                    borderWidth: 1.5,
                    borderColor: "#EEF2F6",
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#1E1B4B",
                    backgroundColor: "#F9FAFB",
                  }}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#1E1B4B",
                    marginBottom: 8,
                  }}
                >
                  Agent / POSP Commission (%)
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={pospPercent}
                  onChangeText={setPospPercent}
                  placeholder="e.g. 15"
                  style={{
                    borderWidth: 1.5,
                    borderColor: "#EEF2F6",
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#1E1B4B",
                    backgroundColor: "#F9FAFB",
                  }}
                />
              </View>
            </>
          )}

          {industry === "loans" && (
            <>
              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#1E1B4B",
                    marginBottom: 8,
                  }}
                >
                  Disbursed Loan Amount (₹)
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={loanDisbursal}
                  onChangeText={setLoanDisbursal}
                  placeholder="e.g. 3000000"
                  style={{
                    borderWidth: 1.5,
                    borderColor: "#EEF2F6",
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#1E1B4B",
                    backgroundColor: "#F9FAFB",
                  }}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#1E1B4B",
                    marginBottom: 8,
                  }}
                >
                  DSA Channel Partner Payout (%)
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={dsaPayoutPercent}
                  onChangeText={setDsaPayoutPercent}
                  placeholder="e.g. 0.75"
                  style={{
                    borderWidth: 1.5,
                    borderColor: "#EEF2F6",
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#1E1B4B",
                    backgroundColor: "#F9FAFB",
                  }}
                />
              </View>
            </>
          )}

          <TouchableOpacity
            onPress={() => setIncludeGst(!includeGst)}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 8,
              borderTopWidth: 1,
              borderTopColor: "#F3F4F6",
            }}
          >
            <View>
              <Text
                style={{ fontSize: 14, fontWeight: "700", color: "#1E1B4B" }}
              >
                Apply 18% GST Invoice
              </Text>
              <Text style={{ fontSize: 12, color: "#6B7280" }}>
                Add standard GST to your payout invoice
              </Text>
            </View>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                backgroundColor: includeGst ? "#5D45F9" : "#E5E7EB",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {includeGst && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: "#EEF2FF",
            borderRadius: 18,
            padding: 16,
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <Ionicons
            name="bulb-outline"
            size={20}
            color="#5D45F9"
            style={{ marginRight: 10, marginTop: 2 }}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "800",
                color: "#1E1B4B",
                marginBottom: 2,
              }}
            >
              Industry Norms
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#4B5563",
                lineHeight: 18,
                fontWeight: "500",
              }}
            >
              {industry === "property" &&
                "Real estate: 1% each side for sales, 1 month rent for rentals."}
              {industry === "vehicle" &&
                "Used cars & bikes: Dealers charge 2% to 3% or ₹10,000 to ₹25,000 fixed cut per car."}
              {industry === "insurance" &&
                "Motor OD: 15% to 22.5% commission. Health & Term Insurance: 15% to 30% first year."}
              {industry === "loans" &&
                "Home Loan DSA: 0.30% to 0.60%. Unsecured Personal & Business Loans: 1.5% to 2.5%."}
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
