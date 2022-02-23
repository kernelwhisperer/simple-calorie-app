import * as firebaseui from "firebaseui";
import {
  EmailAuthProvider,
  User,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
//
import { UserProfile, getUserProfile } from "./user-profiles.service";

export type setUserFn = (user: User, profile: UserProfile) => void;

export function initAuth(setUser: setUserFn) {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const profile = await getUserProfile(user);
    setUser(user, profile);
  });
}

export function login() {
  const auth = getAuth();
  const ui = new firebaseui.auth.AuthUI(auth);

  ui.start("#firebaseui-auth-container", {
    signInOptions: [EmailAuthProvider.PROVIDER_ID],
    // Other config options...
  });
}
