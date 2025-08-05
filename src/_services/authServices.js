
  import {
    isNotEmpty,
    isString,
    isShorterThan,
    isLongerThan,
    isValidCode,
    isInt
  } from '../_utils/validators.js';
  import { getAuthHeader } from '../_utils/AuthHeaders.js';
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const BASE_URL = `${backendUrl}/api/auth`;

  // user access roles
  export const createUserRole = async (formData) => {
    const { roleName, roleDesc } = formData;
    const res = await fetch(`${BASE_URL}/create-role`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        roleName: roleName.trim(),
        roleDesc: roleDesc.trim()
      }),
    });
    return res.json();
  };

export const updateField = async (roleId, fieldName, newValue) => {
  if (
    !isNotEmpty(newValue) ||
    !isString(newValue) ||
    isLongerThan(newValue, 100) ||
    isShorterThan(newValue, 5)
  ) {
    throw new Error(
      'Validation Error: Field value must be a valid string (5–100 characters).'
    );
  }
  try {
    const response = await fetch(`${BASE_URL}/update-role/${roleId}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ fieldName, newValue })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'User access role update failed.');
    }

    return result;
  } catch (error) {
    console.error('❌ Error updating User access role field:', error);
    throw error;
  }
};

export const getUserRoles = async () => {
  try {
    const response = await fetch(`${BASE_URL}/user-roles`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const results = await response.json();

    if (!response.ok) {
      throw new Error('Unable to fetch user access roles.');
    }

    return results;
  } catch (error) {
    console.error('❌ Error fetching user access roles:', error);
    throw error;
  }
};
  
export const getModules = async () => {
  try {
    const response = await fetch(`${BASE_URL}/modules`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const results = await response.json();

    if (!response.ok) {
      throw new Error('Unable to fetch system modules.');
    }

    return results;
  } catch (error) {
    console.error('❌ Error fetching system modules:', error);
    throw error;
  }
};

export const addRoleModule = async (roleId, moduleId) => {
  if (!isNotEmpty(roleId) || !isNotEmpty(moduleId)) {
    throw new Error(`Validation Error: Role: (${roleId}) and Module: (${moduleId}) required.`);
  }
  const response = await fetch(`${BASE_URL}/add-role-module`, {
    method: 'POST',
      headers: getAuthHeader(),
    body: JSON.stringify({
      roleId: roleId,
      moduleId: moduleId
    }),
  });
  
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Unable to add module.');
  }
  return result;
};

export const deleteRoleModule = async (roleId, moduleId) => {
  if (!isNotEmpty(roleId) || !isNotEmpty(moduleId)) {
    throw new Error('Validation Error: Role Module required.');
  }
  const response = await fetch(`${BASE_URL}/delete/${roleId}/${moduleId}`, {
    method: 'DELETE',
      headers: getAuthHeader(),
    body: JSON.stringify({}),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Unable to remove module.');
  }
  return result;
};

export const getRoleModules = async (roleId) => {
  try {
    const response = await fetch(`${BASE_URL}/role-modules/${roleId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const results = await response.json();

    if (!response.ok) {
      throw new Error('Unable to fetch role modules.');
    }

    return results;
  } catch (error) {
    console.error('❌ Error fetching role modules:', error);
    throw error;
  }
};

export const createUser = async (formData) => {
  const { roleId, userName, email, contact } = formData

  if (!isNotEmpty(userName) || !isString(userName) || isLongerThan(userName, 20) || isShorterThan(userName, 5)) {
    throw new Error('Validation error: User name must be a string of 5-20 characters');
  }

  if (!isNotEmpty(email) || !isString(email)) {
    throw new Error('Validation error: Invalid email address');
  }
  
  if (!isNotEmpty(roleId) || !isInt(roleId)) {
    throw new Error('Validation error: Invalid user role');
  }
  
  if (!isNotEmpty(contact)) {
    throw new Error('Validation error: Invalid mobile number');
  }
  
  const response = await fetch(`${BASE_URL}/create-user`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({roleId:roleId, userName:userName, email:email, contact:contact}),
  });
  
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Unable to add user account.');
  }
  return result;
};

export const updateUser = async (userId, fieldName, newValue) => {
  if (
    !isNotEmpty(userId) ||
    !isNotEmpty(fieldName)||
    !isNotEmpty(newValue)
  ) {
    throw new Error(
      'Validation Error: Invalid user ID or role name.'
    );
  }
  try {
    const response = await fetch(`${BASE_URL}/update-user/${userId}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ userId, fieldName, newValue })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'User update failed.');
    }

    return result;
  } catch (error) {
    console.error('❌ Error updating User access role field:', error);
    throw error;
  }
};

export const getUsers = async (roleId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${roleId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const results = await response.json();

    if (!response.ok) {
      throw new Error('Unable to fetch user access roles.');
    }
    return results;
  } catch (error) {
    console.error('❌ Error fetching user access roles:', error);
    throw error;
  }
};
  
export const userLogin = async (email, password) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
      headers: getAuthHeader(),
    body: JSON.stringify({email, password}),
  });
  const result = await response.json();
  if(result.token){
    sessionStorage.setItem('PaySuiteJWT', result.token);
    sessionStorage.setItem('PaySuiteUserData', JSON.stringify(result.user));
  }
  return result;
};  

export const verifyToken = async (token) => {
  if (!token) {
    throw new Error('Validation Error: invalid auth token.');
  }
  const res = await fetch(`${BASE_URL}/verify`, {
    method: 'GET',
      headers: getAuthHeader(),
    mode: 'cors',
  });
  const result = res.json();
  return result;
};

export const getModulesByRole = async (roleId) => {
  try {
    const response = await fetch(`${BASE_URL}/role-modules/${roleId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error('Unable to fetch user access roles.');
    }
    
    return response.json();
  } catch (error) {
    throw new Error('Unable to fetch user access roles.', error);
  }
};

export const userLogOut = async (token) => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeader(),
    });

    // Clear specific items
    sessionStorage.removeItem('PaySuiteJWT');
    sessionStorage.removeItem('PaySuiteUserData');
    sessionStorage.removeItem('allowedModules');
    sessionStorage.removeItem('lastActive');
  } catch (e) {
    console.error('Logout API call failed:', e);
    throw new Error('Unable to log out.');
  }

  // Fallback to ensure all sessionStorage is cleared
  sessionStorage.clear();
};
