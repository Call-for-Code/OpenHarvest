import React, { createContext, useContext, PropsWithChildren, useState, useEffect } from 'react';
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
  loading: boolean;
  login: () => void;
  checkIfSignedIn: () => Promise<CoopManagerUser | null>;
  signout: () => void;
}

function useProvideAuth(): AuthProviderType {
  const [user, setUser] = useState<CoopManagerUser | null>(null)
  const [loading, setLoading] = useState(true)

  const handleUser = (rawUser: any) => {
    if (rawUser) {
      const user = rawUser;

      setLoading(false)
      setUser(user)
      return user
    } else {
      setLoading(false)
      setUser(null)
      return null
    }
  }

  const login = () => {
    if (process.env.NODE_ENV == "production") {
      window.location.href = "/login";
    }
    else {
      window.location.href = "https://localhost:3000/login";
    }
  }

  const checkIfSignedIn = async () => {
    setLoading(true)
    // return firebase
    //   .auth()
    //   .signInWithPopup(new firebase.auth.GithubAuthProvider())
    //   .then((response) => handleUser(response.user))
    let userInfo = null;
    try {
      const res = await fetch("/me");
      userInfo = await res.json();
      console.log(userInfo);
    }
    catch(e) {
      console.log("User is not signed in.")
    }
    
    return handleUser(userInfo);
  }

  const signout = () => {
    // return firebase
    //   .auth()
    //   .signOut()
    //   .then(() => handleUser(false))
    if (process.env.NODE_ENV == "production") {
      window.location.href = "/logout";
    }
    else {
      window.location.href = "https://localhost:3000/logout";
    }
  }

  // Check if we're signed in already
  useEffect(() => {
    const userSignedInInfo = checkIfSignedIn();
  }, [])
  

  return {
    user,
    loading,
    login,
    checkIfSignedIn,
    signout,
  }
}
