import React, { ReactNode, createContext, useContext, useState } from "react";
import { User } from "firebase/auth";
import { UserProfile } from "../api/user-profiles.service";
import { noop } from "../utils";

type UserState = {
  profile?: UserProfile;
  user?: User;
};

interface UserContextProviderProps {
  children?: ReactNode;
}

export type UserContextAPI = [
  UserState,
  (
    value: Partial<UserState> | ((prevState: UserState) => Partial<UserState>)
  ) => void
];

const UserContext = createContext<UserContextAPI>([{}, noop]);

export const UserContextProvider = (props: UserContextProviderProps) => {
  const { children } = props;

  const [settings, set] = useState<UserState>({});
  // console.log("UserContextProvider: render");

  return (
    <UserContext.Provider value={[settings, set]}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
