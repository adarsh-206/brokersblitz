// db/models/leads/types.ts
import {
  CategoryType,
  PriceUnitType,
  PurposeType,
  SubCategoryType,
} from "../inventory/types";

export type LeadStatusType =
  | "NEW"
  | "CONTACTED"
  | "SITE_VISIT_SCHEDULED"
  | "SITE_VISIT_COMPLETED"
  | "IN_NEGOTIATION"
  | "CONVERTED"
  | "LOST"
  | "ON_HOLD";

export type LeadPriorityType = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type LeadSourceType =
  | "WhatsApp"
  | "Phone Call"
  | "Direct Walk-in"
  | "Reference / Referral"
  | "Facebook / Instagram Ads"
  | "Google Search"
  | "MagicBricks / 99acres"
  | "Banner / Pamphlet"
  | "Other";

export type OccupationType =
  | "Salaried - Private"
  | "Salaried - Government"
  | "Business Owner / Self Employed"
  | "Professional (Doctor/CA/Lawyer)"
  | "Retired"
  | "Homemaker"
  | "Student"
  | "Other";

export interface Lead {
  id: number;
  inventoryId?: number | null;
  name: string;
  phone: string;
  email?: string;
  category: CategoryType;
  purpose?: PurposeType;
  customPurpose?: string;
  subCategory?: SubCategoryType;
  customSubCategory?: string;
  minBudget?: string;
  maxBudget?: string;
  budgetUnit?: PriceUnitType;
  status: LeadStatusType;
  priority: LeadPriorityType;
  source?: LeadSourceType;
  customSource?: string;
  profession?: string;
  occupationType?: OccupationType;
  customOccupationType?: string;
  approxMonthlyIncome?: string;
  cibilScoreRange?: string;
  preferredState?: string;
  preferredDistrict?: string;
  preferredCityArea?: string;
  specificRequirementsJson?: string;
  nextFollowUpDate?: string;
  notes?: string;
  createdAt?: string;
}
