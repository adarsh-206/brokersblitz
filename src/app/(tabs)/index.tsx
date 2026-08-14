// app/(tabs)/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { db } from "../../db";
import { NotificationRepository } from "../../db/models/notifications/repository";

interface DashboardStats {
  totalEarnings: string;
  activeLeads: number;
  inventoryCount: number;
  closedDeals: number;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState<DashboardStats>({
    totalEarnings: "₹0",
    activeLeads: 0,
    inventoryCount: 0,
    closedDeals: 0,
  });
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [recentInventory, setRecentInventory] = useState<any[]>([]);

  const loadDashboardData = () => {
    try {
      NotificationRepository.checkAndGenerateDueFollowUps();
      setUnreadCount(NotificationRepository.getUnreadCount());

      const inventoryRes = db.getAllSync<{ count: number }>(
        "SELECT COUNT(*) as count FROM inventory",
      );
      const inventoryCount = inventoryRes[0]?.count || 0;

      const activeLeadsRes = db.getAllSync<{ count: number }>(
        "SELECT COUNT(*) as count FROM leads WHERE status NOT IN ('CONVERTED', 'LOST', 'CLOSED')",
      );
      const activeLeads = activeLeadsRes[0]?.count || 0;

      const closedRes = db.getAllSync<{ count: number }>(
        "SELECT COUNT(*) as count FROM leads WHERE status IN ('CONVERTED', 'CLOSED')",
      );
      const closedDeals = closedRes[0]?.count || 0;

      const closedEarningsRes = db.getAllSync<{
        commissionValue: string;
        commissionType: string;
        priceValue: string;
      }>(
        `SELECT i.commissionValue, i.commissionType, i.priceValue 
         FROM inventory i 
         INNER JOIN leads l ON l.inventoryId = i.id 
         WHERE l.status IN ('CONVERTED', 'CLOSED')`,
      );

      let totalEarned = 0;
      closedEarningsRes.forEach((item) => {
        const val = parseFloat(item.commissionValue) || 0;
        if (item.commissionType === "Percentage") {
          const price = parseFloat(item.priceValue) || 0;
          totalEarned += (price * val) / 100;
        } else {
          totalEarned += val;
        }
      });

      const formattedEarnings =
        totalEarned >= 100000
          ? `₹${(totalEarned / 100000).toFixed(1)}L`
          : totalEarned >= 1000
            ? `₹${(totalEarned / 1000).toFixed(1)}k`
            : `₹${totalEarned}`;

      setStats({
        totalEarnings: formattedEarnings,
        activeLeads,
        inventoryCount,
        closedDeals,
      });

      const upcomingFollowUps = db.getAllSync<any>(
        `SELECT * FROM leads 
         WHERE status NOT IN ('CONVERTED', 'LOST', 'CLOSED')
         ORDER BY id DESC 
         LIMIT 3`,
      );
      setFollowUps(upcomingFollowUps);

      const latestInventory = db.getAllSync<any>(
        `SELECT * FROM inventory 
         ORDER BY id DESC 
         LIMIT 3`,
      );
      setRecentInventory(latestInventory);
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
    setRefreshing(false);
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
      case "URGENT":
        return {
          bg: "rgba(239, 68, 68, 0.08)",
          text: "#EF4444",
          border: "rgba(239, 68, 68, 0.15)",
        };
      case "LOW":
        return {
          bg: "rgba(107, 114, 128, 0.08)",
          text: "#6B7280",
          border: "rgba(107, 114, 128, 0.15)",
        };
      default:
        return {
          bg: "rgba(245, 158, 11, 0.08)",
          text: "#F59E0B",
          border: "rgba(245, 158, 11, 0.15)",
        };
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F7F8FC" }}
      contentContainerStyle={{
        paddingTop: insets.top > 0 ? insets.top + 12 : 24,
        paddingHorizontal: 20,
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#5D45F9"
          colors={["#5D45F9"]}
        />
      }
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 24,
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
          onPress={() => router.push("/notifications" as any)}
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
          {unreadCount > 0 && (
            <View
              style={{
                position: "absolute",
                right: 12,
                top: 12,
                width: 8,
                height: 8,
                backgroundColor: "#EF4444",
                borderRadius: 4,
                borderWidth: 1.5,
                borderColor: "#FFFFFF",
              }}
            />
          )}
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <View
          style={{
            width: "48%",
            backgroundColor: "#FFFFFF",
            padding: 18,
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
              marginBottom: 14,
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
            Total Earnings
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: "#1E1B4B",
              marginTop: 4,
            }}
          >
            {stats.totalEarnings}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: "#22C55E",
              marginTop: 4,
            }}
          >
            ↑ Realized Brokerage
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/leads" as any)}
          style={{
            width: "48%",
            backgroundColor: "#FFFFFF",
            padding: 18,
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
              marginBottom: 14,
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
              marginTop: 4,
            }}
          >
            {stats.activeLeads}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: "#5D45F9",
              marginTop: 4,
            }}
          >
            In progress →
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/inventory" as any)}
          style={{
            width: "48%",
            backgroundColor: "#FFFFFF",
            padding: 18,
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
              marginBottom: 14,
            }}
          >
            <Ionicons name="business" size={18} color="#5D45F9" />
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
              marginTop: 4,
            }}
          >
            {stats.inventoryCount}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: "#22C55E",
              marginTop: 4,
            }}
          >
            Listed properties →
          </Text>
        </TouchableOpacity>

        <View
          style={{
            width: "48%",
            backgroundColor: "#FFFFFF",
            padding: 18,
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
              marginBottom: 14,
            }}
          >
            <Ionicons name="trophy" size={18} color="#5D45F9" />
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
            Closed Deals
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: "#1E1B4B",
              marginTop: 4,
            }}
          >
            {stats.closedDeals}
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: "#22C55E",
              marginTop: 4,
            }}
          >
            Completed
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#5D45F9",
          padding: 22,
          borderRadius: 24,
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
            Quick Actions
          </Text>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 20,
              fontWeight: "900",
              marginTop: 4,
              marginBottom: 16,
              lineHeight: 26,
            }}
          >
            Add New Record
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/manage-inventory" as any,
                })
              }
              style={{
                backgroundColor: "#FFFFFF",
                paddingVertical: 9,
                paddingHorizontal: 14,
                borderRadius: 12,
              }}
            >
              <Text
                style={{ color: "#5D45F9", fontWeight: "900", fontSize: 11 }}
              >
                + Inventory
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/manage-lead" as any,
                })
              }
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                paddingVertical: 9,
                paddingHorizontal: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.4)",
              }}
            >
              <Text
                style={{ color: "#FFFFFF", fontWeight: "900", fontSize: 11 }}
              >
                + Lead
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Ionicons
          name="rocket"
          size={84}
          color="rgba(255, 255, 255, 0.12)"
          style={{ position: "absolute", right: 6, bottom: -6 }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
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
          Recent Follow-ups
        </Text>
        <TouchableOpacity onPress={() => router.push("/leads" as any)}>
          <Text style={{ fontSize: 12, fontWeight: "900", color: "#5D45F9" }}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {followUps.length === 0 ? (
        <View
          style={{
            backgroundColor: "#FFFFFF",
            padding: 24,
            borderRadius: 20,
            alignItems: "center",
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "#F3F4F6",
          }}
        >
          <Ionicons name="calendar-outline" size={32} color="#9CA3AF" />
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#9CA3AF",
              marginTop: 8,
            }}
          >
            No upcoming follow-ups scheduled
          </Text>
        </View>
      ) : (
        followUps.map((item) => {
          const priority = getPriorityStyle(item.priority);
          return (
            <Pressable
              key={item.id}
              onPress={() =>
                router.push({
                  pathname: "/manage-lead" as any,
                  params: { lead: JSON.stringify(item) },
                })
              }
              style={{
                backgroundColor: "#FFFFFF",
                padding: 16,
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
                  width: 42,
                  height: 42,
                  backgroundColor: "rgba(93, 69, 249, 0.08)",
                  borderRadius: 21,
                  marginRight: 14,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="call" size={17} color="#5D45F9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: "900", color: "#1E1B4B" }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: "600",
                    color: "#9CA3AF",
                    marginTop: 2,
                  }}
                >
                  {item.subCategory || item.category || "General Requirement"} •{" "}
                  {item.phone}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: priority.bg,
                  paddingHorizontal: 9,
                  paddingVertical: 4,
                  borderRadius: 99,
                  borderWidth: 1,
                  borderColor: priority.border,
                }}
              >
                <Text
                  style={{
                    color: priority.text,
                    fontSize: 9,
                    fontWeight: "900",
                    letterSpacing: 0.5,
                  }}
                >
                  {item.priority || "NORMAL"}
                </Text>
              </View>
            </Pressable>
          );
        })
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
          marginBottom: 14,
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
          Recent Listings
        </Text>
        <TouchableOpacity onPress={() => router.push("/inventory" as any)}>
          <Text style={{ fontSize: 12, fontWeight: "900", color: "#5D45F9" }}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      {recentInventory.length === 0 ? (
        <View
          style={{
            backgroundColor: "#FFFFFF",
            padding: 24,
            borderRadius: 20,
            alignItems: "center",
            marginBottom: 12,
            borderWidth: 1,
            borderColor: "#F3F4F6",
          }}
        >
          <Ionicons name="home-outline" size={32} color="#9CA3AF" />
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#9CA3AF",
              marginTop: 8,
            }}
          >
            No properties added yet
          </Text>
        </View>
      ) : (
        recentInventory.map((item) => (
          <Pressable
            key={item.id}
            onPress={() =>
              router.push({
                pathname: "/manage-inventory" as any,
                params: { item: JSON.stringify(item) },
              })
            }
            style={{
              backgroundColor: "#FFFFFF",
              padding: 16,
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
                width: 42,
                height: 42,
                backgroundColor: "rgba(93, 69, 249, 0.08)",
                borderRadius: 14,
                marginRight: 14,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="business" size={18} color="#5D45F9" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 14, fontWeight: "900", color: "#1E1B4B" }}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: "#9CA3AF",
                  marginTop: 2,
                }}
              >
                {item.cityArea} • {item.subCategory || item.category}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "900",
                  color: "#5D45F9",
                }}
              >
                ₹{item.priceValue} {item.priceUnit}
              </Text>
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "800",
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                {item.purpose}
              </Text>
            </View>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}
