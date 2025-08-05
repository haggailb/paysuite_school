import React, { createContext, useState, useEffect } from 'react';
import { userLogOut } from './_services/authServices';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem('PaySuiteUserData');
      if (storedUser && storedUser !== 'undefined') {
        return JSON.parse(storedUser);
      }
    } catch (err) {
      console.error('Error parsing stored user data:', err);
    }
    return null;
  });

  const [token, setToken] = useState(() => sessionStorage.getItem('PaySuiteJWT') || '');

  const login = (userData, jwt) => {
    sessionStorage.setItem('PaySuiteUserData', JSON.stringify(userData));
    sessionStorage.setItem('PaySuiteJWT', jwt);
    setUser(userData);
    setToken(jwt);
  };

  const logout = async () => {
    try {
      await userLogOut(token);
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setToken('');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

