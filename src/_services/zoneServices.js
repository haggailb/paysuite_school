
import {
    isNotEmpty,
    isString,
    isShorterThan,
    isLongerThan,
    isValidCode
  } from '../_utils/validators.js';
  import { getAuthHeader } from '../_utils/AuthHeaders.js'
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const BASE_URL = `${backendUrl}/api/zones`;

  // --- ➕ Create a new branch ---
  export const createZone = async (zoneCode, zoneName) => {  
    if (!isNotEmpty(zoneCode) || !isString(zoneCode) || isLongerThan(zoneCode, 5) || isShorterThan(zoneCode, 2)) {
      throw new Error('Validation Error: Zone code must be 2 - 5 characters and contain only valid characters.');
    }
  
    if (!isNotEmpty(zoneName) || !isString(zoneName) || isLongerThan(zoneName, 20) || isShorterThan(zoneName, 4)) {
      throw new Error('Validation Error: Zone name must be 4 - 20 characters.');
    }
        
    const res = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        zoneCode: zoneCode, 
        zoneName: zoneName
      }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create zone.');
    return {
      status: res.status,
      data
    };
  };
  
  export const getZones = async () => {
    const res = await fetch(`${BASE_URL}/`, {
      method: "GET",
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch zones.');
    return data;
  };
  
  export const updateZone = async (zoneId, fieldName, newValue) => {
    if (!zoneId || !fieldName || typeof newValue === 'undefined') {
      throw new Error('Validation Error: Required parameters not found.');
    }
  
    const trimmedValue = typeof newValue === 'string' ? newValue.trim() : newValue;
  
    if (!isNotEmpty(trimmedValue) || !isString(trimmedValue) || !isLongerThan(trimmedValue, 2) || !isShorterThan(trimmedValue, 100)) {
      throw new Error('Validation Error: New value is not valid.');
    }
  
    // extra field-specific rules
    if (fieldName === 'zoneName') {
      if (isLongerThan(trimmedValue, 20) || isShorterThan(trimmedValue, 4)) {
        throw new Error('Validation Error: Zone Name must be 4–20 characters.');
      }
    }
  
    if (fieldName === 'zoneCode') {
      if (isLongerThan(trimmedValue, 5) || isShorterThan(trimmedValue, 2)) {
        throw new Error('Validation Error: Zone Code must be 2–5 characters.');
      }
    }
  
    const res = await fetch(`${BASE_URL}/${zoneId}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ fieldName, newValue: trimmedValue }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update branch.');
    return data;
  };
  
  export const getZone = async (zoneId) => {
    if (!zoneId || isNaN(zoneId)) {
      throw new Error('Validation Error: Invalid business type ID.');
    }
  
    const res = await fetch(`${BASE_URL}/${zoneId}`, {
      method: "GET",
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch branch.');
    return data;
  };
  