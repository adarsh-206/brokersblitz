// app/notifications.tsx
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NotificationRepository } from "../db/models/notifications/repository";
import {
  NotificationItem,
  NotificationType,
} from "../db/models/notifications/types";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<
    "ALL" | NotificationType
  >("ALL");

  const loadNotifications = () => {
    const data = NotificationRepository.getAll();
    setNotifications(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, []),
  );

  const handlePress = (item: NotificationItem) => {
    NotificationRepository.markAsRead(item.id);
    loadNotifications();

    if (item.entityData) {
      try {
        const parsed = JSON.parse(item.entityData);
        if (item.type === "FOLLOW_UP" || item.type === "LEAD") {
          router.push({
            pathname: "/manage-lead" as any,
            params: { lead: JSON.stringify(parsed) },
          });
        } else if (item.type === "INVENTORY") {
          router.push({
            pathname: "/manage-inventory" as any,
            params: { item: JSON.stringify(parsed) },
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleMarkAllRead = () => {
    NotificationRepository.markAllAsRead();
    loadNotifications();
  };

  const handleDelete = (id: number) => {
    NotificationRepository.delete(id);
    loadNotifications();
  };

  const filtered = notifications.filter((n) => {
    if (selectedFilter === "ALL") return true;
    return n.type === selectedFilter;
  });

  const getVisuals = (type: NotificationType) => {
    switch (type) {
      case "FOLLOW_UP":
        return {
          icon: "call-outline" as const,
          color: "#EF4444",
          bg: "rgba(239, 68, 68, 0.08)",
        };
      case "INVENTORY":
        return {
          icon: "cube-outline" as const,
          color: "#5D45F9",
          bg: "rgba(93, 69, 249, 0.08)",
        };
      case "LEAD":
        return {
          icon: "people-outline" as const,
          color: "#0EA5E9",
          bg: "rgba(14, 165, 233, 0.08)",
        };
      default:
        return {
          icon: "notifications-outline" as const,
          color: "#6B7280",
          bg: "rgba(107, 114, 128, 0.08)",
        };
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F7F8FC" }}>
      <View
        style={{
          paddingTop: insets.top > 0 ? insets.top + 8 : 20,
          paddingHorizontal: 20,
          paddingBottom: 16,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#F3F4F6",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#F7F8FC",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons name="chevron-back" size={20} color="#1E1B4B" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: "#1E1B4B",
              letterSpacing: -0.4,
            }}
          >
            Notifications
          </Text>
        </View>

        {notifications.some((n) => n.isRead === 0) && (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "800",
                color: "#5D45F9",
              }}
            >
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingVertical: 14,
          gap: 8,
        }}
      >
        {(
          [
            { label: "All", value: "ALL" },
            { label: "Follow-ups", value: "FOLLOW_UP" },
            { label: "Listings", value: "INVENTORY" },
            { label: "Leads", value: "LEAD" },
          ] as const
        ).map((filter) => {
          const isActive = selectedFilter === filter.value;
          return (
            <TouchableOpacity
              key={filter.value}
              onPress={() => setSelectedFilter(filter.value)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 14,
                backgroundColor: isActive ? "#5D45F9" : "#FFFFFF",
                borderWidth: 1,
                borderColor: isActive ? "#5D45F9" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "800",
                  color: isActive ? "#FFFFFF" : "#6B7280",
                }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}
      >
        {filtered.length === 0 ? (
          <View
            style={{
              backgroundColor: "#FFFFFF",
              padding: 40,
              borderRadius: 24,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              borderWidth: 1,
              borderColor: "#F3F4F6",
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: "rgba(93, 69, 249, 0.08)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons
                name="notifications-off-outline"
                size={28}
                color="#5D45F9"
              />
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "900",
                color: "#1E1B4B",
                marginBottom: 4,
              }}
            >
              No Notifications
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: "#9CA3AF",
                textAlign: "center",
              }}
            >
              You're completely caught up!
            </Text>
          </View>
        ) : (
          filtered.map((item) => {
            const visual = getVisuals(item.type);
            return (
              <Pressable
                key={item.id}
                onPress={() => handlePress(item)}
                style={{
                  backgroundColor: item.isRead === 0 ? "#FFFFFF" : "#F9FAFB",
                  padding: 16,
                  borderRadius: 20,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: item.isRead === 0 ? "#E5E7EB" : "#F3F4F6",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  elevation: item.isRead === 0 ? 2 : 0,
                  shadowColor: "#000000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: item.isRead === 0 ? 0.04 : 0,
                  shadowRadius: 6,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: visual.bg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                  }}
                >
                  <Ionicons name={visual.icon} size={20} color={visual.color} />
                </View>

                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: item.isRead === 0 ? "900" : "700",
                        color: "#1E1B4B",
                        flex: 1,
                        marginRight: 8,
                      }}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "700",
                        color: "#9CA3AF",
                      }}
                    >
                      {item.createdAt ? item.createdAt.split(" ")[0] : ""}
                    </Text>
                  </View>

                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "500",
                      color: item.isRead === 0 ? "#4B5563" : "#9CA3AF",
                      lineHeight: 18,
                    }}
                  >
                    {item.body}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={{ padding: 4, marginLeft: 4 }}
                >
                  <Ionicons name="close" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
