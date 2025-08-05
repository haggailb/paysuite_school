
import React from "react";
import "./OfflineOverlay.css";
import { FaConnectdevelop, FaServer } from "react-icons/fa";

const ServerOfflineOverlay = () => {
  return (
    <div className="offline-overlay">
      <div className="offline-content">
        <FaServer size={100} className="text-danger" />
        <h2>Server Offline</h2>
        <p>The system will reconnect automatically.</p>
      </div>
    </div>
  );
};

export default ServerOfflineOverlay;
