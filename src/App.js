import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth_management/Login';
import Home from './pages/Home';
import { useServerStatus } from "./ServerStatusContext";
import ServerOfflineOverlay from "./OfflineOverlay";


function App() {
  const { isServerOnline } = useServerStatus();
  return (
    <>
      {!isServerOnline && <ServerOfflineOverlay />}
      <div className={isServerOnline ? "" : "blurred"}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
