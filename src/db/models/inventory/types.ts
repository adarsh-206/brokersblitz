// db/models/inventory/types.ts
export type CategoryType = "Real Estate" | "Vehicle" | "Loan" | "Insurance";
export type StatusType = "AVAILABLE" | "BOOKED" | "SOLD" | "UPCOMING";
export type PriceUnitType = "Thousand" | "Lakh" | "Crore";
export type CommissionType = "Percentage" | "Flat Rate" | "Per Sq Ft";

export type PurposeType =
  "Sell" | "Rent" | "Lease" | "PG / Co-Living" | "Other";

export type RealEstatePropertyType =
  | "Flat / Apartment"
  | "Independent House / Villa"
  | "Plot / Land"
  | "Commercial Shop / Office"
  | "Agricultural / Farmland"
  | "Warehouse / Godown"
  | "Industrial Shed"
  | "PG / Hostel Room"
  | "Other";

export type VehiclePropertyType =
  | "Car"
  | "Two Wheeler"
  | "Commercial Truck / Bus"
  | "Auto / E-Rickshaw"
  | "Tractor / Farm Machinery"
  | "Construction Equipment"
  | "Other";

export type LoanPropertyType =
  | "Home Loan"
  | "Personal Loan"
  | "Business / MSME Loan"
  | "Vehicle Loan"
  | "Loan Against Property (LAP)"
  | "Gold Loan"
  | "Education Loan"
  | "Other";

export type InsurancePropertyType =
  | "Health / Mediclaim Insurance"
  | "Motor Insurance"
  | "Term / Life Insurance"
  | "Property / Shop Insurance"
  | "Crop Insurance"
  | "Other";

export type SubCategoryType =
  | RealEstatePropertyType
  | VehiclePropertyType
  | LoanPropertyType
  | InsurancePropertyType;

export interface RealEstateDetails {
  facing?:
    | "East"
    | "West"
    | "North"
    | "South"
    | "North-East"
    | "North-West"
    | "South-East"
    | "South-West"
    | "Other";
  customFacing?: string;
  bhk?:
    | "1 RK"
    | "1 BHK"
    | "2 BHK"
    | "3 BHK"
    | "4 BHK"
    | "5+ BHK"
    | "Studio"
    | "Other";
  customBhk?: string;
  furnishingStatus?:
    "Fully Furnished" | "Semi Furnished" | "Unfurnished" | "Other";
  carpetAreaSqFt?: string;
  superBuiltUpAreaSqFt?: string;
  plotAreaSqFt?: string;
  floorNumber?: string;
  totalFloors?: string;
  amenities?: string[];
  otherAmenities?: string;
  cornerPlot?: boolean;
  gatedSociety?: boolean;
  boundaryWall?: boolean;
  khataType?:
    | "A Khata"
    | "B Khata"
    | "E Khata"
    | "Gram Panchayat"
    | "Freehold"
    | "Leasehold"
    | "Other";
  customKhataType?: string;
  reraApproved?: boolean;
  reraId?: string;
  plcChargeValue?: string;
  plcChargeUnit?: "Rupees" | "Percentage";
  plcReason?:
    | "Park / Garden Facing"
    | "Main Road Facing"
    | "Corner Plot"
    | "Sun / East Facing"
    | "Pool Facing"
    | "Other";
  customPlcReason?: string;
  maintenanceChargeMonthly?: string;
  societyExtraCharges?: string;
  securityDepositMonths?: string;
  electricityWaterMeterCharges?: string;
  stampDutyRegistrationCost?: string;
  possessionStatus?: "Ready to Move" | "Under Construction" | "Other";
  possessionDate?: string;
  additionalNotes?: string;
}

export interface VehicleDetails {
  brand?: string;
  modelName?: string;
  variant?: string;
  yearOfRegistration?: string;
  kmDriven?: string;
  fuelType?: "Petrol" | "Diesel" | "CNG" | "EV" | "Hybrid" | "Other";
  customFuelType?: string;
  transmission?: "Manual" | "Automatic" | "Other";
  ownershipNumber?:
    "1st Owner" | "2nd Owner" | "3rd Owner" | "4th+ Owner" | "Other";
  insuranceType?:
    "Third Party" | "Comprehensive" | "Zero Dep" | "Expired" | "Other";
  insuranceValidTill?: string;
  hypothecationBank?: string;
  rcAvailable?: boolean;
  nocAvailable?: boolean;
  fitnessCertificateValidTill?: string;
  permitType?: "National Permit" | "State Permit" | "Private" | "Other";
  rentalPeriodUnit?: "Per Hour" | "Per Day" | "Per Month" | "Per Km" | "Other";
  customRentalPeriodUnit?: string;
  securityDeposit?: string;
  additionalNotes?: string;
}

export interface LoanDetails {
  partnerBankName?: string;
  minInterestRatePercentage?: string;
  maxInterestRatePercentage?: string;
  processingFeeValue?: string;
  processingFeeUnit?: "Rupees" | "Percentage";
  maxTenureYears?: string;
  minCibilScoreRequired?: string;
  docCharges?: string;
  prepaymentForeclosureCharges?: string;
  collateralRequired?: boolean;
  subsidyAvailable?: boolean;
  subsidyDetails?: string;
  additionalNotes?: string;
}

export interface InsuranceDetails {
  insuranceProviderCompany?: string;
  sumInsuredValue?: string;
  sumInsuredUnit?: PriceUnitType;
  premiumFrequency?:
    "Monthly" | "Quarterly" | "Half Yearly" | "Yearly" | "One Time" | "Other";
  cashlessHospitalsCount?: string;
  claimSettlementRatioPercentage?: string;
  coPayPercentage?: string;
  waitingPeriodMonths?: string;
  networkGaragesCount?: string;
  noClaimBonusPercentage?: string;
  additionalNotes?: string;
}

export type CategoryDetails =
  | RealEstateDetails
  | VehicleDetails
  | LoanDetails
  | InsuranceDetails
  | Record<string, any>;

export interface InventoryItem {
  id: number;
  title: string;
  category: CategoryType;
  purpose: PurposeType;
  customPurpose?: string;
  subCategory: SubCategoryType;
  customSubCategory?: string;
  priceValue: string;
  priceUnit: PriceUnitType;
  status: StatusType;
  state: string;
  district: string;
  cityArea: string;
  details: string;
  ownerName: string;
  ownerPhone: string;
  commissionValue: string;
  commissionType: CommissionType;
  createdAt?: string;
}
