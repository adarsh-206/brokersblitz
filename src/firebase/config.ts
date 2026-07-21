import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import * as firebaseAuth from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDG2dbJn5cfKAXs1JFn_KCYWYPZ8TTroo0",
  authDomain: "brokersblitz-15a9b.firebaseapp.com",
  projectId: "brokersblitz-15a9b",
  storageBucket: "brokersblitz-15a9b.firebasestorage.app",
  messagingSenderId: "455490691617",
  appId: "1:455490691617:web:012da8eef391f190413960",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const { initializeAuth, getReactNativePersistence } = firebaseAuth as any;

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
