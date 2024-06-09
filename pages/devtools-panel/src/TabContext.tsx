import { PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from 'react';

const TabContext = createContext<number | undefined>(undefined);

export function useTabId() {
  return useContext(TabContext);
}

export const TabListener = ({ children }: PropsWithChildren) => {
  const ref = useRef(false);
  const [tabId, setTabId] = useState<number>();

  useEffect(() => {
    if (ref.current) {
      return;
    }

    ref.current = true;

    chrome.tabs.query({ active: true, currentWindow: true }, function ([tab]) {
      setTabId(tab?.id);
    });

    chrome.tabs.onActivated.addListener(function (activeInfo) {
      console.log(activeInfo);
      setTabId(activeInfo.tabId);
    });
  }, []);

  return <TabContext.Provider value={tabId}>{children}</TabContext.Provider>;
};
