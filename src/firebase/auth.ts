import { signInWithPhoneNumber } from "firebase/auth";

import { auth } from "./config";

export const sendOtp = async (phone: string, appVerifier: any) => {
  return signInWithPhoneNumber(auth, phone, appVerifier);
};
