// db/models/inventory/repository.ts
import { db } from "../../index";
import { InventoryItem } from "./types";

export const InventoryRepo = {
  getAll: (categoryFilter?: string, searchQuery?: string): InventoryItem[] => {
    let query = "SELECT * FROM inventory WHERE 1=1";
    const params: any[] = [];

    if (categoryFilter && categoryFilter !== "All") {
      query += " AND category = ?";
      params.push(categoryFilter);
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      query +=
        " AND (title LIKE ? OR state LIKE ? OR district LIKE ? OR cityArea LIKE ? OR ownerName LIKE ? OR purpose LIKE ? OR subCategory LIKE ? OR customSubCategory LIKE ? OR customPurpose LIKE ?)";
      const term = `%${searchQuery.trim()}%`;
      params.push(term, term, term, term, term, term, term, term, term);
    }

    query += " ORDER BY id DESC";
    return db.getAllSync<InventoryItem>(query, params);
  },

  getById: (id: number): InventoryItem | null => {
    return db.getFirstSync<InventoryItem>(
      "SELECT * FROM inventory WHERE id = ?;",
      [id],
    );
  },

  insert: (item: Omit<InventoryItem, "id">) => {
    return db.runSync(
      `INSERT INTO inventory (
        title, category, purpose, customPurpose, subCategory, customSubCategory, priceValue, priceUnit, status, state, district, cityArea, details, ownerName, ownerPhone, commissionValue, commissionType
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        item.title ?? "",
        item.category ?? "Real Estate",
        item.purpose ?? "Sell",
        item.customPurpose ?? "",
        item.subCategory ?? "Flat / Apartment",
        item.customSubCategory ?? "",
        item.priceValue ?? "",
        item.priceUnit ?? "Lakh",
        item.status ?? "AVAILABLE",
        item.state ?? "",
        item.district ?? "",
        item.cityArea ?? "",
        typeof item.details === "object"
          ? JSON.stringify(item.details)
          : (item.details ?? "{}"),
        item.ownerName ?? "",
        item.ownerPhone ?? "",
        item.commissionValue ?? "",
        item.commissionType ?? "Percentage",
      ],
    );
  },

  update: (item: InventoryItem) => {
    return db.runSync(
      `UPDATE inventory SET 
        title=?, category=?, purpose=?, customPurpose=?, subCategory=?, customSubCategory=?, priceValue=?, priceUnit=?, status=?, state=?, district=?, cityArea=?, details=?, ownerName=?, ownerPhone=?, commissionValue=?, commissionType=?
      WHERE id=?;`,
      [
        item.title ?? "",
        item.category ?? "Real Estate",
        item.purpose ?? "Sell",
        item.customPurpose ?? "",
        item.subCategory ?? "Flat / Apartment",
        item.customSubCategory ?? "",
        item.priceValue ?? "",
        item.priceUnit ?? "Lakh",
        item.status ?? "AVAILABLE",
        item.state ?? "",
        item.district ?? "",
        item.cityArea ?? "",
        typeof item.details === "object"
          ? JSON.stringify(item.details)
          : (item.details ?? "{}"),
        item.ownerName ?? "",
        item.ownerPhone ?? "",
        item.commissionValue ?? "",
        item.commissionType ?? "Percentage",
        item.id,
      ],
    );
  },

  delete: (id: number) => {
    return db.runSync("DELETE FROM inventory WHERE id = ?;", [id]);
  },
};
