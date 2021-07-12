import { FC, useState, useContext, createContext, ReactNode } from 'react';

const UIContext = createContext<{
  notification: string | null;
  notify: (notification: string | null) => void;
  showErrorNotification: (e: any | null) => void;
} | null>(null);

export const UIProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, notify] = useState<string | null>(null);

  const showErrorNotification = (e: any) => {
    notify(e.message);
  };

  return (
    <UIContext.Provider
      value={{
        notification,
        notify,
        showErrorNotification,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('Missing UI context');
  }
  const { notification, notify, showErrorNotification } = context;

  return {
    notification,
    notify,
    showErrorNotification,
  };
}
