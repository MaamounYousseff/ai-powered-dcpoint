import { createContext, useContext, useState } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────
const ScheduleContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ScheduleVisibilityProvider({ children }) {
  const [isScheduleVisible, setIsScheduleVisible] = useState(true);

  const showSchedulePage = () => setIsScheduleVisible(true);

  const closeSchedulePage = () => setIsScheduleVisible(false);

  return (
    <ScheduleContext.Provider
      value={{
        isScheduleVisible,
        showSchedulePage,
        closeSchedulePage,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useScheduleVisibility() {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error("useSchedule must be used within a ScheduleVisibilityProvider");
  }
  return context;
}