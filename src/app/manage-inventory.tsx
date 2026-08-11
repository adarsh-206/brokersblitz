import { Ionicons } from "@expo/vector-icons";
import { City, State } from "country-state-city";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAlertModal from "../components/CustomAlertModal";
import { InventoryRepo } from "../db/models/inventory/repository";
import {
  CategoryDetails,
  CategoryType,
  CommissionType,
  InsuranceDetails,
  InventoryItem,
  LoanDetails,
  PriceUnitType,
  PurposeType,
  RealEstateDetails,
  StatusType,
  SubCategoryType,
  VehicleDetails,
} from "../db/models/inventory/types";

interface LocationItem {
  name: string;
  code?: string;
}

const ALL_INDIAN_STATES: LocationItem[] = State.getStatesOfCountry("IN").map(
  (s) => ({
    name: s.name,
    code: s.isoCode,
  }),
);

const fetchDistrictsForState = (stateCode?: string): string[] => {
  if (!stateCode) return [];
  return City.getCitiesOfState("IN", stateCode).map((c) => c.name);
};

const CATEGORIES: {
  label: CategoryType;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { label: "Real Estate", icon: "business-outline" },
  { label: "Vehicle", icon: "car-sport-outline" },
  { label: "Loan", icon: "cash-outline" },
  { label: "Insurance", icon: "shield-checkmark-outline" },
];

const PURPOSES: Record<CategoryType, PurposeType[]> = {
  "Real Estate": ["Sell", "Rent", "Lease", "PG / Co-Living", "Other"],
  Vehicle: ["Sell", "Rent", "Lease", "Other"],
  Loan: ["Sell", "Other"],
  Insurance: ["Sell", "Other"],
};

const SUB_CATEGORIES: Record<CategoryType, SubCategoryType[]> = {
  "Real Estate": [
    "Flat / Apartment",
    "Independent House / Villa",
    "Plot / Land",
    "Commercial Shop / Office",
    "Agricultural / Farmland",
    "Warehouse / Godown",
    "Industrial Shed",
    "PG / Hostel Room",
    "Other",
  ],
  Vehicle: [
    "Car",
    "Two Wheeler",
    "Commercial Truck / Bus",
    "Auto / E-Rickshaw",
    "Tractor / Farm Machinery",
    "Construction Equipment",
    "Other",
  ],
  Loan: [
    "Home Loan",
    "Personal Loan",
    "Business / MSME Loan",
    "Vehicle Loan",
    "Loan Against Property (LAP)",
    "Gold Loan",
    "Education Loan",
    "Other",
  ],
  Insurance: [
    "Health / Mediclaim Insurance",
    "Motor Insurance",
    "Term / Life Insurance",
    "Property / Shop Insurance",
    "Crop Insurance",
    "Other",
  ],
};

const STATUSES: { label: StatusType; activeBg: string; activeColor: string }[] =
  [
    { label: "AVAILABLE", activeBg: "#ECFDF5", activeColor: "#059669" },
    { label: "BOOKED", activeBg: "#FFFBEB", activeColor: "#D97706" },
    { label: "SOLD", activeBg: "#FEF2F2", activeColor: "#DC2626" },
    { label: "UPCOMING", activeBg: "#EFF6FF", activeColor: "#2563EB" },
  ];

const PRICE_UNITS: PriceUnitType[] = ["Thousand", "Lakh", "Crore"];
const COMMISSION_TYPES: CommissionType[] = [
  "Percentage",
  "Flat Rate",
  "Per Sq Ft",
];

const FACING_OPTIONS = [
  "East",
  "West",
  "North",
  "South",
  "North-East",
  "North-West",
  "South-East",
  "South-West",
  "Other",
];

const BHK_OPTIONS = [
  "1 RK",
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK",
  "5+ BHK",
  "Studio",
  "Other",
];

const FURNISHING_OPTIONS = [
  "Fully Furnished",
  "Semi Furnished",
  "Unfurnished",
  "Other",
];

const KHATA_OPTIONS = [
  "A Khata",
  "B Khata",
  "E Khata",
  "Gram Panchayat",
  "Freehold",
  "Leasehold",
  "Other",
];

const PLC_REASONS = [
  "Park / Garden Facing",
  "Main Road Facing",
  "Corner Plot",
  "Sun / East Facing",
  "Pool Facing",
  "Other",
];

const AMENITIES_LIST = [
  "Lift",
  "Security Guard",
  "Power Backup",
  "Car Parking",
  "Gym",
  "Swimming Pool",
  "Clubhouse",
  "Children Play Area",
  "Park / Garden",
  "Temple",
  "EV Charging Point",
  "Intercom",
  "CCTV",
];

