import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F7F8FC" }}
      contentContainerStyle={{
        paddingTop: insets.top > 0 ? insets.top + 12 : 24,
        paddingHorizontal: 20,
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 28,
        }}
      >
        <View>
          <Text style={{ fontSize: 13, fontWeight: "500", color: "#9CA3AF" }}>
            Welcome back,
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "900",
              color: "#1E1B4B",
              marginTop: 2,
              letterSpacing: -0.5,
            }}
          >
            Broker Partner
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: 44,
            height: 44,
            backgroundColor: "#FFFFFF",
            borderRadius: 22,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Ionicons name="notifications-outline" size={20} color="#1E1B4B" />
          <View
            style={{
              position: "absolute",
              right: 14,
              top: 14,
              width: 7,
              height: 7,
              backgroundColor: "#EF4444",
              borderRadius: 3.5,
            }}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <View
          style={{
            width: "48%",
            backgroundColor: "#FFFFFF",
            padding: 20,
            borderRadius: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#F3F4F6",
            elevation: 2,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 6,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              backgroundColor: "rgba(93, 69, 249, 0.08)",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="wallet" size={18} color="#5D45F9" />
          </View>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "800",
              color: "#9CA3AF",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Total Revenue
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: "#1E1B4B",
              marginTop: 6,
            }}
          >
            ₹4.8L
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: "#22C55E",
              marginTop: 4,
            }}
          >
            ↑ +12%
          </Text>
        </View>

        <View
          style={{
            width: "48%",
            backgroundColor: "#FFFFFF",
            padding: 20,
            borderRadius: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#F3F4F6",
            elevation: 2,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 6,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              backgroundColor: "rgba(93, 69, 249, 0.08)",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="people" size={18} color="#5D45F9" />
          </View>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "800",
              color: "#9CA3AF",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Active Leads
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: "#1E1B4B",
              marginTop: 6,
            }}
          >
            24
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: "#22C55E",
              marginTop: 4,
            }}
          >
            ↑ +4
          </Text>
        </View>

        <View
          style={{
            width: "48%",
            backgroundColor: "#FFFFFF",
            padding: 20,
            borderRadius: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#F3F4F6",
            elevation: 2,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 6,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              backgroundColor: "rgba(93, 69, 249, 0.08)",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="cube" size={18} color="#5D45F9" />
          </View>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "800",
              color: "#9CA3AF",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Inventory
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: "#1E1B4B",
              marginTop: 6,
            }}
          >
            112
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: "#EF4444",
              marginTop: 4,
            }}
          >
            ↓ -2
          </Text>
        </View>

        <View
          style={{
            width: "48%",
            backgroundColor: "#FFFFFF",
            padding: 20,
            borderRadius: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#F3F4F6",
            elevation: 2,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 6,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              backgroundColor: "rgba(93, 69, 249, 0.08)",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="stats-chart" size={18} color="#5D45F9" />
          </View>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "800",
              color: "#9CA3AF",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Conversion
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: "#1E1B4B",
              marginTop: 6,
            }}
          >
            18%
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: "#22C55E",
              marginTop: 4,
            }}
          >
            ↑ +2%
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#5D45F9",
          padding: 24,
          borderRadius: 28,
          marginBottom: 28,
          position: "relative",
          overflow: "hidden",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          elevation: 6,
          shadowColor: "#5D45F9",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
        }}
      >
        <View style={{ zIndex: 10, flex: 1, paddingRight: 16 }}>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 9,
              fontWeight: "800",
              letterSpacing: 1.5,
              opacity: 0.75,
              textTransform: "uppercase",
            }}
          >
            Ready to Close?
          </Text>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 22,
              fontWeight: "900",
              marginTop: 4,
              marginBottom: 18,
              lineHeight: 28,
            }}
          >
            Create New Listing
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#FFFFFF",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 12,
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ color: "#5D45F9", fontWeight: "900", fontSize: 12 }}>
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
        <Ionicons
          name="rocket"
          size={90}
          color="rgba(255, 255, 255, 0.12)"
          style={{ position: "absolute", right: 8, bottom: -8 }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "900",
            color: "#1E1B4B",
            letterSpacing: -0.3,
          }}
        >
          Today's Agenda
        </Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 12, fontWeight: "900", color: "#5D45F9" }}>
            View Calendar
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: "#FFFFFF",
          padding: 18,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#F3F4F6",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
          elevation: 2,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.03,
          shadowRadius: 6,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            backgroundColor: "rgba(93, 69, 249, 0.08)",
            borderRadius: 22,
            marginRight: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="call" size={18} color="#5D45F9" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: "900", color: "#1E1B4B" }}>
            Follow up with Rahul Sharma
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "600",
              color: "#9CA3AF",
              marginTop: 2,
            }}
          >
            10:30 AM • Call
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 99,
            borderWidth: 1,
            borderColor: "rgba(239, 68, 68, 0.15)",
          }}
        >
          <Text
            style={{
              color: "#EF4444",
              fontSize: 9,
              fontWeight: "900",
              letterSpacing: 0.5,
            }}
          >
            URGENT
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
