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

type LoanType = "home" | "vehicle" | "personal";

export default function EMICalculatorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [loanType, setLoanType] = useState<LoanType>("home");
  const [loanAmount, setLoanAmount] = useState("4500000");
  const [interestRate, setInterestRate] = useState("8.5");
  const [tenure, setTenure] = useState("20");

  const handleTypeChange = (type: LoanType) => {
    setLoanType(type);
    if (type === "home") {
      setLoanAmount("4500000");
      setInterestRate("8.5");
      setTenure("20");
    } else if (type === "vehicle") {
      setLoanAmount("900000");
      setInterestRate("9.5");
      setTenure("5");
    } else if (type === "personal") {
      setLoanAmount("500000");
      setInterestRate("12.5");
      setTenure("3");
    }
  };

  const calculation = useMemo(() => {
    const P = parseFloat(loanAmount) || 0;
    const r = (parseFloat(interestRate) || 0) / 12 / 100;
    const n = (parseFloat(tenure) || 0) * 12;

    if (P <= 0 || r <= 0 || n <= 0) {
      return {
        monthlyEmi: 0,
        totalInterest: 0,
        totalPayment: 0,
        principalRatio: 0,
      };
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = emi * n;
    const totalInt = totalPay - P;
    const ratio = Math.round((P / totalPay) * 100);

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInt),
      totalPayment: Math.round(totalPay),
      principalRatio: Math.min(Math.max(ratio, 0), 100),
    };
  }, [loanAmount, interestRate, tenure]);

  const formatIndianNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getReadableLakhs = (valStr: string) => {
    const val = parseFloat(valStr) || 0;
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${formatIndianNumber(val)}`;
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
          Loan EMI Calculator
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
              { key: "home", label: "Home Loan" },
              { key: "vehicle", label: "Auto / Car" },
              { key: "personal", label: "Personal / Biz" },
            ] as const
          ).map((item) => {
            const active = loanType === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => handleTypeChange(item.key)}
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
                    fontSize: 12,
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
            backgroundColor: "#5D45F9",
            borderRadius: 24,
            padding: 24,
            marginBottom: 24,
            shadowColor: "#5D45F9",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: 13,
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Monthly EMI Payable
          </Text>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 34,
              fontWeight: "900",
              marginTop: 6,
            }}
          >
            ₹{formatIndianNumber(calculation.monthlyEmi)}
          </Text>

          <View
            style={{
              height: 1,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              marginVertical: 18,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.75)",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                Loan Principal
              </Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: "800",
                  marginTop: 2,
                }}
              >
                ₹{formatIndianNumber(parseFloat(loanAmount) || 0)}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.75)",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                Total Interest
              </Text>
              <Text
                style={{
                  color: "#FDE047",
                  fontSize: 16,
                  fontWeight: "800",
                  marginTop: 2,
                }}
              >
                ₹{formatIndianNumber(calculation.totalInterest)}
              </Text>
            </View>
          </View>

          <View
            style={{
              height: 8,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: 4,
              overflow: "hidden",
              flexDirection: "row",
              marginTop: 4,
            }}
          >
            <View
              style={{
                flex: calculation.principalRatio || 1,
                backgroundColor: "#34D399",
              }}
            />
            <View
              style={{
                flex: 100 - (calculation.principalRatio || 0),
                backgroundColor: "#FDE047",
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 6,
            }}
          >
            <Text
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: 11,
                fontWeight: "600",
              }}
            >
              Principal: {calculation.principalRatio}%
            </Text>
            <Text
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: 11,
                fontWeight: "600",
              }}
            >
              Interest: {100 - calculation.principalRatio}%
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            padding: 20,
            gap: 20,
            marginBottom: 20,
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text
                style={{ fontSize: 14, fontWeight: "700", color: "#1E1B4B" }}
              >
                Loan Amount (₹)
              </Text>
              <Text
                style={{ fontSize: 13, fontWeight: "800", color: "#5D45F9" }}
              >
                {getReadableLakhs(loanAmount)}
              </Text>
            </View>
            <TextInput
              keyboardType="numeric"
              value={loanAmount}
              onChangeText={setLoanAmount}
              placeholder="e.g. 1000000"
              style={{
                borderWidth: 1.5,
                borderColor: "#EEF2F6",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                fontWeight: "700",
                color: "#1E1B4B",
                backgroundColor: "#F9FAFB",
              }}
            />
          </View>

          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#1E1B4B",
                marginBottom: 8,
              }}
            >
              Interest Rate (% Per Annum)
            </Text>
            <TextInput
              keyboardType="numeric"
              value={interestRate}
              onChangeText={setInterestRate}
              placeholder="e.g. 9.5"
              style={{
                borderWidth: 1.5,
                borderColor: "#EEF2F6",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                fontWeight: "700",
                color: "#1E1B4B",
                backgroundColor: "#F9FAFB",
              }}
            />
          </View>

          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#1E1B4B",
                marginBottom: 8,
              }}
            >
              Tenure (Years)
            </Text>
            <TextInput
              keyboardType="numeric"
              value={tenure}
              onChangeText={setTenure}
              placeholder="e.g. 5"
              style={{
                borderWidth: 1.5,
                borderColor: "#EEF2F6",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                fontWeight: "700",
                color: "#1E1B4B",
                backgroundColor: "#F9FAFB",
              }}
            />
          </View>
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
              Indian Lending Benchmark
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#4B5563",
                lineHeight: 18,
                fontWeight: "500",
              }}
            >
              {loanType === "home" &&
                "Home loans currently range between 8.35% - 9.50% (Max 30 years)."}
              {loanType === "vehicle" &&
                "New car loans range between 8.75% - 10.25%, used car loans 12.5% - 16% (Max 7 years)."}
              {loanType === "personal" &&
                "Unsecured personal & business loans range between 11.5% - 18% based on ITR & CIBIL score."}
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
