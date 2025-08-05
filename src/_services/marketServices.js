
import {
    isNotEmpty,
    isString,
    isShorterThan,
    isLongerThan,
    isInt
  } from '../_utils/validators.js';
import { getAuthHeader } from '../_utils/AuthHeaders.js'
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const BASE_URL = `${backendUrl}/api/markets`;

  export const createMarket = async (locationId, marketName) => {  
    if (!isNotEmpty(marketName) || !isString(marketName) || isLongerThan(marketName, 20) || isShorterThan(marketName, 4)) {
      throw new Error('Validation Error: Market name must be 4 - 20 characters.');
    }
       
    if (!isNotEmpty(locationId)) {
      throw new Error(`Validation Error: Select a valid location.`);
    }
        
    const res = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        locationId: locationId, 
        marketName: marketName
      }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create market.');
    return {
      status: res.status,
      data
    };
  };
  
  export const getMarkets = async () => {
    const res = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch markets.');
    return data;
  };
  
  export const updateMarket = async (marketId, fieldName, newValue) => {
    if (!marketId || !fieldName || typeof newValue === 'undefined') {
      throw new Error('Validation Error: Required parameters not found.');
    }
  
    const trimmedValue = typeof newValue === 'string' ? newValue.trim() : newValue;
  
    if (!isNotEmpty(trimmedValue) || !isString(trimmedValue) || !isLongerThan(trimmedValue, 2) || !isShorterThan(trimmedValue, 100)) {
      throw new Error('Validation Error: New value is not valid.');
    }
  
    // extra field-specific rules
    if (fieldName === 'marketName') {
      if (isLongerThan(trimmedValue, 20) || isShorterThan(trimmedValue, 4)) {
        throw new Error('Validation Error: Zone Name must be 4–20 characters.');
      }
    }
  
    const res = await fetch(`${BASE_URL}/${marketId}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ fieldName, newValue: trimmedValue }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update location.');
    return data;
  };
  
  export const getLocation = async (marketId) => {
    if (!marketId || isNaN(marketId)) {
      throw new Error('Validation Error: Invalid business type ID.');
    }
  
    const res = await fetch(`${BASE_URL}/${marketId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch location.');
    return data;
  };
  