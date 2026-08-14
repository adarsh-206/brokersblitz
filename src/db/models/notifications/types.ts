// db/models/notifications/types.ts
export type NotificationType = "FOLLOW_UP" | "INVENTORY" | "LEAD" | "SYSTEM";

export interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  entityId?: number | null;
  entityData?: string;
  isRead: number;
  createdAt: string;
}

export interface CreateNotificationDTO {
  type: NotificationType;
  title: string;
  body: string;
  entityId?: number | null;
  entityData?: object;
}
