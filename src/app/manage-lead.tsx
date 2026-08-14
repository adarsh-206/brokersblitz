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
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAlertModal from "../components/CustomAlertModal";
import { InventoryRepo } from "../db/models/inventory/repository";
import {
  CategoryType,
  PriceUnitType,
  PurposeType,
  SubCategoryType,
} from "../db/models/inventory/types";
import { LeadRepo } from "../db/models/leads/repository";
import {
  Lead,
  LeadPriorityType,
  LeadSourceType,
  LeadStatusType,
  OccupationType,
} from "../db/models/leads/types";

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

const CATEGORIES: CategoryType[] = [
  "Real Estate",
  "Vehicle",
  "Loan",
  "Insurance",
];

const LEAD_STATUSES: LeadStatusType[] = [
  "NEW",
  "CONTACTED",
  "SITE_VISIT_SCHEDULED",
  "SITE_VISIT_COMPLETED",
  "IN_NEGOTIATION",
  "CONVERTED",
  "LOST",
  "ON_HOLD",
];

const PRIORITIES: LeadPriorityType[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const LEAD_SOURCES: LeadSourceType[] = [
  "WhatsApp",
  "Phone Call",
  "Direct Walk-in",
  "Reference / Referral",
  "Facebook / Instagram Ads",
  "Google Search",
  "MagicBricks / 99acres",
  "Banner / Pamphlet",
  "Other",
];

const OCCUPATION_TYPES: OccupationType[] = [
  "Salaried - Private",
  "Salaried - Government",
  "Business Owner / Self Employed",
  "Professional (Doctor/CA/Lawyer)",
  "Retired",
  "Homemaker",
  "Student",
  "Other",
];

const PRICE_UNITS: PriceUnitType[] = ["Thousand", "Lakh", "Crore"];

export default function ManageLeadScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const existingLead: Lead | null = params.lead
    ? JSON.parse(params.lead as string)
    : null;

  const [name, setName] = useState(existingLead?.name || "");
  const [phone, setPhone] = useState(existingLead?.phone || "");
  const [email, setEmail] = useState(existingLead?.email || "");

  const [category, setCategory] = useState<CategoryType>(
    existingLead?.category || "Real Estate",
  );
  const [purpose, setPurpose] = useState<PurposeType | undefined>(
    existingLead?.purpose || "Sell",
  );
  const [subCategory, setSubCategory] = useState<SubCategoryType | undefined>(
    existingLead?.subCategory || undefined,
  );

  const [inventoryId, setInventoryId] = useState<number | null>(
    existingLead?.inventoryId || null,
  );

  const [status, setStatus] = useState<LeadStatusType>(
    existingLead?.status || "NEW",
  );
  const [priority, setPriority] = useState<LeadPriorityType>(
    existingLead?.priority || "MEDIUM",
  );
  const [source, setSource] = useState<LeadSourceType | undefined>(
    existingLead?.source || "Phone Call",
  );

  const [minBudget, setMinBudget] = useState(existingLead?.minBudget || "");
  const [maxBudget, setMaxBudget] = useState(existingLead?.maxBudget || "");
  const [budgetUnit, setBudgetUnit] = useState<PriceUnitType>(
    existingLead?.budgetUnit || "Lakh",
  );

  const [profession, setProfession] = useState(existingLead?.profession || "");
  const [occupationType, setOccupationType] = useState<
    OccupationType | undefined
  >(existingLead?.occupationType || undefined);
  const [approxMonthlyIncome, setApproxMonthlyIncome] = useState(
    existingLead?.approxMonthlyIncome || "",
  );

  const initialSelectedState = ALL_INDIAN_STATES.find(
    (s) =>
      s.name.toLowerCase() ===
      (existingLead?.preferredState || "").toLowerCase(),
  );

  const [selectedState, setSelectedState] = useState<LocationItem | null>(
    initialSelectedState || null,
  );
  const [district, setDistrict] = useState(
    existingLead?.preferredDistrict || "",
  );
  const [cityArea, setCityArea] = useState(
    existingLead?.preferredCityArea || "",
  );

  const [nextFollowUpDate, setNextFollowUpDate] = useState(
    existingLead?.nextFollowUpDate || "",
  );
  const [notes, setNotes] = useState(existingLead?.notes || "");

  const [pickerModal, setPickerModal] = useState<{
    visible: boolean;
    type: "state" | "district" | "inventory";
  }>({ visible: false, type: "state" });

  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const inventoryList = useMemo(() => {
    return InventoryRepo.getAll("All", searchQuery);
  }, [searchQuery]);

  const availableDistricts = useMemo(() => {
    return fetchDistrictsForState(selectedState?.code);
  }, [selectedState?.code]);

  const selectedInventoryItem = useMemo(() => {
    if (!inventoryId) return null;
    return InventoryRepo.getById(inventoryId);
  }, [inventoryId]);

  const filteredPickerItems = useMemo(() => {
    if (pickerModal.type === "state") {
      if (!searchQuery.trim()) return ALL_INDIAN_STATES.map((s) => s.name);
      return ALL_INDIAN_STATES.filter((s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ).map((s) => s.name);
    } else if (pickerModal.type === "district") {
      if (!searchQuery.trim()) return availableDistricts;
      return availableDistricts.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return [];
  }, [pickerModal.type, searchQuery, availableDistricts]);

  const navigateToLeads = () => {
    setShowSuccessModal(false);
    router.replace("/(tabs)/leads" as any);
  };

  const handleSave = () => {
    if (!name || !phone) {
      Alert.alert(
        "Required Fields Missing",
        "Please enter customer Name and Phone Number.",
      );
      return;
    }

    const payload = {
      inventoryId,
      name,
      phone,
      email,
      category,
      purpose,
      subCategory,
      minBudget,
      maxBudget,
      budgetUnit,
      status,
      priority,
      source,
      profession,
      occupationType,
      approxMonthlyIncome,
      preferredState: selectedState?.name || "",
      preferredDistrict: district,
      preferredCityArea: cityArea,
      nextFollowUpDate,
      notes,
    };

    if (existingLead) {
      LeadRepo.update({ id: existingLead.id, ...payload });
    } else {
      LeadRepo.insert(payload);
    }

    setShowSuccessModal(true);
    setTimeout(() => {
      navigateToLeads();
    }, 1800);
  };

  const handleDelete = () => {
    if (!existingLead) return;
    Alert.alert(
      "Delete Lead",
      "Are you sure you want to remove this lead record permanently?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            LeadRepo.delete(existingLead.id);
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
          {existingLead ? "Edit Lead" : "Add Lead / Enquiry"}
        </Text>
        {existingLead ? (
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

      <KeyboardAwareScrollView
        contentContainerStyle={styles.form}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        <View style={styles.groupBlock}>
          <Text style={styles.groupTitle}>CLIENT CONTACT INFO</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Client Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Amit Varma"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.rowTwoFields}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Phone Number *</Text>
              <TextInput
                style={styles.inputInline}
                placeholder="e.g. 9876543210"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput
                style={styles.inputInline}
                placeholder="e.g. amit@gmail.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>
        </View>

        <View style={styles.groupBlock}>
          <Text style={styles.groupTitle}>REQUIREMENTS & CATEGORY</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRowContent}
            >
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.chipPill,
                      isSelected && styles.chipPillSelected,
                    ]}
                    onPress={() => setCategory(cat)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.chipPillText,
                        isSelected && styles.chipPillTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              Link To Listed Property (Optional)
            </Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() =>
                setPickerModal({ visible: true, type: "inventory" })
              }
              activeOpacity={0.7}
            >
              <Text
                style={
                  selectedInventoryItem
                    ? styles.selectVal
                    : styles.selectPlaceholder
                }
                numberOfLines={1}
              >
                {selectedInventoryItem
                  ? `${selectedInventoryItem.title} (₹${selectedInventoryItem.priceValue} ${selectedInventoryItem.priceUnit})`
                  : "Tap to link a specific listing"}
              </Text>
              {inventoryId ? (
                <TouchableOpacity onPress={() => setInventoryId(null)}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              ) : (
                <Ionicons name="chevron-down" size={16} color="#64748B" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Budget Range</Text>
            <View style={styles.segmentBar}>
              {PRICE_UNITS.map((u) => {
                const isSelected = budgetUnit === u;
                return (
                  <TouchableOpacity
                    key={u}
                    style={[
                      styles.segmentTab,
                      isSelected && styles.segmentTabSelected,
                    ]}
                    onPress={() => setBudgetUnit(u)}
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

            <View style={styles.rowTwoFields}>
              <TextInput
                style={[styles.inputInline, { flex: 1 }]}
                placeholder="Min Budget"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={minBudget}
                onChangeText={setMinBudget}
              />
              <TextInput
                style={[styles.inputInline, { flex: 1 }]}
                placeholder="Max Budget"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                value={maxBudget}
                onChangeText={setMaxBudget}
              />
            </View>
          </View>
        </View>

        <View style={styles.groupBlock}>
          <Text style={styles.groupTitle}>LEAD PIPELINE & STATUS</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Lead Status</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRowContent}
            >
              {LEAD_STATUSES.map((st) => {
                const isSelected = status === st;
                return (
                  <TouchableOpacity
                    key={st}
                    style={[
                      styles.chipPill,
                      isSelected && styles.chipPillSelected,
                    ]}
                    onPress={() => setStatus(st)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipPillText,
                        isSelected && styles.chipPillTextSelected,
                      ]}
                    >
                      {st.replace(/_/g, " ")}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Priority Level</Text>
            <View style={styles.segmentBar}>
              {PRIORITIES.map((p) => {
                const isSelected = priority === p;
                return (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.segmentTab,
                      isSelected && styles.segmentTabSelected,
                    ]}
                    onPress={() => setPriority(p)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.segmentTabText,
                        isSelected && styles.segmentTabTextSelected,
                      ]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Next Follow-up Date</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. YYYY-MM-DD or Next Tuesday"
              placeholderTextColor="#94A3B8"
              value={nextFollowUpDate}
              onChangeText={setNextFollowUpDate}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Lead Source</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRowContent}
            >
              {LEAD_SOURCES.map((src) => {
                const isSelected = source === src;
                return (
                  <TouchableOpacity
                    key={src}
                    style={[
                      styles.chipPill,
                      isSelected && styles.chipPillSelected,
                    ]}
                    onPress={() => setSource(src)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipPillText,
                        isSelected && styles.chipPillTextSelected,
                      ]}
                    >
                      {src}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        <View style={styles.groupBlock}>
          <Text style={styles.groupTitle}>BACKGROUND & FINANCIALS</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Occupation Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRowContent}
            >
              {OCCUPATION_TYPES.map((occ) => {
                const isSelected = occupationType === occ;
                return (
                  <TouchableOpacity
                    key={occ}
                    style={[
                      styles.chipPill,
                      isSelected && styles.chipPillSelected,
                    ]}
                    onPress={() => setOccupationType(occ)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipPillText,
                        isSelected && styles.chipPillTextSelected,
                      ]}
                    >
                      {occ}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.rowTwoFields}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Designation / Role</Text>
              <TextInput
                style={styles.inputInline}
                placeholder="e.g. Software Engineer"
                placeholderTextColor="#94A3B8"
                value={profession}
                onChangeText={setProfession}
              />
            </View>

            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>Approx Monthly Income</Text>
              <TextInput
                style={styles.inputInline}
                placeholder="e.g. 1.2 Lakh"
                placeholderTextColor="#94A3B8"
                value={approxMonthlyIncome}
                onChangeText={setApproxMonthlyIncome}
              />
            </View>
          </View>
        </View>

        <View style={styles.groupBlock}>
          <Text style={styles.groupTitle}>PREFERRED LOCATION</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>State</Text>
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
            <Text style={styles.fieldLabel}>District / City</Text>
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
            <Text style={styles.fieldLabel}>Preferred Area / Locality</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Kothrud or Baner"
              placeholderTextColor="#94A3B8"
              value={cityArea}
              onChangeText={setCityArea}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Specific Requirements & Notes</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Add client requirements or discussion summary..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleSave}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>
            {existingLead ? "Update Lead" : "Save Lead"}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

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
                Select{" "}
                {pickerModal.type === "state"
                  ? "State"
                  : pickerModal.type === "district"
                    ? "District"
                    : "Listing"}
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
                placeholder="Search..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {pickerModal.type === "inventory" ? (
              <FlatList
                data={inventoryList}
                keyExtractor={(item) => item.id.toString()}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalRow,
                      inventoryId === item.id && styles.modalRowSelected,
                    ]}
                    onPress={() => {
                      setInventoryId(item.id);
                      setPickerModal({ visible: false, type: "state" });
                      setSearchQuery("");
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.modalRowText,
                          inventoryId === item.id &&
                            styles.modalRowTextSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.modalSubRowText}>
                        ₹{item.priceValue} {item.priceUnit} • {item.district}
                      </Text>
                    </View>
                    {inventoryId === item.id && (
                      <Ionicons name="checkmark" size={16} color="#4F46E5" />
                    )}
                  </TouchableOpacity>
                )}
              />
            ) : (
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
                          if (found) {
                            setSelectedState(found);
                            setDistrict("");
                          }
                        } else {
                          setDistrict(item);
                        }
                        setPickerModal({ visible: false, type: "state" });
                        setSearchQuery("");
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
              />
            )}
          </View>
        </View>
      </Modal>

      <CustomAlertModal
        visible={showSuccessModal}
        type="success"
        title={existingLead ? "Update Successful" : "Lead Saved"}
        message={
          existingLead
            ? "The lead record has been updated successfully."
            : "New lead record created successfully."
        }
        confirmText="Go to Leads"
        onConfirm={navigateToLeads}
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
  multilineInput: {
    height: 90,
    textAlignVertical: "top",
  },
  segmentBar: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
    padding: 3,
    marginHorizontal: 20,
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
    flex: 1,
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
  modalSubRowText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  modalRowTextSelected: {
    color: "#4F46E5",
    fontWeight: "700",
  },
});
