import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { initDatabase } from "../db";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "PlusJakarta-Regular": PlusJakartaSans_400Regular,
    "PlusJakarta-Medium": PlusJakartaSans_500Medium,
    "PlusJakarta-SemiBold": PlusJakartaSans_600SemiBold,
    "PlusJakarta-Bold": PlusJakartaSans_700Bold,
    "PlusJakarta-ExtraBold": PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    // resetDatabase();
    initDatabase();
  }, []);

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
