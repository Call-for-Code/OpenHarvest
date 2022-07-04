import React, { createContext, useContext, PropsWithChildren, useState, useEffect } from 'react';
import { EventEmitter } from "eventemitter3";
import { CoopManager } from './coopManager';
import { Organisation } from './organisation';

const localStorageTokenKey = "openharvest_token";

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

export interface AuthProviderProps {
  token?: string
}

export const AuthContext = createContext<AuthProviderType>(undefined!!);

export function AuthProvider({ children, token }: PropsWithChildren<AuthProviderProps>) {
  const auth = useProvideAuth(token)
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export interface AuthProviderType { 
  user: CoopManagerUser | null;
  token?: string;
  isLoggedIn: boolean;
  loading: boolean;
  login: () => void;
  loginFromToken: (token: string) => CoopManagerUser | null;
  checkIfSignedIn: () => Promise<CoopManagerUser | null>;
  signout: () => void;
}

// EventEmitter for Auth
export const AuthEventEmitter = new EventEmitter();

function useProvideAuth(initialToken?: string): AuthProviderType {
  const [user, setUser] = useState<CoopManagerUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(initialToken);

  function handleUser(rawUser: CoopManagerUser | null, token: string | null) {
    setLoading(false);
    
    // @ts-expect-error It's totally valid to save a null value but TS doesn't think so.
    localStorage.setItem(localStorageTokenKey, token);
    
    if (rawUser) {
      const user = rawUser;

      console.log("User Logged In", user);
      
      setUser(user);
      setIsLoggedIn(true);
      AuthEventEmitter.emit("signedIn", user);
      return user
    } else {
      console.log("User Logged Out");

      setUser(null);
      setIsLoggedIn(false);
      AuthEventEmitter.emit("signedOut");
      return null
    }
  }

  function login() {
    if (process.env.NODE_ENV == "production") {
      window.location.href = "/auth/login";
    }
    else {
      window.location.href = "https://localhost:3000/auth/login";
    }
  }

  function loginFromToken(token: string) {
    const segments = token.split(".");
    const user = JSON.parse(atob(segments[1]))
    setToken(token);
    console.log("[Auth] Loaded token from auth transaction");
    return handleUser(user, token);
  }

  async function checkIfSignedIn() {
    setLoading(true);

    const localStorageToken = localStorage.getItem(localStorageTokenKey);

    // Check if a token was passed in
    if (token) {
      // Lets parse the token and get user details
      const segments = token.split(".");
      const user = JSON.parse(atob(segments[1]))
      setToken(token);
      console.log("[Auth] Loaded token from auth transaction");
      return handleUser(user, token);
    }
    else if (localStorageToken !== null) {
      // We also need to handle the case of an expired token
      const segments = localStorageToken.split(".");
      const user = JSON.parse(atob(segments[1]))
      setToken(localStorageToken);
      console.log("[Auth] Loaded token from localStorage");
      return handleUser(user, localStorageToken);
    }
    else {
      try {
        const res = await fetch("/me");
        const userInfo = await res.json();
        console.log(userInfo);
        return handleUser(userInfo, null);
      }
      catch(e) {
        console.log("User is not signed in.")
        return handleUser(null, null);
      }
    }

    // Check if there's a token in local storage

    // else lets ask the server if there's a session active


    
  }

  function signout() {
    if (process.env.NODE_ENV == "production") {
      window.location.href = "/logout";
    }
    else {
      window.location.href = "https://localhost:3000/logout";
    }
  }

  // Check if we're signed in already
  useEffect(() => {
    // console.log("Auth", initialToken);
    checkIfSignedIn();
  }, [])
  

  return {
    user,
    token,
    isLoggedIn,
    loading,
    login,
    checkIfSignedIn,
    loginFromToken,
    signout,
  }
}
