import * as firebaseui from "firebaseui";
import {
  EmailAuthProvider,
  User,
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
//
import { UserProfile, getUserProfile } from "./user-profiles.service";

export type setUserFn = (user: User, profile: UserProfile) => void;

let ui: firebaseui.auth.AuthUI;

export function initAuth() {
  const auth = getAuth();
  ui = new firebaseui.auth.AuthUI(auth);
}

export function subscribeToAuthChanges(setUser: setUserFn) {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const profile = await getUserProfile(user);
    setUser(user, profile);
  });
}

export function logIn() {
  ui.start("#firebaseui-auth-container", {
    signInOptions: [EmailAuthProvider.PROVIDER_ID],
    // Other config options...
  });
}

export function requestSignOut() {
  const auth = getAuth();
  return signOut(auth);
}
