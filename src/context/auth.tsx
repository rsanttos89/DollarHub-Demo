import React, { createContext, useState, useContext, ReactNode } from 'react';

type Profile = {
  email: string;
  name: string;
  family_name: string;
  given_name: string;
  picture: string;
};

type Context = {
  profile: Profile;
  setProfile: Function;

  session: boolean, 
  setSession: Function;
}

type ContextProps = {
  children: ReactNode;
};

export const Context = createContext({} as Context);

export default function UpdateProvider({ children }: ContextProps) {
  const [profile, setProfile] = useState({} as Profile);
  const [ session, setSession] = useState(true);

  return (
    <Context.Provider
      value={{
        profile,
        setProfile,

        session, 
        setSession
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function userProfile() {
  const context = useContext(Context);
  const { profile, setProfile } = context;
  return {
    profile,
    setProfile,
  };
}

export function userSessiont() {
  const context = useContext(Context);
  const { session, setSession } = context;
  return {
    session, 
    setSession
  };
}