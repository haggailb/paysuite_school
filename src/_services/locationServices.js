
import {
    isNotEmpty,
    isString,
    isShorterThan,
    isLongerThan,
    isInt
  } from '../_utils/validators.js';
import { getAuthHeader } from '../_utils/AuthHeaders.js'
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const BASE_URL = `${backendUrl}/api/locations`;

  export const createLocation = async (zoneId, locationCode, locationName) => {  
    if (!isNotEmpty(locationCode) || !isString(locationCode) || isLongerThan(locationCode, 5) || isShorterThan(locationCode, 2)) {
      throw new Error('Validation Error: Zone code must be 2 - 5 characters and contain only valid characters.');
    }
  
    if (!isNotEmpty(locationName) || !isString(locationName) || isLongerThan(locationName, 20) || isShorterThan(locationName, 4)) {
      throw new Error('Validation Error: Zone name must be 4 - 20 characters.');
    }
       
    if (!isNotEmpty(zoneId)) {
      throw new Error(`Validation Error: Select a valid zone.`);
    }
        
    const res = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        zoneId: zoneId, 
        locationCode: locationCode, 
        locationName: locationName
      }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create location.');
    return {
      status: res.status,
      data
    };
  };
  
  export const getLocations = async () => {
    const res = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch locations.');
    return data;
  };
  
  export const updateLocation = async (locationId, fieldName, newValue) => {
    if (!locationId || !fieldName || typeof newValue === 'undefined') {
      throw new Error('Validation Error: Required parameters not found.');
    }
    
    if (!isNotEmpty(newValue) || isLongerThan(newValue, 50) || isShorterThan(newValue, 1)) {
      throw new Error('Validation Error: New value is not valid.');
    }
  
    // extra field-specific rules
    if (fieldName === 'locationName') {
      if (isLongerThan(newValue, 20) || isShorterThan(newValue, 4)) {
        throw new Error('Validation Error: Zone Name must be 4–20 characters.');
      }
    }
  
    if (fieldName === 'locationCode') {
      if (isLongerThan(newValue, 5) || isShorterThan(newValue, 2)) {
        throw new Error('Validation Error: Zone Code must be 2–5 characters.');
      }
    }
  
    const res = await fetch(`${BASE_URL}/${locationId}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ fieldName, newValue: newValue }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update location.');
    return data;
  };
  
  export const getLocation = async (locationId) => {
    if (!locationId || isNaN(locationId)) {
      throw new Error('Validation Error: Invalid business type ID.');
    }
  
    const res = await fetch(`${BASE_URL}/${locationId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch location.');
    return data;
  };
  