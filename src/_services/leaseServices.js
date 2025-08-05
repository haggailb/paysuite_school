
import {
  isNotEmpty,
  isString,
  isShorterThan,
  isLongerThan,
  isInt
} from '../_utils/validators.js';
import { getAuthHeader } from '../_utils/AuthHeaders.js'

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
const BASE_URL = `${backendUrl}/api/leases`;

// Create new lease
export const saveLease = async (formData) => {
  const { propertyId, clientId, billing, lease_amount, lease_date, expiry_date, conditions } = formData;

  // Basic validation
  if (!isNotEmpty(propertyId) ||!isNotEmpty(clientId) || !isNotEmpty(billing) || !isNotEmpty(lease_amount) || !isNotEmpty(lease_date) || !isNotEmpty(expiry_date)) {
    throw new Error('Validation Error: One or more required fields missing');
  }

  if (!isInt(clientId) || !isInt(propertyId)) {
    throw new Error('Validation Error: Invalid property or client');
  }
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        propertyId:propertyId, 
        clientId: clientId, 
        billing: billing.trim(), 
        lease_amount:lease_amount, 
        lease_date:lease_date, 
        expiry_date:expiry_date, 
        conditions:conditions
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save lease agreement.');
    }

    return {
      status: response.status,
      data
    };
  } catch (error) {
    console.error('❌ Error creating lease agreement:', error);
    throw error;
  }
};

// terminate lease
export const terminateLease = async (leaseId) => {
  try {
    const response = await fetch(`${BASE_URL}/${leaseId}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to terminate lease agreement.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error terminate lease agreement:', error);
    throw error;
  }
};

// Get all leases
export const getLeases = async (leaseState) => {
  try {
    const response = await fetch(`${BASE_URL}/${leaseState}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch lease agreements.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching lease agreements:', error);
    throw error;
  }
};

// Get lease by ID
export const getLeaase = async (leaseId) => {
  if (!leaseId || isNaN(leaseId)) {
    throw new Error('Invalid lease ID.');
  }

  try {
    const response = await fetch(`${BASE_URL}/${leaseId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch lease agreement.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching lease agreement:', error);
    throw error;
  }
};
