import { createContext } from "react";

// Initial state
const initialAuthState = {
  user: null,
  isInitialized: false,
  isAuthenticated: false,
};

// Context initialization
export const AuthContext = createContext({
  ...initialAuthState,
});
