import React from 'react';
import { Home } from "./features/Home";
import LoginPage from "./features/login/LoginPage";
import { LoginVisibilityProvider, useLoginVisibility } from "./features/login/LoginVisibilityProvider";
import { ScheduleVisibilityProvider } from "./features/scheduling/ui/context/SchedulingVisibilityProvider";

function AppContent(): React.ReactElement {
  const { isLoginVisible } = useLoginVisibility();

  return isLoginVisible ? (
    <LoginPage />
  ) : (
    <ScheduleVisibilityProvider>
      <Home />
    </ScheduleVisibilityProvider>
  );
}

function App(): React.ReactElement {
  return (
    <LoginVisibilityProvider>
      <AppContent />
    </LoginVisibilityProvider>
  );
}

export default App;