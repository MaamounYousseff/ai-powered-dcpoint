import React, { createContext, useContext, useState } from "react";

// ── Types ───────────────────────────────────────────
interface LoginVisibilityContextType {
  isLoginVisible: boolean;
  hideLoginPage: () => void;
}

// ── Context ─────────────────────────────────────────
const LoginVisibilityContext = createContext<LoginVisibilityContextType | undefined>(undefined);

// ── Provider ────────────────────────────────────────
export const LoginVisibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoginVisible, setIsLoginVisible] = useState<boolean>(true);

  const hideLoginPage = () => setIsLoginVisible(false);

  return (
    <LoginVisibilityContext.Provider value={{ isLoginVisible, hideLoginPage }}>
      {children}
    </LoginVisibilityContext.Provider>
  );
};

// ── Hook ────────────────────────────────────────────
export const useLoginVisibility = (): LoginVisibilityContextType => {
  const context = useContext(LoginVisibilityContext);
  if (!context) {
    throw new Error("useLoginVisibility must be used within a LoginVisibilityProvider");
  }
  return context;
};