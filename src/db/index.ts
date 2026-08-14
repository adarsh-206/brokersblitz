// db/index.ts
import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("brokersblitz.db");

export function initDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA cache_size = -2000;

    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      purpose TEXT NOT NULL DEFAULT 'Sell',
      customPurpose TEXT DEFAULT '',
      subCategory TEXT NOT NULL DEFAULT 'Flat / Apartment',
      customSubCategory TEXT DEFAULT '',
      priceValue TEXT NOT NULL,
      priceUnit TEXT NOT NULL,
      status TEXT NOT NULL,
      state TEXT NOT NULL,
      district TEXT NOT NULL,
      cityArea TEXT NOT NULL,
      details TEXT NOT NULL,
      ownerName TEXT NOT NULL,
      ownerPhone TEXT NOT NULL,
      commissionValue TEXT NOT NULL,
      commissionType TEXT NOT NULL,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      inventoryId INTEGER DEFAULT NULL,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT DEFAULT '',
      category TEXT NOT NULL,
      purpose TEXT DEFAULT '',
      customPurpose TEXT DEFAULT '',
      subCategory TEXT DEFAULT '',
      customSubCategory TEXT DEFAULT '',
      minBudget TEXT DEFAULT '',
      maxBudget TEXT DEFAULT '',
      budgetUnit TEXT DEFAULT 'Lakh',
      status TEXT NOT NULL DEFAULT 'NEW',
      priority TEXT NOT NULL DEFAULT 'MEDIUM',
      source TEXT DEFAULT '',
      customSource TEXT DEFAULT '',
      profession TEXT DEFAULT '',
      occupationType TEXT DEFAULT '',
      customOccupationType TEXT DEFAULT '',
      approxMonthlyIncome TEXT DEFAULT '',
      cibilScoreRange TEXT DEFAULT '',
      preferredState TEXT DEFAULT '',
      preferredDistrict TEXT DEFAULT '',
      preferredCityArea TEXT DEFAULT '',
      specificRequirementsJson TEXT DEFAULT '{}',
      nextFollowUpDate TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (inventoryId) REFERENCES inventory (id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      entityId INTEGER DEFAULT NULL,
      entityData TEXT DEFAULT '{}',
      isRead INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function resetDatabase() {
  await db.closeAsync();
  await SQLite.deleteDatabaseAsync("brokersblitz.db");
}
