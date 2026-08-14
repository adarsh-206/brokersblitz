// utils/deviceNotifications.ts
import Constants, { ExecutionEnvironment } from "expo-constants";

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let Notifications: typeof import("expo-notifications") | null = null;

if (!isExpoGo) {
  try {
    Notifications = require("expo-notifications");
  } catch {
    Notifications = null;
  }
}

export async function scheduleLeadFollowUpPopup(
  leadId: number,
  leadName: string,
  followUpDateString: string,
  phone?: string,
) {
  if (!Notifications) {
    return;
  }

  try {
    const targetDate = new Date(followUpDateString);

    if (isNaN(targetDate.getTime())) {
      return;
    }

    if (followUpDateString.length === 10 && !followUpDateString.includes("T")) {
      targetDate.setHours(10, 0, 0, 0);
    }

    const now = new Date();
    if (targetDate.getTime() <= now.getTime()) {
      return;
    }

    await cancelLeadFollowUpPopup(leadId);

    const trigger = {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: targetDate,
    };

    await Notifications.scheduleNotificationAsync({
      identifier: `lead-followup-${leadId}`,
      content: {
        title: `Follow-up Due: ${leadName}`,
        body: `Scheduled contact time reached for ${phone || leadName}.`,
        sound: true,
        data: { leadId, route: "/manage-lead" },
      },
      trigger: trigger as any,
    });
  } catch (error) {
    console.error("Failed to schedule device notification:", error);
  }
}

export async function cancelLeadFollowUpPopup(leadId: number) {
  if (!Notifications) {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(
      `lead-followup-${leadId}`,
    );
  } catch (error) {
    console.error("Failed to cancel scheduled notification:", error);
  }
}
