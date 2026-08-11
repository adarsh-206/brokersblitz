import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
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
import {
  CategoryType,
  InsuranceDetails,
  InventoryItem,
  LoanDetails,
  RealEstateDetails,
  VehicleDetails,
} from "../../db/models/inventory/types";

const CATEGORIES: ("All" | CategoryType)[] = [
  "All",
  "Real Estate",
  "Vehicle",
  "Loan",
  "Insurance",
];

export default function InventoryScreen() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(() => {
    const data = InventoryRepo.getAll(selectedCategory, searchQuery);
    setItems(data);
  }, [selectedCategory, searchQuery]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const formatPrice = (value: string, unit: string) => {
    if (!value) return "₹0";
    return `₹${value} ${unit}${unit === "Crore" ? "s" : ""}`;
  };

  const formatCommission = (val: string, type: string) => {
    if (!val) return null;
    if (type === "Percentage") return `${val}% Brokerage`;
    if (type === "Per Sq Ft") return `₹${val}/sq.ft`;
    return `₹${val} Flat`;
  };

  const getStatusColors = (status: InventoryItem["status"]) => {
    switch (status) {
      case "AVAILABLE":
        return { bg: "#ECFDF5", text: "#059669", border: "#A7F3D0" };
      case "BOOKED":
        return { bg: "#FFFBEB", text: "#D97706", border: "#FDE68A" };
      case "SOLD":
        return { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA" };
      case "UPCOMING":
        return { bg: "#EFF6FF", text: "#2563EB", border: "#BFDBFE" };
      default:
        return { bg: "#F8FAFC", text: "#64748B", border: "#E2E8F0" };
    }
  };

  const getCategoryIcon = (
    category: string,
  ): keyof typeof Ionicons.glyphMap => {
    switch (category) {
      case "Real Estate":
        return "business";
      case "Vehicle":
        return "car-sport";
      case "Loan":
        return "cash";
      case "Insurance":
        return "shield-checkmark";
      default:
        return "briefcase";
    }
  };

  const categorySpecificDetails = (item: InventoryItem) => {
    let parsed: any = {};
    try {
      parsed =
        typeof item.details === "string"
          ? JSON.parse(item.details)
          : item.details || {};
    } catch {
      parsed = {};
    }

    if (item.category === "Real Estate") {
      const re = parsed as RealEstateDetails;
      const tags = [
        re.bhk,
        re.furnishingStatus,
        re.facing ? `${re.facing} Facing` : null,
        re.carpetAreaSqFt ? `${re.carpetAreaSqFt} sq.ft` : null,
      ].filter(Boolean);

      if (!tags.length) return null;

      return (
        <View style={styles.specTagsRow}>
          {tags.slice(0, 3).map((tag, idx) => (
            <View key={idx} style={styles.specTagPill}>
              <Text style={styles.specTagText}>{tag}</Text>
            </View>
          ))}
        </View>
      );
    }

    if (item.category === "Vehicle") {
      const veh = parsed as VehicleDetails;
      const tags = [
        veh.brand,
        veh.modelName,
        veh.fuelType,
        veh.yearOfRegistration,
      ].filter(Boolean);

      if (!tags.length) return null;

      return (
        <View style={styles.specTagsRow}>
          {tags.slice(0, 3).map((tag, idx) => (
            <View key={idx} style={styles.specTagPill}>
              <Text style={styles.specTagText}>{tag}</Text>
            </View>
          ))}
        </View>
      );
    }

    if (item.category === "Loan") {
      const loan = parsed as LoanDetails;
      const bank = loan.partnerBankName;
      const rate = loan.minInterestRatePercentage
        ? `${loan.minInterestRatePercentage}% Rate`
        : null;

      if (!bank && !rate) return null;

      return (
        <View style={styles.specTagsRow}>
          {bank && (
            <View style={styles.specTagPill}>
              <Text style={styles.specTagText}>{bank}</Text>
            </View>
          )}
          {rate && (
            <View style={styles.specTagPill}>
              <Text style={styles.specTagText}>{rate}</Text>
            </View>
          )}
        </View>
      );
    }

    if (item.category === "Insurance") {
      const ins = parsed as InsuranceDetails;
      const provider = ins.insuranceProviderCompany;
      const sum = ins.sumInsuredValue
        ? `Cover: ₹${ins.sumInsuredValue} ${ins.sumInsuredUnit || "Lakh"}`
        : null;

      if (!provider && !sum) return null;

      return (
        <View style={styles.specTagsRow}>
          {provider && (
            <View style={styles.specTagPill}>
              <Text style={styles.specTagText}>{provider}</Text>
            </View>
          )}
          {sum && (
            <View style={styles.specTagPill}>
              <Text style={styles.specTagText}>{sum}</Text>
            </View>
          )}
        </View>
      );
    }

    return null;
  };

  const renderCard = ({ item }: { item: InventoryItem }) => {
    const statusStyle = getStatusColors(item.status);
    const commTag = formatCommission(item.commissionValue, item.commissionType);

    const locationText = [item.cityArea, item.district, item.state]
      .filter(Boolean)
      .join(", ");

    return (
      <Pressable
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/manage-inventory",
            params: { item: JSON.stringify(item) },
          })
        }
      >
        <View style={styles.cardTopBar}>
          <View style={styles.badgeGroup}>
            <View style={styles.categoryBadge}>
              <Ionicons
                name={getCategoryIcon(item.category)}
                size={13}
                color="#4F46E5"
              />
              <Text style={styles.categoryBadgeText}>
                {item.subCategory || item.category}
              </Text>
            </View>

            <View
              style={[
                styles.purposeBadge,
                item.purpose === "Rent" && styles.purposeBadgeRent,
              ]}
            >
              <Text
                style={[
                  styles.purposeBadgeText,
                  item.purpose === "Rent" && styles.purposeBadgeTextRent,
                ]}
              >
                {item.purpose === "Other" && item.customPurpose
                  ? item.customPurpose
                  : item.purpose || "Sell"}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusStyle.bg,
                borderColor: statusStyle.border,
              },
            ]}
          >
            <View
              style={[styles.statusDot, { backgroundColor: statusStyle.text }]}
            />
            <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.heroPriceCard}>
          <View>
            <Text style={styles.priceMetaLabel}>Asking Price</Text>
            <Text style={styles.priceValue}>
              {formatPrice(item.priceValue, item.priceUnit)}
            </Text>
          </View>

          {commTag ? (
            <View style={styles.commTagBadge}>
              <Ionicons name="flash" size={11} color="#059669" />
              <Text style={styles.commTagText}>{commTag}</Text>
            </View>
          ) : null}
        </View>

        {categorySpecificDetails(item)}

        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={14} color="#6366F1" />
          <Text style={styles.locationText} numberOfLines={1}>
            {locationText}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.ownerBlock}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.ownerAvatarText}>
                {item.ownerName ? item.ownerName.charAt(0).toUpperCase() : "O"}
              </Text>
            </View>
            <View style={styles.ownerDetails}>
              <Text style={styles.ownerName} numberOfLines={1}>
                {item.ownerName}
              </Text>
              {item.ownerPhone ? (
                <Text style={styles.ownerPhone} numberOfLines={1}>
                  {item.ownerPhone}
                </Text>
              ) : null}
            </View>
          </View>

          <TouchableOpacity
            style={styles.actionIconButton}
            onPress={() =>
              router.push({
                pathname: "/manage-inventory",
                params: { item: JSON.stringify(item) },
              })
            }
            activeOpacity={0.8}
          >
            <Feather name="edit-3" size={15} color="#4F46E5" />
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Inventory</Text>
          <Text style={styles.headerSubtitle}>
            {items.length} {items.length === 1 ? "listing" : "listings"} tracked
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/manage-inventory")}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#818CF8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search listings, locations, contacts..."
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
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <MaterialCommunityIcons
                name="text-box-search-outline"
                size={42}
                color="#818CF8"
              />
            </View>
            <Text style={styles.emptyTitle}>No listings found</Text>
            <Text style={styles.emptyText}>
              Tap the + button to create a new entry
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
    fontSize: 13,
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
    gap: 18,
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
  cardTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgeGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4F46E5",
  },
  purposeBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  purposeBadgeRent: {
    backgroundColor: "#FFFBEB",
  },
  purposeBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  purposeBadgeTextRent: {
    color: "#D97706",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  heroPriceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
  },
  priceMetaLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#6366F1",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3730A3",
    letterSpacing: -0.3,
  },
  commTagBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  commTagText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
  },
  specTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  specTagPill: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  specTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
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
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 12,
    marginTop: 2,
  },
  ownerBlock: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  ownerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  ownerAvatarText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },
  ownerPhone: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
    marginTop: 1,
  },
  actionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
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
