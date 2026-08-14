import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InventoryRepo } from "../../db/models/inventory/repository";
import { LeadRepo } from "../../db/models/leads/repository";
import {
  Lead,
  LeadPriorityType,
  LeadStatusType,
} from "../../db/models/leads/types";

const LEAD_STATUS_TABS = [
  "All",
  "NEW",
  "CONTACTED",
  "SITE_VISIT_SCHEDULED",
  "IN_NEGOTIATION",
  "CONVERTED",
  "LOST",
];

export default function LeadsScreen() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const loadLeads = useCallback(() => {
    const data = LeadRepo.getAll(selectedStatus, "All", searchQuery);
    setLeads(data);
  }, [selectedStatus, searchQuery]);

  useFocusEffect(
    useCallback(() => {
      loadLeads();
    }, [loadLeads]),
  );

  const getPriorityStyle = (priority: LeadPriorityType) => {
    switch (priority) {
      case "URGENT":
        return { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA" };
      case "HIGH":
        return { bg: "#FFFBEB", text: "#D97706", border: "#FDE68A" };
      case "MEDIUM":
        return { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" };
      default:
        return { bg: "#F8FAFC", text: "#64748B", border: "#E2E8F0" };
    }
  };

  const getStatusStyle = (status: LeadStatusType) => {
    switch (status) {
      case "CONVERTED":
        return { bg: "#ECFDF5", text: "#059669" };
      case "LOST":
        return { bg: "#FEF2F2", text: "#DC2626" };
      case "IN_NEGOTIATION":
        return { bg: "#FFFBEB", text: "#D97706" };
      case "SITE_VISIT_SCHEDULED":
      case "SITE_VISIT_COMPLETED":
        return { bg: "#EEF2FF", text: "#4F46E5" };
      default:
        return { bg: "#F1F5F9", text: "#475569" };
    }
  };

  const handleCall = (phone: string) => {
    if (phone) Linking.openURL(`tel:${phone}`);
  };

  const handleWhatsApp = (phone: string) => {
    if (phone) Linking.openURL(`https://wa.me/91${phone.replace(/\D/g, "")}`);
  };

  const renderLeadCard = ({ item }: { item: Lead }) => {
    const priorityStyle = getPriorityStyle(item.priority);
    const statusStyle = getStatusStyle(item.status);

    const linkedInventory = item.inventoryId
      ? InventoryRepo.getById(item.inventoryId)
      : null;

    const locationPreference = [
      item.preferredCityArea,
      item.preferredDistrict,
      item.preferredState,
    ]
      .filter(Boolean)
      .join(", ");

    const budgetDisplay =
      item.minBudget || item.maxBudget
        ? `₹${item.minBudget || "0"} - ₹${item.maxBudget || "Any"} ${item.budgetUnit || "Lakh"}`
        : null;

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/manage-lead" as any,
            params: { lead: JSON.stringify(item) },
          })
        }
      >
        <View style={styles.cardHeader}>
          <View style={styles.headerTitleGroup}>
            <Text style={styles.leadName}>{item.name}</Text>
            {item.occupationType || item.profession ? (
              <Text style={styles.leadSubText}>
                {[item.occupationType, item.profession]
                  .filter(Boolean)
                  .join(" • ")}
              </Text>
            ) : null}
          </View>

          <View style={styles.badgeColumn}>
            <View
              style={[
                styles.priorityBadge,
                {
                  backgroundColor: priorityStyle.bg,
                  borderColor: priorityStyle.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.priorityBadgeText,
                  { color: priorityStyle.text },
                ]}
              >
                {item.priority}
              </Text>
            </View>

            <View
              style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
            >
              <Text
                style={[styles.statusBadgeText, { color: statusStyle.text }]}
              >
                {item.status.replace(/_/g, " ")}
              </Text>
            </View>
          </View>
        </View>

        {linkedInventory ? (
          <View style={styles.linkedPropertyCard}>
            <Ionicons name="link-sharp" size={13} color="#4F46E5" />
            <Text style={styles.linkedPropertyText} numberOfLines={1}>
              {linkedInventory.title}
            </Text>
          </View>
        ) : null}

        <View style={styles.detailsRowGroup}>
          <View style={styles.detailPill}>
            <Ionicons name="folder-outline" size={13} color="#64748B" />
            <Text style={styles.detailPillText}>
              {item.subCategory || item.category}
            </Text>
          </View>

          {budgetDisplay ? (
            <View style={[styles.detailPill, styles.budgetPill]}>
              <Ionicons name="wallet-outline" size={13} color="#059669" />
              <Text style={[styles.detailPillText, styles.budgetText]}>
                {budgetDisplay}
              </Text>
            </View>
          ) : null}
        </View>

        {locationPreference ? (
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={14} color="#6366F1" />
            <Text style={styles.locationText} numberOfLines={1}>
              {locationPreference}
            </Text>
          </View>
        ) : null}

        {item.nextFollowUpDate ? (
          <View style={styles.followUpCard}>
            <Ionicons name="calendar-outline" size={13} color="#D97706" />
            <Text style={styles.followUpText}>
              Next Follow-up: {item.nextFollowUpDate}
            </Text>
          </View>
        ) : null}

        <View style={styles.cardFooter}>
          <View style={styles.quickContactGroup}>
            {item.phone ? (
              <>
                <TouchableOpacity
                  style={styles.contactIconBtn}
                  onPress={() => handleCall(item.phone)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="call-outline" size={15} color="#2563EB" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.contactIconBtn, styles.waBtn]}
                  onPress={() => handleWhatsApp(item.phone)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="logo-whatsapp" size={15} color="#16A34A" />
                </TouchableOpacity>
              </>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.editActionBtn}
            onPress={() =>
              router.push({
                pathname: "/manage-lead" as any,
                params: { lead: JSON.stringify(item) },
              })
            }
            activeOpacity={0.8}
          >
            <Feather name="edit-3" size={14} color="#4F46E5" />
            <Text style={styles.editActionBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Leads</Text>
          <Text style={styles.headerSubtitle}>
            {leads.length} {leads.length === 1 ? "lead" : "leads"} in pipeline
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/manage-lead" as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#818CF8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, phone, profession..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {LEAD_STATUS_TABS.map((st) => {
            const isSelected = selectedStatus === st;
            return (
              <Pressable
                key={st}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => setSelectedStatus(st)}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {st.replace(/_/g, " ")}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={leads}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLeadCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <MaterialCommunityIcons
                name="account-search-outline"
                size={42}
                color="#818CF8"
              />
            </View>
            <Text style={styles.emptyTitle}>No leads found</Text>
            <Text style={styles.emptyText}>
              Tap the + button to add a client enquiry
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "600",
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },
  filterWrapper: {
    marginTop: 14,
    marginBottom: 8,
  },
  filterContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  chipActive: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  chipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EEF2FF",
    gap: 12,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitleGroup: {
    flex: 1,
    marginRight: 10,
  },
  leadName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  leadSubText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 2,
  },
  badgeColumn: {
    alignItems: "flex-end",
    gap: 4,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  linkedPropertyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  linkedPropertyText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3730A3",
    flex: 1,
  },
  detailsRowGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  detailPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  budgetPill: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  detailPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  budgetText: {
    color: "#059669",
    fontWeight: "700",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    flex: 1,
  },
  followUpCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  followUpText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B45309",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
    marginTop: 2,
  },
  quickContactGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  contactIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  waBtn: {
    backgroundColor: "#DCFCE7",
  },
  editActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  editActionBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F46E5",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  emptyText: {
    marginTop: 4,
    fontSize: 13,
    color: "#94A3B8",
  },
});
