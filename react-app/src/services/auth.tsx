import React, { createContext, useContext, PropsWithChildren, useState, useEffect } from 'react';
import { EventEmitter } from "eventemitter3";
import { CoopManager } from './coopManager';
import { Organisation } from './organisation';

export interface CoopManagerUser {
    id: string;
    email_verified: boolean
    displayName: string;
    given_name: string;
    name: string;
    family_name: string;
    iss: number;
    aud: number;
    sub: number;
    iat: number;
    exp: number;
    accessToken: string;
    refreshToken: string;
    coopManager: CoopManager | null;
    organisations?: Organisation[];
    selectedOrganisation?: Organisation;
}

export const AuthContext = createContext<AuthProviderType>(undefined!!);

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const auth = useProvideAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export interface AuthProviderType { 
  user: CoopManagerUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: () => void;
  checkIfSignedIn: () => Promise<CoopManagerUser | null>;
  signout: () => void;
}

// EventEmitter for Auth
export const AuthEventEmitter = new EventEmitter();

function useProvideAuth(): AuthProviderType {
  const [user, setUser] = useState<CoopManagerUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  function handleUser(rawUser: any) {
    setLoading(false);
    if (rawUser) {
      const user = rawUser;
      
      setUser(user);
      setIsLoggedIn(true);
      AuthEventEmitter.emit("signedIn", user);
      return user
    } else {
      setUser(null);
      setIsLoggedIn(false);
      AuthEventEmitter.emit("signedOut");
      return null
    }
  }

  function login() {
    if (process.env.NODE_ENV == "production") {
      window.location.href = "/login";
    }
    else {
      window.location.href = "https://localhost:3000/login";
    }
  }

  async function checkIfSignedIn() {
    setLoading(true);

    try {
      const res = await fetch("/me");
      const userInfo = await res.json();
      console.log(userInfo);
      return handleUser(userInfo);
    }
    catch(e) {
      console.log("User is not signed in.")
      return handleUser(null);
    }
  }

  function signout() 
  {
    if (process.env.NODE_ENV == "production") {
      window.location.href = "/logout";
    }
    else {
      window.location.href = "https://localhost:3000/logout";
    }
  }

  // Check if we're signed in already
  useEffect(() => {
    checkIfSignedIn();
  }, [])
  

  return {
    user,
    isLoggedIn,
    loading,
    login,
    checkIfSignedIn,
    signout,
  }
}
