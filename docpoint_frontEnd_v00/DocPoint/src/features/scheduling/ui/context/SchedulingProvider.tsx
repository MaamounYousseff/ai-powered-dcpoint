import { createContext, useState, useContext } from "react";
import type {ReactNode} from "react" 
import type { SchedulingModel } from "../../logic/model/SchedulingModel";



interface SchedulingContextType {
  scheduleValue: SchedulingModel | null;
  fillSchedulingValue: (scheduleValue: SchedulingModel) => void;
}

const SchedulingContext = createContext<SchedulingContextType | undefined>(
  undefined
);

interface SchedulingProviderProps {
  children: ReactNode;
}

export function SchedulingProvider({ children }: SchedulingProviderProps) {
  const [scheduleValue, setScheduleValue] =
    useState<SchedulingModel | null>(null);

  const fillSchedulingValue = (scheduleValue: SchedulingModel) => {
    setScheduleValue(scheduleValue);
  };

  return (
    <SchedulingContext.Provider value={{ scheduleValue, fillSchedulingValue }}>
      {children}
    </SchedulingContext.Provider>
  );
}

export function useSchedulingContext() {
  const context = useContext(SchedulingContext);

  if (!context) {
    throw new Error(
      "useSchedulingContext must be used within SchedulingProvider"
    );
  }

  return context;
}