const FUEL_OPTIONS = ["Petrol", "Diesel", "CNG", "EV", "Hybrid", "Other"];
const TRANSMISSION_OPTIONS = ["Manual", "Automatic", "Other"];
const OWNERSHIP_OPTIONS = [
  "1st Owner",
  "2nd Owner",
  "3rd Owner",
  "4th+ Owner",
  "Other",
];
const VEHICLE_INSURANCE_OPTIONS = [
  "Third Party",
  "Comprehensive",
  "Zero Dep",
  "Expired",
  "Other",
];

export default function ManageInventoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const existingItem: InventoryItem | null = params.item
    ? JSON.parse(params.item as string)
    : null;

  const parsedExistingDetails: CategoryDetails = useMemo(() => {
    if (!existingItem?.details) return {};
    try {
      return typeof existingItem.details === "string"
        ? JSON.parse(existingItem.details)
        : existingItem.details;
    } catch {
      return { legacyNote: existingItem.details };
    }
  }, [existingItem?.details]);

  const [title, setTitle] = useState(existingItem?.title || "");
  const [category, setCategory] = useState<CategoryType>(
    existingItem?.category || "Real Estate",
  );
  const [purpose, setPurpose] = useState<PurposeType>(
    existingItem?.purpose || "Sell",
  );
  const [customPurpose, setCustomPurpose] = useState(
    existingItem?.customPurpose || "",
  );

  const [subCategory, setSubCategory] = useState<SubCategoryType>(
    existingItem?.subCategory || "Flat / Apartment",
  );
  const [customSubCategory, setCustomSubCategory] = useState(
    existingItem?.customSubCategory || "",
  );

  const [priceValue, setPriceValue] = useState(existingItem?.priceValue || "");
  const [priceUnit, setPriceUnit] = useState<PriceUnitType>(
    existingItem?.priceUnit || "Lakh",
  );
  const [status, setStatus] = useState<StatusType>(
    existingItem?.status || "AVAILABLE",
  );

  const initialSelectedState = ALL_INDIAN_STATES.find(
    (s) =>
      s.name.toLowerCase() ===
      (existingItem?.state || "maharashtra").toLowerCase(),
  );

  const [selectedState, setSelectedState] = useState<LocationItem | null>(
    initialSelectedState || ALL_INDIAN_STATES[0] || null,
  );
  const [district, setDistrict] = useState(existingItem?.district || "");
  const [cityArea, setCityArea] = useState(existingItem?.cityArea || "");

  const [ownerName, setOwnerName] = useState(existingItem?.ownerName || "");
  const [ownerPhone, setOwnerPhone] = useState(existingItem?.ownerPhone || "");

  const [commissionValue, setCommissionValue] = useState(
    existingItem?.commissionValue || "",
  );
  const [commissionType, setCommissionType] = useState<CommissionType>(
    existingItem?.commissionType || "Percentage",
  );

  const [reDetails, setReDetails] = useState<RealEstateDetails>(
    existingItem?.category === "Real Estate" ? parsedExistingDetails : {},
  );
  const [vehDetails, setVehDetails] = useState<VehicleDetails>(
    existingItem?.category === "Vehicle" ? parsedExistingDetails : {},
  );
  const [loanDetails, setLoanDetails] = useState<LoanDetails>(
    existingItem?.category === "Loan" ? parsedExistingDetails : {},
  );
  const [insDetails, setInsDetails] = useState<InsuranceDetails>(
    existingItem?.category === "Insurance" ? parsedExistingDetails : {},
  );

  const [pickerModal, setPickerModal] = useState<{
    visible: boolean;
    type: "state" | "district";
  }>({ visible: false, type: "state" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const availableDistricts = useMemo(() => {
    return fetchDistrictsForState(selectedState?.code);
  }, [selectedState?.code]);

  const handleCategoryChange = (newCategory: CategoryType) => {
    setCategory(newCategory);
    const availablePurposes = PURPOSES[newCategory];
    const availableSubCats = SUB_CATEGORIES[newCategory];

    setPurpose(availablePurposes[0]);
    setCustomPurpose("");
    setSubCategory(availableSubCats[0]);
    setCustomSubCategory("");
  };

  const handleSelectState = (item: LocationItem) => {
    setSelectedState(item);
    setDistrict("");
    setPickerModal({ visible: false, type: "state" });
    setSearchQuery("");
  };

  const handleSelectDistrict = (districtName: string) => {
    setDistrict(districtName);
    setPickerModal({ visible: false, type: "district" });
    setSearchQuery("");
  };

  const filteredPickerItems = useMemo(() => {
    if (pickerModal.type === "state") {
      if (!searchQuery.trim()) return ALL_INDIAN_STATES.map((s) => s.name);
      return ALL_INDIAN_STATES.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ).map((s) => s.name);
    } else {
      if (!searchQuery.trim()) return availableDistricts;
      return availableDistricts.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
  }, [pickerModal.type, searchQuery, availableDistricts]);

  const toggleAmenity = (amenity: string) => {
    const current = reDetails.amenities || [];
    if (current.includes(amenity)) {
      setReDetails({
        ...reDetails,
        amenities: current.filter((a) => a !== amenity),
      });
    } else {
      setReDetails({
        ...reDetails,
        amenities: [...current, amenity],
      });
    }
  };

  const navigateToInventory = () => {
    setShowSuccessModal(false);
    router.replace("/(tabs)/inventory" as any);
  };

  const handleSave = () => {
    if (
      !title ||
      !priceValue ||
      !selectedState?.name ||
      !district ||
      !ownerName
    ) {
      Alert.alert(
        "Required Fields Missing",
        "Please fill all mandatory fields before saving.",
      );
      return;
    }

    let finalDetailsObj: CategoryDetails = {};
    if (category === "Real Estate") finalDetailsObj = reDetails;
    else if (category === "Vehicle") finalDetailsObj = vehDetails;
    else if (category === "Loan") finalDetailsObj = loanDetails;
    else if (category === "Insurance") finalDetailsObj = insDetails;

    const payload = {
      title,
      category,
      purpose,
      customPurpose: purpose === "Other" ? customPurpose : "",
      subCategory,
      customSubCategory: subCategory === "Other" ? customSubCategory : "",
      priceValue,
      priceUnit,
      status,
      state: selectedState.name,
      district,
      cityArea,
      details: JSON.stringify(finalDetailsObj),
      ownerName,
      ownerPhone,
      commissionValue,
      commissionType,
    };

    if (existingItem) {
      InventoryRepo.update({ id: existingItem.id, ...payload });
    } else {
      InventoryRepo.insert(payload);
    }

    setShowSuccessModal(true);

    setTimeout(() => {
      navigateToInventory();
    }, 1800);
  };

  const handleDelete = () => {
    if (!existingItem) return;
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing permanently?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            InventoryRepo.delete(existingItem.id);
            router.back();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {existingItem ? "Edit Your Listing" : "Add Your Listing"}
        </Text>
        {existingItem ? (
          <TouchableOpacity
            style={[styles.iconBtn, styles.deleteBtn]}
            onPress={handleDelete}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color="#EF4444" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.form}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.groupBlock}>
          <Text style={styles.groupTitle}>CATEGORY & INTENT</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sliderContent}
            >
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.label;
                return (
                  <TouchableOpacity
                    key={cat.label}
                    style={[
                      styles.sliderCard,
                      isSelected && styles.sliderCardSelected,
                    ]}
                    onPress={() => handleCategoryChange(cat.label)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={18}
                      color={isSelected ? "#FFFFFF" : "#64748B"}
                    />
                    <Text
                      style={[
                        styles.sliderCardLabel,
                        isSelected && styles.sliderCardLabelSelected,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Purpose / Action</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRowContent}
            >
              {PURPOSES[category].map((p) => {
                const isSelected = purpose === p;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.chipPill,
                      isSelected && styles.chipPillSelected,
                    ]}
                    onPress={() => setPurpose(p)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.chipPillText,
                        isSelected && styles.chipPillTextSelected,
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            {purpose === "Other" && (
              <TextInput
                style={[styles.input, { marginTop: 12 }]}
                placeholder="Specify purpose (e.g. Lease-cum-Sale)"
                placeholderTextColor="#94A3B8"
                value={customPurpose}
                onChangeText={setCustomPurpose}
              />
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Sub Category / Type</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRowContent}
            >
              {SUB_CATEGORIES[category].map((sub) => {
                const isSelected = subCategory === sub;
                return (
                  <TouchableOpacity
                    key={sub}
                    style={[
                      styles.chipPill,
                      isSelected && styles.chipPillSelected,
                    ]}
                    onPress={() => setSubCategory(sub)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.chipPillText,
                        isSelected && styles.chipPillTextSelected,
                      ]}
                    >
                      {sub}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            {subCategory === "Other" && (
              <TextInput
                style={[styles.input, { marginTop: 12 }]}
                placeholder="Specify sub category"
                placeholderTextColor="#94A3B8"
                value={customSubCategory}
                onChangeText={setCustomSubCategory}
              />
            )}
          </View>
        </View>

        <View style={styles.groupBlock}>
          <Text style={styles.groupTitle}>OVERVIEW & PRICING</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 3 BHK Luxury Apartment in FC Road"
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Status *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRowContent}
            >
              {STATUSES.map((st) => {
                const isSelected = status === st.label;
                return (
                  <TouchableOpacity
                    key={st.label}
                    style={[
                      styles.statusPill,
                      isSelected && {
                        backgroundColor: st.activeBg,
                        borderColor: st.activeColor,
                      },
                    ]}
                    onPress={() => setStatus(st.label)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        isSelected && {
                          color: st.activeColor,
                          fontWeight: "700",
                        },
                      ]}
                    >
                      {st.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Asking Price / Rent *</Text>
            <View style={styles.segmentBar}>
              {PRICE_UNITS.map((u) => {
                const isSelected = priceUnit === u;
                return (
                  <TouchableOpacity
                    key={u}
                    style={[
                      styles.segmentTab,
                      isSelected && styles.segmentTabSelected,
                    ]}
                    onPress={() => setPriceUnit(u)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.segmentTabText,
                        isSelected && styles.segmentTabTextSelected,
                      ]}
                    >
                      {u}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.inputWithAddon}>
              <Text style={styles.inputAddonText}>₹</Text>
              <TextInput
                style={styles.inputBare}
                placeholder="Enter price value"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={priceValue}
                onChangeText={setPriceValue}
              />
              {priceValue.length > 0 && (
                <Text style={styles.priceUnitBadge}>{priceUnit}</Text>
              )}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Commission / Brokerage</Text>
            <View style={styles.segmentBar}>
              {COMMISSION_TYPES.map((ct) => {
                const isSelected = commissionType === ct;
                return (
                  <TouchableOpacity
                    key={ct}
                    style={[
                      styles.segmentTab,
                      isSelected && styles.segmentTabSelected,
                    ]}
                    onPress={() => setCommissionType(ct)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.segmentTabText,
                        isSelected && styles.segmentTabTextSelected,
                      ]}
                    >
                      {ct}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2 or 50000"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={commissionValue}
              onChangeText={setCommissionValue}
            />
          </View>
        </View>

        {category === "Real Estate" && (
          <View style={styles.groupBlock}>
            <Text style={styles.groupTitle}>PROPERTY DETAILS</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Facing</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRowContent}
              >
                {FACING_OPTIONS.map((f) => {
                  const isSelected = reDetails.facing === f;
                  return (
                    <TouchableOpacity
                      key={f}
                      style={[
                        styles.chipPill,
                        isSelected && styles.chipPillSelected,
                      ]}
                      onPress={() =>
                        setReDetails({
                          ...reDetails,
                          facing: f as RealEstateDetails["facing"],
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipPillText,
                          isSelected && styles.chipPillTextSelected,
                        ]}
                      >
                        {f}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {reDetails.facing === "Other" && (
                <TextInput
                  style={[styles.input, { marginTop: 12 }]}
                  placeholder="Specify Facing direction"
                  placeholderTextColor="#94A3B8"
                  value={reDetails.customFacing || ""}
                  onChangeText={(txt) =>
                    setReDetails({ ...reDetails, customFacing: txt })
                  }
                />
              )}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>BHK Configuration</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRowContent}
              >
                {BHK_OPTIONS.map((b) => {
                  const isSelected = reDetails.bhk === b;
                  return (
                    <TouchableOpacity
                      key={b}
                      style={[
                        styles.chipPill,
                        isSelected && styles.chipPillSelected,
                      ]}
                      onPress={() =>
                        setReDetails({
                          ...reDetails,
                          bhk: b as RealEstateDetails["bhk"],
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipPillText,
                          isSelected && styles.chipPillTextSelected,
                        ]}
                      >
                        {b}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Furnishing Status</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRowContent}
              >
                {FURNISHING_OPTIONS.map((fn) => {
                  const isSelected = reDetails.furnishingStatus === fn;
                  return (
                    <TouchableOpacity
                      key={fn}
                      style={[
                        styles.chipPill,
                        isSelected && styles.chipPillSelected,
                      ]}
                      onPress={() =>
                        setReDetails({
                          ...reDetails,
                          furnishingStatus:
                            fn as RealEstateDetails["furnishingStatus"],
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipPillText,
                          isSelected && styles.chipPillTextSelected,
                        ]}
                      >
                        {fn}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.rowTwoFields}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Carpet Area (Sq Ft)</Text>
                <TextInput
                  style={styles.inputInline}
                  placeholder="e.g. 850"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={reDetails.carpetAreaSqFt || ""}
                  onChangeText={(txt) =>
                    setReDetails({ ...reDetails, carpetAreaSqFt: txt })
                  }
                />
              </View>

              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Super Built-up (Sq Ft)</Text>
                <TextInput
                  style={styles.inputInline}
                  placeholder="e.g. 1150"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={reDetails.superBuiltUpAreaSqFt || ""}
                  onChangeText={(txt) =>
                    setReDetails({ ...reDetails, superBuiltUpAreaSqFt: txt })
                  }
                />
              </View>
            </View>

            <View style={styles.rowTwoFields}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Floor No.</Text>
                <TextInput
                  style={styles.inputInline}
                  placeholder="e.g. 5"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={reDetails.floorNumber || ""}
                  onChangeText={(txt) =>
                    setReDetails({ ...reDetails, floorNumber: txt })
                  }
                />
              </View>

              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Total Floors</Text>
                <TextInput
                  style={styles.inputInline}
                  placeholder="e.g. 12"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={reDetails.totalFloors || ""}
                  onChangeText={(txt) =>
                    setReDetails({ ...reDetails, totalFloors: txt })
                  }
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Khata / Land Document Type</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRowContent}
              >
                {KHATA_OPTIONS.map((k) => {
                  const isSelected = reDetails.khataType === k;
                  return (
                    <TouchableOpacity
                      key={k}
                      style={[
                        styles.chipPill,
                        isSelected && styles.chipPillSelected,
                      ]}
                      onPress={() =>
                        setReDetails({
                          ...reDetails,
                          khataType: k as RealEstateDetails["khataType"],
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipPillText,
                          isSelected && styles.chipPillTextSelected,
                        ]}
                      >
                        {k}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>RERA Approved Property</Text>
              <Switch
                value={!!reDetails.reraApproved}
                onValueChange={(val) =>
                  setReDetails({ ...reDetails, reraApproved: val })
                }
                trackColor={{ false: "#E2E8F0", true: "#C7D2FE" }}
                thumbColor={reDetails.reraApproved ? "#4F46E5" : "#94A3B8"}
              />
            </View>
            {reDetails.reraApproved && (
              <TextInput
                style={styles.input}
                placeholder="Enter RERA Registration ID"
                placeholderTextColor="#94A3B8"
                value={reDetails.reraId || ""}
                onChangeText={(txt) =>
                  setReDetails({ ...reDetails, reraId: txt })
                }
              />
            )}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Preferential Location Charges (PLC)
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRowContent}
              >
                {PLC_REASONS.map((plc) => {
                  const isSelected = reDetails.plcReason === plc;
                  return (
                    <TouchableOpacity
                      key={plc}
                      style={[
                        styles.chipPill,
                        isSelected && styles.chipPillSelected,
                      ]}
                      onPress={() =>
                        setReDetails({
                          ...reDetails,
                          plcReason: plc as RealEstateDetails["plcReason"],
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipPillText,
                          isSelected && styles.chipPillTextSelected,
                        ]}
                      >
                        {plc}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <View style={[styles.rowTwoFields, { marginTop: 8 }]}>
                <TextInput
                  style={[styles.inputInline, { flex: 1 }]}
                  placeholder="PLC Charges (e.g. 50000 or 5)"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={reDetails.plcChargeValue || ""}
                  onChangeText={(txt) =>
                    setReDetails({ ...reDetails, plcChargeValue: txt })
                  }
                />
                <View style={[styles.segmentBarInline, { flex: 1 }]}>
                  <TouchableOpacity
                    style={[
                      styles.segmentTab,
                      reDetails.plcChargeUnit === "Rupees" &&
                        styles.segmentTabSelected,
                    ]}
                    onPress={() =>
                      setReDetails({ ...reDetails, plcChargeUnit: "Rupees" })
                    }
                  >
                    <Text
                      style={[
                        styles.segmentTabText,
                        reDetails.plcChargeUnit === "Rupees" &&
                          styles.segmentTabTextSelected,
                      ]}
                    >
                      Rupees
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.segmentTab,
                      reDetails.plcChargeUnit === "Percentage" &&
                        styles.segmentTabSelected,
                    ]}
                    onPress={() =>
                      setReDetails({
                        ...reDetails,
                        plcChargeUnit: "Percentage",
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.segmentTabText,
                        reDetails.plcChargeUnit === "Percentage" &&
                          styles.segmentTabTextSelected,
                      ]}
                    >
                      %
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.rowTwoFields}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Monthly Maintenance (₹)</Text>
                <TextInput
                  style={styles.inputInline}
                  placeholder="e.g. 3500"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={reDetails.maintenanceChargeMonthly || ""}
                  onChangeText={(txt) =>
                    setReDetails({
                      ...reDetails,
                      maintenanceChargeMonthly: txt,
                    })
                  }
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Security Deposit (Months)</Text>
                <TextInput
                  style={styles.inputInline}
                  placeholder="e.g. 6"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={reDetails.securityDepositMonths || ""}
                  onChangeText={(txt) =>
                    setReDetails({
                      ...reDetails,
                      securityDepositMonths: txt,
                    })
                  }
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Amenities & Facilities</Text>
              <View style={styles.amenitiesGrid}>
                {AMENITIES_LIST.map((amenity) => {
                  const isChecked = (reDetails.amenities || []).includes(
                    amenity,
                  );
                  return (
                    <TouchableOpacity
                      key={amenity}
                      style={[
                        styles.amenityChip,
                        isChecked && styles.amenityChipSelected,
                      ]}
                      onPress={() => toggleAmenity(amenity)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={
                          isChecked ? "checkmark-circle" : "ellipse-outline"
                        }
                        size={16}
                        color={isChecked ? "#4F46E5" : "#94A3B8"}
                      />
                      <Text
                        style={[
                          styles.amenityChipText,
                          isChecked && styles.amenityChipTextSelected,
                        ]}
                      >
                        {amenity}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {category === "Vehicle" && (
          <View style={styles.groupBlock}>
            <Text style={styles.groupTitle}>VEHICLE DETAILS</Text>

            <View style={styles.rowTwoFields}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Brand / Make</Text>
                <TextInput
                  style={styles.inputInline}
                  placeholder="e.g. Maruti Suzuki"
                  placeholderTextColor="#94A3B8"
                  value={vehDetails.brand || ""}
                  onChangeText={(txt) =>
                    setVehDetails({ ...vehDetails, brand: txt })
                  }
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Model Name</Text>
                <TextInput
                  style={styles.inputInline}
                  placeholder="e.g. Swift / Creta"
                  placeholderTextColor="#94A3B8"
                  value={vehDetails.modelName || ""}
                  onChangeText={(txt) =>
                    setVehDetails({ ...vehDetails, modelName: txt })
                  }
                />
              </View>
            </View>

            <View style={styles.rowTwoFields}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Reg. Year</Text>
                <TextInput
                  style={styles.inputInline}
                  placeholder="e.g. 2021"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={vehDetails.yearOfRegistration || ""}
                  onChangeText={(txt) =>
                    setVehDetails({ ...vehDetails, yearOfRegistration: txt })
                  }
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>KM Driven</Text>
                <TextInput
                  style={styles.inputInline}
                  placeholder="e.g. 35000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={vehDetails.kmDriven || ""}
                  onChangeText={(txt) =>
                    setVehDetails({ ...vehDetails, kmDriven: txt })
                  }
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Fuel Type</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRowContent}
              >
                {FUEL_OPTIONS.map((f) => {
                  const isSelected = vehDetails.fuelType === f;
                  return (
                    <TouchableOpacity
                      key={f}
                      style={[
                        styles.chipPill,
                        isSelected && styles.chipPillSelected,
                      ]}
                      onPress={() =>
                        setVehDetails({
                          ...vehDetails,
                          fuelType: f as VehicleDetails["fuelType"],
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipPillText,
                          isSelected && styles.chipPillTextSelected,
                        ]}
                      >
                        {f}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Transmission</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRowContent}
              >
                {TRANSMISSION_OPTIONS.map((t) => {
                  const isSelected = vehDetails.transmission === t;
                  return (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.chipPill,
                        isSelected && styles.chipPillSelected,
                      ]}
                      onPress={() =>
                        setVehDetails({
                          ...vehDetails,
                          transmission: t as VehicleDetails["transmission"],
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipPillText,
                          isSelected && styles.chipPillTextSelected,
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Ownership History</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRowContent}
              >
                {OWNERSHIP_OPTIONS.map((ow) => {
                  const isSelected = vehDetails.ownershipNumber === ow;
                  return (
                    <TouchableOpacity
                      key={ow}
                      style={[
                        styles.chipPill,
                        isSelected && styles.chipPillSelected,
                      ]}
                      onPress={() =>
                        setVehDetails({
                          ...vehDetails,
                          ownershipNumber:
                            ow as VehicleDetails["ownershipNumber"],
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipPillText,
                          isSelected && styles.chipPillTextSelected,
                        ]}
                      >
                        {ow}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Insurance Status</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRowContent}
              >
                {VEHICLE_INSURANCE_OPTIONS.map((ins) => {
                  const isSelected = vehDetails.insuranceType === ins;
                  return (
                    <TouchableOpacity
                      key={ins}
                      style={[
                        styles.chipPill,
                        isSelected && styles.chipPillSelected,
                      ]}
                      onPress={() =>
                        setVehDetails({
                          ...vehDetails,
                          insuranceType: ins as VehicleDetails["insuranceType"],
                        })
                      }
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.chipPillText,
                          isSelected && styles.chipPillTextSelected,
                        ]}
                      >
                        {ins}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>RC Book Original Available</Text>
              <Switch
                value={!!vehDetails.rcAvailable}
                onValueChange={(val) =>
                  setVehDetails({ ...vehDetails, rcAvailable: val })
                }
                trackColor={{ false: "#E2E8F0", true: "#C7D2FE" }}
                thumbColor={vehDetails.rcAvailable ? "#4F46E5" : "#94A3B8"}
              />
            </View>
          </View>
        )}

        {category === "Loan" && (
          <View style={styles.groupBlock}>
            <Text style={styles.groupTitle}>LOAN DETAILS</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Partner Bank / NBFC Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. HDFC Bank, SBI, ICICI Bank"
                placeholderTextColor="#94A3B8"
                value={loanDetails.partnerBankName || ""}
                onChangeText={(txt) =>
                  setLoanDetails({ ...loanDetails, partnerBankName: txt })
                }
              />
            </View>

            <View style={styles.rowTwoFields}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Min Interest Rate (%)</Text>
                <TextInput
                  style={styles.inputInline}
                  placeholder="e.g. 8.5"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={loanDetails.minInterestRatePercentage || ""}
                  onChangeText={(txt) =>
                    setLoanDetails({
                      ...loanDetails,
                      minInterestRatePercentage: txt,
                    })
                  }
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Max Interest Rate (%)</Text>
                <TextInput
                  style={styles.inputInline}
                  placeholder="e.g. 11.5"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={loanDetails.maxInterestRatePercentage || ""}
                  onChangeText={(txt) =>
                    setLoanDetails({
                      ...loanDetails,
                      maxInterestRatePercentage: txt,
                    })
                  }
                />
              </View>
            </View>

            <View style={styles.rowTwoFields}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Max Tenure (Years)</Text>
                <TextInput
                  style={styles.inputInline}
                  placeholder="e.g. 30"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={loanDetails.maxTenureYears || ""}
                  onChangeText={(txt) =>
                    setLoanDetails({ ...loanDetails, maxTenureYears: txt })
                  }
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Min CIBIL Score</Text>
                <TextInput
                  style={styles.inputInline}
                  placeholder="e.g. 750"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={loanDetails.minCibilScoreRequired || ""}
                  onChangeText={(txt) =>
                    setLoanDetails({
                      ...loanDetails,
                      minCibilScoreRequired: txt,
                    })
                  }
                />
              </View>
            </View>
          </View>
        )}

        {category === "Insurance" && (
          <View style={styles.groupBlock}>
            <Text style={styles.groupTitle}>INSURANCE DETAILS</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Insurance Company Provider</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Star Health, HDFC ERGO"
                placeholderTextColor="#94A3B8"
                value={insDetails.insuranceProviderCompany || ""}
                onChangeText={(txt) =>
                  setInsDetails({
                    ...insDetails,
                    insuranceProviderCompany: txt,
                  })
                }
              />
            </View>

            <View style={styles.rowTwoFields}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Sum Insured Value</Text>
                <TextInput
                  style={styles.inputInline}
                  placeholder="e.g. 10 or 50"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={insDetails.sumInsuredValue || ""}
                  onChangeText={(txt) =>
                    setInsDetails({ ...insDetails, sumInsuredValue: txt })
                  }
                />
              </View>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.fieldLabel}>Claim Ratio (%)</Text>
                <TextInput
                  style={styles.inputInline}
                  placeholder="e.g. 98.5"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={insDetails.claimSettlementRatioPercentage || ""}
                  onChangeText={(txt) =>
                    setInsDetails({
                      ...insDetails,
                      claimSettlementRatioPercentage: txt,
                    })
                  }
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.groupBlock}>
          <Text style={styles.groupTitle}>LOCATION</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>State *</Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setPickerModal({ visible: true, type: "state" })}
              activeOpacity={0.7}
            >
              <Text
                style={
                  selectedState?.name
                    ? styles.selectVal
                    : styles.selectPlaceholder
                }
              >
                {selectedState?.name || "Select State"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>District / City *</Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() =>
                setPickerModal({ visible: true, type: "district" })
              }
              activeOpacity={0.7}
            >
              <Text
                style={district ? styles.selectVal : styles.selectPlaceholder}
              >
                {district || "Select District"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Locality / Area / Landmark</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. MG Road, Near City Mall"
              placeholderTextColor="#94A3B8"
              value={cityArea}
              onChangeText={setCityArea}
            />
          </View>
        </View>

        <View style={styles.groupBlock}>
          <Text style={styles.groupTitle}>CONTACT INFORMATION</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Owner Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Rajesh Sharma"
              placeholderTextColor="#94A3B8"
              value={ownerName}
              onChangeText={setOwnerName}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 9876543210"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={ownerPhone}
              onChangeText={setOwnerPhone}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>
            {existingItem ? "Update Item" : "Save Listing"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={pickerModal.visible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setPickerModal({ visible: false, type: "state" });
          setSearchQuery("");
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalTopBar}>
              <Text style={styles.modalTitleText}>
                Select {pickerModal.type === "state" ? "State" : "District"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setPickerModal({ visible: false, type: "state" });
                  setSearchQuery("");
                }}
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalSearchInput}>
              <Ionicons name="search-outline" size={16} color="#94A3B8" />
              <TextInput
                style={styles.modalSearchText}
                placeholder="Search location..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <FlatList
              data={filteredPickerItems}
              keyExtractor={(item, index) => `${item}-${index}`}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected =
                  pickerModal.type === "state"
                    ? selectedState?.name === item
                    : district === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.modalRow,
                      isSelected && styles.modalRowSelected,
                    ]}
                    onPress={() => {
                      if (pickerModal.type === "state") {
                        const found = ALL_INDIAN_STATES.find(
                          (s) => s.name === item,
                        );
                        if (found) handleSelectState(found);
                      } else {
                        handleSelectDistrict(item);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.modalRowText,
                        isSelected && styles.modalRowTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="#4F46E5" />
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyView}>
                  <Text style={styles.emptyViewText}>No matches found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      <CustomAlertModal
        visible={showSuccessModal}
        type="success"
        title={existingItem ? "Update Successful" : "Entry Saved"}
        message={
          existingItem
            ? "The listing details have been updated successfully."
            : "Your inventory item has been saved successfully."
        }
        confirmText="Go to Inventory"
        onConfirm={navigateToInventory}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    backgroundColor: "#FEF2F2",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
  form: {
    paddingVertical: 20,
    gap: 32,
  },
  groupBlock: {
    gap: 20,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 1.2,
    paddingHorizontal: 20,
  },
  sliderContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  sliderCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 8,
  },
  sliderCardSelected: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },
  sliderCardLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  sliderCardLabelSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  chipRowContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  chipPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipPillSelected: {
    backgroundColor: "#EEF2FF",
    borderColor: "#6366F1",
  },
  chipPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  chipPillTextSelected: {
    color: "#4F46E5",
    fontWeight: "700",
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: "#0F172A",
    marginHorizontal: 20,
  },
  inputInline: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: "#0F172A",
  },
  inputWithAddon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginHorizontal: 20,
  },
  inputAddonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
    marginRight: 6,
  },
  inputBare: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: "#0F172A",
  },
  priceUnitBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4F46E5",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  segmentBar: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
    padding: 3,
    marginHorizontal: 20,
  },
  segmentBarInline: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
    padding: 3,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 9,
  },
  segmentTabSelected: {
    backgroundColor: "#FFFFFF",
  },
  segmentTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  segmentTabTextSelected: {
    color: "#4F46E5",
    fontWeight: "700",
  },
  rowTwoFields: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 14,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 10,
  },
  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  amenityChipSelected: {
    backgroundColor: "#EEF2FF",
    borderColor: "#818CF8",
  },
  amenityChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#475569",
  },
  amenityChipTextSelected: {
    color: "#3730A3",
    fontWeight: "700",
  },
  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginHorizontal: 20,
  },
  selectVal: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "500",
  },
  selectPlaceholder: {
    fontSize: 14,
    color: "#94A3B8",
  },
  primaryBtn: {
    backgroundColor: "#4F46E5",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 40,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    maxHeight: "75%",
    padding: 16,
  },
  modalTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitleText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  modalSearchInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginVertical: 12,
    gap: 8,
  },
  modalSearchText: {
    flex: 1,
    paddingVertical: 9,
    fontSize: 14,
    color: "#0F172A",
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalRowSelected: {
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
  },
  modalRowText: {
    fontSize: 14,
    color: "#334155",
  },
  modalRowTextSelected: {
    color: "#4F46E5",
    fontWeight: "700",
  },
  emptyView: {
    padding: 24,
    alignItems: "center",
  },
  emptyViewText: {
    color: "#94A3B8",
    fontSize: 13,
  },
});
