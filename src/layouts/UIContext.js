import React, { createContext, useState, useContext } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [alert, setAlert] = useState({ show: false, message: "", type: "info" });
  const [loading, setLoading] = useState(false);

  const showAlert = (message, type = "info") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((a) => ({ ...a, show: false })), 5000);
  };

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  return (
    <UIContext.Provider value={{ showAlert, showLoader, hideLoader }}>
      {children}
    </UIContext.Provider>
  );
};
