import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { User } from "firebase/auth";

export type UserProfile = {
  calorieLimit: number;
  role: "admin" | "user";
};

const DEFAULT_PROFILE: UserProfile = {
  calorieLimit: 2100,
  role: "user",
};

export async function getUserProfile(user: User) {
  const db = getFirestore();
  const userProfileRef = doc(db, "user-profiles", user.uid);
  const userProfile = await getDoc(userProfileRef);
  if (!userProfile.exists()) {
    await setDoc(userProfileRef, DEFAULT_PROFILE);
  }
  const userProfileData = await userProfile.data();

  const profile: UserProfile = {
    ...DEFAULT_PROFILE,
    ...userProfileData,
  };

  return profile;
}

export async function getUserIdList() {
  const db = getFirestore();
  const userProfilesCol = collection(db, "user-profiles");
  const q = query(userProfilesCol, where("role", "!=", "admin"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.id);
}
