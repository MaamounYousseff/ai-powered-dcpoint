import React, { createContext, useContext, useState } from "react";
import type {ReactNode} from "react";
import AclModel from "../../../../core/security/AclModel";

type SchedulingResponseContextType = [
  AclModel | undefined,
  React.Dispatch<React.SetStateAction<AclModel >>
];

const SchedulingResponseContext = createContext<SchedulingResponseContextType >(null);

export const SchedulingResponseProvider = ({ children }: { children: ReactNode }) => {
  const [response, setResponse] = useState<AclModel>();

  return (
    <SchedulingResponseContext.Provider value={[response, setResponse]}>
      {children}
    </SchedulingResponseContext.Provider>
  );
};

export const useSchedulingResponse = () => {
  const context = useContext(SchedulingResponseContext);
  if (!context)
    throw new Error("useSchedulingResponse must be used within a SchedulingResponseProvider");
  return context;
};