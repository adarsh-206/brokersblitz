// db/models/leads/repository.ts
import {
  cancelLeadFollowUpPopup,
  scheduleLeadFollowUpPopup,
} from "../../../utils/deviceNotifications";
import { db } from "../../index";
import { NotificationRepository } from "../notifications/repository";
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
        "SELECT * FROM leads WHERE nextFollowUpDate != '' AND nextFollowUpDate <= ? AND status != 'LOST' ORDER BY nextFollowUpDate ASC;",
        [dateLimit],
      );
    }
    return db.getAllSync<Lead>(
      "SELECT * FROM leads WHERE nextFollowUpDate != '' AND status != 'LOST' ORDER BY nextFollowUpDate ASC;",
    );
  },

  insert: (lead: Omit<Lead, "id">) => {
    const result = db.runSync(
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

    const insertedLead = { ...lead, id: result.lastInsertRowId };

    NotificationRepository.create({
      type: "LEAD",
      title: `New Lead: ${lead.name || "Unnamed"}`,
      body: `Inquiry for ${lead.subCategory || lead.category || "Property"} (${lead.phone}).`,
      entityId: result.lastInsertRowId,
      entityData: insertedLead,
    });

    if (lead.nextFollowUpDate) {
      NotificationRepository.create({
        type: "FOLLOW_UP",
        title: `Follow-up Scheduled: ${lead.name}`,
        body: `Contact scheduled on ${lead.nextFollowUpDate} for ${lead.phone}.`,
        entityId: result.lastInsertRowId,
        entityData: insertedLead,
      });

      scheduleLeadFollowUpPopup(
        result.lastInsertRowId,
        lead.name,
        lead.nextFollowUpDate,
        lead.phone,
      );
    }

    return result;
  },

  update: (lead: Lead) => {
    const prevLead = LeadRepo.getById(lead.id);

    const result = db.runSync(
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

    if (prevLead && prevLead.status !== lead.status) {
      let title = `Lead Status: ${lead.status}`;
      let body = `${lead.name}'s status was changed to ${lead.status}.`;

      if (lead.status === "LOST") {
        title = "Lead Marked Lost";
        body = `Lead ${lead.name} has been marked as LOST.`;
        cancelLeadFollowUpPopup(lead.id);
      }

      NotificationRepository.create({
        type: "LEAD",
        title,
        body,
        entityId: lead.id,
        entityData: lead,
      });
    }

    if (lead.nextFollowUpDate) {
      if (!prevLead || prevLead.nextFollowUpDate !== lead.nextFollowUpDate) {
        NotificationRepository.create({
          type: "FOLLOW_UP",
          title: `Follow-up Updated: ${lead.name}`,
          body: `Contact scheduled on ${lead.nextFollowUpDate} for ${lead.phone}.`,
          entityId: lead.id,
          entityData: lead,
        });

        scheduleLeadFollowUpPopup(
          lead.id,
          lead.name,
          lead.nextFollowUpDate,
          lead.phone,
        );
      }
    } else {
      cancelLeadFollowUpPopup(lead.id);
    }

    return result;
  },

  updateStatus: (
    id: number,
    status: Lead["status"],
    nextFollowUpDate?: string,
  ) => {
    const lead = LeadRepo.getById(id);
    const result = db.runSync(
      "UPDATE leads SET status = ?, nextFollowUpDate = ? WHERE id = ?;",
      [status, nextFollowUpDate ?? "", id],
    );

    if (lead) {
      const updatedLead = {
        ...lead,
        status,
        nextFollowUpDate: nextFollowUpDate ?? lead.nextFollowUpDate,
      };

      let title = `Lead Status: ${status}`;
      let body = `${lead.name}'s status was changed to ${status}.`;

      if (status === "LOST") {
        title = "Lead Marked Lost";
        body = `Lead ${lead.name} has been marked as LOST.`;
        cancelLeadFollowUpPopup(id);
      }

      NotificationRepository.create({
        type: "LEAD",
        title,
        body,
        entityId: id,
        entityData: updatedLead,
      });

      if (nextFollowUpDate) {
        NotificationRepository.create({
          type: "FOLLOW_UP",
          title: `Follow-up Rescheduled: ${lead.name}`,
          body: `Next follow-up set for ${nextFollowUpDate}.`,
          entityId: id,
          entityData: updatedLead,
        });

        scheduleLeadFollowUpPopup(id, lead.name, nextFollowUpDate, lead.phone);
      } else if (!nextFollowUpDate) {
        cancelLeadFollowUpPopup(id);
      }
    }

    return result;
  },

  delete: (id: number) => {
    cancelLeadFollowUpPopup(id);
    return db.runSync("DELETE FROM leads WHERE id = ?;", [id]);
  },
};
