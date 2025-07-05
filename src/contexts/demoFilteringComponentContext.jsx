import React, { createContext, useState, useContext, useMemo } from "react";

// Create the context
const SelectedComponentContext = createContext();

// Create the provider component
export const SelectedComponentProvider = ({ children }) => {
  const [selectedUserList, setSelectedUserList] = useState("not Selected");
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0); // 🔥

  const setUserList = (userList, componentId) => {
    setSelectedUserList(userList);
    setSelectedComponentId(componentId);
  };

  const triggerReload = () => {
    setReloadTrigger(prev => prev + 1); // 🔥 increment counter to trigger refresh
  };

  const contextValue = useMemo(() => ({
    selectedUserList,
    setUserList,
    selectedComponentId,
    reloadTrigger, // 🔥 Expose trigger
    triggerReload, // 🔥 Expose function
  }), [selectedUserList, selectedComponentId, reloadTrigger]);

  return (
    <SelectedComponentContext.Provider value={contextValue}>
      {children}
    </SelectedComponentContext.Provider>
  );
};

// Custom hook to use the context
export const useSelectedComponent = () => useContext(SelectedComponentContext);
