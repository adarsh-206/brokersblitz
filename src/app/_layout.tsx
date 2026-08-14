// app/_layout.tsx
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { initDatabase } from "../db";
import { LeadRepo } from "../db/models/leads/repository";

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let Notifications: typeof import("expo-notifications") | null = null;

if (!isExpoGo) {
  try {
    const notificationsModule = require("expo-notifications");
    notificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    Notifications = notificationsModule;
  } catch {
    Notifications = null;
  }
}

export default function RootLayout() {
  const router = useRouter();

  const [fontsLoaded, error] = useFonts({
    "PlusJakarta-Regular": PlusJakartaSans_400Regular,
    "PlusJakarta-Medium": PlusJakartaSans_500Medium,
    "PlusJakarta-SemiBold": PlusJakartaSans_600SemiBold,
    "PlusJakarta-Bold": PlusJakartaSans_700Bold,
    "PlusJakarta-ExtraBold": PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    initDatabase();

    const activeNotifications = Notifications;
    if (!activeNotifications) {
      return;
    }

    async function configureNotifications() {
      if (!activeNotifications) return;

      if (Platform.OS === "android") {
        await activeNotifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: activeNotifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#5D45F9",
        });
      }

      const { status: existingStatus } =
        await activeNotifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await activeNotifications.requestPermissionsAsync();
        finalStatus = status;
      }
    }

    configureNotifications();

    const responseSubscription =
      activeNotifications.addNotificationResponseReceivedListener(
        (response) => {
          const data = response.notification.request.content.data;
          if (data?.leadId) {
            const lead = LeadRepo.getById(Number(data.leadId));
            if (lead) {
              router.push({
                pathname: "/manage-lead" as any,
                params: { lead: JSON.stringify(lead) },
              });
              return;
            }
          }
          router.push("/notifications" as any);
        },
      );

    return () => {
      responseSubscription.remove();
    };
  }, []);

  if (!fontsLoaded && !error) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
