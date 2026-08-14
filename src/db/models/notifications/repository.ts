// db/models/notifications/repository.ts
import { db } from "../../index";
import { CreateNotificationDTO, NotificationItem } from "./types";

export const NotificationRepository = {
  initTable(): void {
    try {
      db.execSync(`
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
    } catch (error) {
      console.error(
        "❌ [NotificationRepo.initTable] Failed to init table:",
        error,
      );
    }
  },

  getAll(): NotificationItem[] {
    try {
      const rows = db.getAllSync<NotificationItem>(
        "SELECT * FROM notifications ORDER BY id DESC",
      );
      return rows;
    } catch (error) {
      console.error(
        "❌ [NotificationRepo.getAll] Failed to fetch notifications:",
        error,
      );
      return [];
    }
  },

  getUnreadCount(): number {
    try {
      const res = db.getAllSync<{ count: number }>(
        "SELECT COUNT(*) as count FROM notifications WHERE isRead = 0",
      );
      const count = res[0]?.count || 0;
      return count;
    } catch (error) {
      console.error(
        "❌ [NotificationRepo.getUnreadCount] Failed to get unread count:",
        error,
      );
      return 0;
    }
  },

  create(dto: CreateNotificationDTO): void {
    this.initTable();
    try {
      const result = db.runSync(
        `INSERT INTO notifications (type, title, body, entityId, entityData, isRead)
         VALUES (?, ?, ?, ?, ?, 0)`,
        [
          dto.type,
          dto.title,
          dto.body,
          dto.entityId ?? null,
          dto.entityData ? JSON.stringify(dto.entityData) : "{}",
        ],
      );
    } catch (error) {
      console.error(
        "❌ [NotificationRepo.create] Failed to insert notification:",
        error,
      );
    }
  },

  markAsRead(id: number): void {
    try {
      db.runSync("UPDATE notifications SET isRead = 1 WHERE id = ?", [id]);
    } catch (error) {
      console.error(
        "❌ [NotificationRepo.markAsRead] Failed to mark as read:",
        error,
      );
    }
  },

  markAllAsRead(): void {
    try {
      db.runSync("UPDATE notifications SET isRead = 1 WHERE isRead = 0");
    } catch (error) {
      console.error(
        "❌ [NotificationRepo.markAllAsRead] Failed to mark all as read:",
        error,
      );
    }
  },

  delete(id: number): void {
    try {
      db.runSync("DELETE FROM notifications WHERE id = ?", [id]);
    } catch (error) {
      console.error("❌ [NotificationRepo.delete] Failed to delete ID:", error);
    }
  },

  checkAndGenerateDueFollowUps(): void {
    this.initTable();
    const today = new Date().toISOString().split("T")[0];

    try {
      const dueLeads = db.getAllSync<any>(
        `SELECT * FROM leads 
         WHERE nextFollowUpDate IS NOT NULL 
           AND nextFollowUpDate != '' 
           AND nextFollowUpDate <= ? 
           AND status NOT IN ('CONVERTED', 'LOST', 'CLOSED')`,
        [today],
      );

      dueLeads.forEach((lead) => {
        const existing = db.getAllSync<{ count: number }>(
          `SELECT COUNT(*) as count FROM notifications 
           WHERE entityId = ? 
             AND type = 'FOLLOW_UP' 
             AND createdAt LIKE ?`,
          [lead.id, `${today}%`],
        );

        if ((existing[0]?.count || 0) === 0) {
          this.create({
            type: "FOLLOW_UP",
            title: `Follow-up Due: ${lead.name}`,
            body: `Follow-up scheduled today with ${lead.name} (${lead.phone}).`,
            entityId: lead.id,
            entityData: lead,
          });
        } else {
        }
      });
    } catch (error) {}
  },
};
