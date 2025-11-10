import { createContext, useContext, useState, ReactNode } from "react";

interface FocusModeContextType {
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  currentTaskId: string | null;
  setCurrentTaskId: (id: string | null) => void;
  isTimerActive: boolean;
  setIsTimerActive: (active: boolean) => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
}

const FocusModeContext = createContext<FocusModeContextType | undefined>(undefined);

export const FocusModeProvider = ({ children }: { children: ReactNode }) => {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  const toggleFocusMode = () => {
    setIsFocusMode((prev) => !prev);
    if (isFocusMode) {
      // Exiting focus mode
      setIsTimerActive(false);
      setIsSoundEnabled(false);
    }
  };

  const toggleSound = () => {
    setIsSoundEnabled((prev) => !prev);
  };

  return (
    <FocusModeContext.Provider
      value={{
        isFocusMode,
        toggleFocusMode,
        currentTaskId,
        setCurrentTaskId,
        isTimerActive,
        setIsTimerActive,
        isSoundEnabled,
        toggleSound,
      }}
    >
      {children}
    </FocusModeContext.Provider>
  );
};

export const useFocusMode = () => {
  const context = useContext(FocusModeContext);
  if (context === undefined) {
    throw new Error("useFocusMode must be used within a FocusModeProvider");
  }
  return context;
};
