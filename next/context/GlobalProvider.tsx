"use client";

import React, {
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type Props = {
  children: React.ReactNode;
};

export type User = {
  _id: number;
  name: string;
  weight: number;
  times: number;
};

const initialState = {
  participants: [] as User[],
  setParticipants: (value: SetStateAction<User[]>) => {},
};

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }: Props) => {
  const [participants, setParticipants] = useState<User[]>([]);

  return (
    <GlobalContext.Provider value={{ participants, setParticipants }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
