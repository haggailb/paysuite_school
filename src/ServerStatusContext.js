// ServerStatusContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

const ServerStatusContext = createContext();
const backendUrl = process.env.REACT_APP_BACKEND_URL;
export const useServerStatus = () => useContext(ServerStatusContext);

export const ServerStatusProvider = ({ children }) => {
  const [isServerOnline, setIsServerOnline] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch(backendUrl, {
          method: "GET",
          cache: "no-store",
        });
        setIsServerOnline(response.ok);
      } catch (error) {
        setIsServerOnline(false);
      }
    };

    // Initial check
    checkServer();

    // Ping every 10 seconds
    const interval = setInterval(checkServer, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ServerStatusContext.Provider value={{ isServerOnline }}>
      {children}
    </ServerStatusContext.Provider>
  );
};
