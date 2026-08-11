// db/models/leads/repository.ts
import { db } from "../../index";
import { Lead } from "./types";

export const LeadRepo = {
  getAll: (
    statusFilter?: string,
    categoryFilter?: string,
    searchQuery?: string,
  ): Lead[] => {
    let query = "SELECT * FROM leads WHERE 1=1";
    const params: any[] = [];

    if (statusFilter && statusFilter !== "All") {
      query += " AND status = ?";
      params.push(statusFilter);
    }

    if (categoryFilter && categoryFilter !== "All") {
      query += " AND category = ?";
      params.push(categoryFilter);
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      query +=
        " AND (name LIKE ? OR phone LIKE ? OR email LIKE ? OR profession LIKE ? OR preferredCityArea LIKE ? OR preferredDistrict LIKE ? OR preferredState LIKE ?)";
      const term = `%${searchQuery.trim()}%`;
      params.push(term, term, term, term, term, term, term);
    }

    query += " ORDER BY id DESC";
    return db.getAllSync<Lead>(query, params);
  },

  getByInventoryId: (inventoryId: number): Lead[] => {
    return db.getAllSync<Lead>(
      "SELECT * FROM leads WHERE inventoryId = ? ORDER BY id DESC;",
      [inventoryId],
    );
  },

  getById: (id: number): Lead | null => {
    return db.getFirstSync<Lead>("SELECT * FROM leads WHERE id = ?;", [id]);
  },

  getUpcomingFollowUps: (dateLimit?: string): Lead[] => {
    if (dateLimit) {
      return db.getAllSync<Lead>(
        "SELECT * FROM leads WHERE nextFollowUpDate != '' AND nextFollowUpDate <= ? AND status NOT IN ('CONVERTED', 'LOST') ORDER BY nextFollowUpDate ASC;",
        [dateLimit],
      );
    }
    return db.getAllSync<Lead>(
      "SELECT * FROM leads WHERE nextFollowUpDate != '' AND status NOT IN ('CONVERTED', 'LOST') ORDER BY nextFollowUpDate ASC;",
    );
  },

  insert: (lead: Omit<Lead, "id">) => {
    return db.runSync(
      `INSERT INTO leads (
        inventoryId, name, phone, email, category, purpose, customPurpose, subCategory, customSubCategory, minBudget, maxBudget, budgetUnit, status, priority, source, customSource, profession, occupationType, customOccupationType, approxMonthlyIncome, cibilScoreRange, preferredState, preferredDistrict, preferredCityArea, specificRequirementsJson, nextFollowUpDate, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        lead.inventoryId ?? null,
        lead.name ?? "",
        lead.phone ?? "",
        lead.email ?? "",
        lead.category ?? "Real Estate",
        lead.purpose ?? "",
        lead.customPurpose ?? "",
        lead.subCategory ?? "",
        lead.customSubCategory ?? "",
        lead.minBudget ?? "",
        lead.maxBudget ?? "",
        lead.budgetUnit ?? "Lakh",
        lead.status ?? "NEW",
        lead.priority ?? "MEDIUM",
        lead.source ?? "",
        lead.customSource ?? "",
        lead.profession ?? "",
        lead.occupationType ?? "",
        lead.customOccupationType ?? "",
        lead.approxMonthlyIncome ?? "",
        lead.cibilScoreRange ?? "",
        lead.preferredState ?? "",
        lead.preferredDistrict ?? "",
        lead.preferredCityArea ?? "",
        typeof lead.specificRequirementsJson === "object"
          ? JSON.stringify(lead.specificRequirementsJson)
          : (lead.specificRequirementsJson ?? "{}"),
        lead.nextFollowUpDate ?? "",
        lead.notes ?? "",
      ],
    );
  },

  update: (lead: Lead) => {
    return db.runSync(
      `UPDATE leads SET 
        inventoryId=?, name=?, phone=?, email=?, category=?, purpose=?, customPurpose=?, subCategory=?, customSubCategory=?, minBudget=?, maxBudget=?, budgetUnit=?, status=?, priority=?, source=?, customSource=?, profession=?, occupationType=?, customOccupationType=?, approxMonthlyIncome=?, cibilScoreRange=?, preferredState=?, preferredDistrict=?, preferredCityArea=?, specificRequirementsJson=?, nextFollowUpDate=?, notes=?
      WHERE id=?;`,
      [
        lead.inventoryId ?? null,
        lead.name ?? "",
        lead.phone ?? "",
        lead.email ?? "",
        lead.category ?? "Real Estate",
        lead.purpose ?? "",
        lead.customPurpose ?? "",
        lead.subCategory ?? "",
        lead.customSubCategory ?? "",
        lead.minBudget ?? "",
        lead.maxBudget ?? "",
        lead.budgetUnit ?? "Lakh",
        lead.status ?? "NEW",
        lead.priority ?? "MEDIUM",
        lead.source ?? "",
        lead.customSource ?? "",
        lead.profession ?? "",
        lead.occupationType ?? "",
        lead.customOccupationType ?? "",
        lead.approxMonthlyIncome ?? "",
        lead.cibilScoreRange ?? "",
        lead.preferredState ?? "",
        lead.preferredDistrict ?? "",
        lead.preferredCityArea ?? "",
        typeof lead.specificRequirementsJson === "object"
          ? JSON.stringify(lead.specificRequirementsJson)
          : (lead.specificRequirementsJson ?? "{}"),
        lead.nextFollowUpDate ?? "",
        lead.notes ?? "",
        lead.id,
      ],
    );
  },

  updateStatus: (
    id: number,
    status: Lead["status"],
    nextFollowUpDate?: string,
  ) => {
    return db.runSync(
      "UPDATE leads SET status = ?, nextFollowUpDate = ? WHERE id = ?;",
      [status, nextFollowUpDate ?? "", id],
    );
  },

  delete: (id: number) => {
    return db.runSync("DELETE FROM leads WHERE id = ?;", [id]);
  },
};
