
import {
    isNotEmpty,
    isString,
    isShorterThan,
    isLongerThan,
    isValidCode
  } from '../_utils/validators.js';
  import { getAuthHeader } from '../_utils/AuthHeaders.js'
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const BASE_URL = `${backendUrl}/api/pTypes`;

  // --- ➕ Create a new branch ---
  export const createLocation = async (propertyTypeCode, propertyTypeName, propertyTypePoundage) => {  
    if (!isNotEmpty(propertyTypeCode) || !isString(propertyTypeCode) || isLongerThan(propertyTypeCode, 5) || isShorterThan(propertyTypeCode, 2)) {
      throw new Error('Validation Error: Type code must be 2 - 5 characters and contain only valid characters.');
    }
  
    if (!isNotEmpty(propertyTypeName) || !isString(propertyTypeName) || isLongerThan(propertyTypeName, 20) || isShorterThan(propertyTypeName, 4)) {
      throw new Error('Validation Error: Type name must be 4 - 20 characters.');
    }
    
    if (!isNotEmpty(propertyTypePoundage) || isNaN(propertyTypePoundage) || propertyTypePoundage < 0 || propertyTypePoundage > 1) {
      throw new Error('Validation Error: Poundage must be a number between 0 and 1.');
    }
    
    const res = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        propertyTypeCode: propertyTypeCode, 
        propertyTypeName: propertyTypeName,
        propertyTypePoundage:propertyTypePoundage
      }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create branch.');
    return {
      status: res.status,
      data
    };
  };
  
  export const getTypes = async () => {
    const res = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch branches.');
    return data;
  };
  
  export const updateType = async (typeId, fieldName, newValue) => {
    if (!typeId || !fieldName || typeof newValue === 'undefined') {
      throw new Error('Validation Error: Required parameters not found.');
    }
  
    const trimmedValue = typeof newValue === 'string' ? newValue.trim() : newValue;
  
    if (!isNotEmpty(trimmedValue) || !isString(trimmedValue) || !isLongerThan(trimmedValue, 2) || !isShorterThan(trimmedValue, 100)) {
      throw new Error('Validation Error: New value is not valid.');
    }
  
    // extra field-specific rules
    if (fieldName === 'propertyTypeName') {
      if (isLongerThan(trimmedValue, 20) || isShorterThan(trimmedValue, 4)) {
        throw new Error('Validation Error: Type Name must be 4–20 characters.');
      }
    }
  
    if (fieldName === 'propertyTypeCode') {
      if (isLongerThan(trimmedValue, 5) || isShorterThan(trimmedValue, 2)) {
        throw new Error('Validation Error: Type Code must be 2–5 characters.');
      }
    }
  
    const res = await fetch(`${BASE_URL}/${typeId}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ fieldName, newValue: trimmedValue }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update branch.');
    return data;
  };
  
  export const getType = async (typeId) => {
    if (!typeId || isNaN(typeId)) {
      throw new Error('Validation Error: Invalid business type ID.');
    }
  
    const res = await fetch(`${BASE_URL}/${typeId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch branch.');
    return data;
  };
  