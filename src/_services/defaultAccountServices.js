
import {
    isNotEmpty,
    isString,
    isShorterThan,
    isLongerThan,
    isValidCode
  } from '../_utils/validators.js';
import { getAuthHeader } from '../_utils/AuthHeaders.js'
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const BASE_URL = `${backendUrl}/api/default-accounts`;

  export const createDefaultAccount = async (accountId, name) => {  
    if (!isNotEmpty(accountId)) {
      throw new Error('Validation Error: Account is required.');
    }
  
    if (!isNotEmpty(name) || !isString(name) || isLongerThan(name, 20) || isShorterThan(name, 3)) {
      throw new Error('Validation Error: service name must be 4 - 20 characters.');
    }
        
    const res = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        accountId: accountId, 
        name: name
      }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create service.');
    return {
      status: res.status,
      data
    };
  };
  
  export const getDefaultAccounts = async () => {
    const res = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch services.');
    return data;
  };
  
  export const updateDefaultAccount = async (defaultId, fieldName, newValue) => {
    if (!defaultId || !fieldName || typeof newValue === 'undefined') {
      throw new Error('Validation Error: Required parameters not found.');
    }
    
    if (!isNotEmpty(newValue)) {
      throw new Error('Validation Error: New value is not valid.');
    }
  
    // extra field-specific rules
    if (fieldName === 'name') {
      if (isLongerThan(newValue, 20) || isShorterThan(newValue, 4)) {
        throw new Error('Validation Error: service Name must be 4–20 characters.');
      }
    }
  
    const res = await fetch(`${BASE_URL}/${defaultId}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ fieldName, newValue: newValue }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update default account.');
    return data;
  };
  
  export const getDefaultAccount = async (name) => {
    if (!name) {
      throw new Error(`Validation Error: Invalid service name: ${name}`);
    }
  
    const res = await fetch(`${BASE_URL}/${name}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch default account.');
    return data;
  };
  