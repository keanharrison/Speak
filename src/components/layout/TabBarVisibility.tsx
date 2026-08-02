"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type TabBarVisibilityContextValue = {
  tabBarVisible: boolean;
  setTabBarVisible: (visible: boolean) => void;
};

const TabBarVisibilityContext = createContext<TabBarVisibilityContextValue>({
  tabBarVisible: true,
  setTabBarVisible: () => undefined,
});

export function TabBarVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tabBarVisible, setTabBarVisible] = useState(true);
  const value = useMemo(
    () => ({ tabBarVisible, setTabBarVisible }),
    [tabBarVisible],
  );

  return (
    <TabBarVisibilityContext.Provider value={value}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
}

export function useTabBarVisibility() {
  return useContext(TabBarVisibilityContext);
}
