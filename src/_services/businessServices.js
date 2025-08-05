// services/bankServices.js
import {
  isNotEmpty,
  isString,
  isShorterThan,
  isLongerThan,
  isInt
} from '../_utils/validators.js';
import { getAuthHeader } from '../_utils/AuthHeaders.js'

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const BASE_URL = `${backendUrl}/api/business`;

// Create new client
export const createBusiness = async (formData) => {
  const {
    name,
    regNumber,
    clientId,
    typeId,
    locationId,
    marketId,
    physicalAddress,
    mobileNumber
  } = formData;

  // Basic validation
  if (
    !isNotEmpty(name) || !isString(name) ||
    isLongerThan(name, 50) || isShorterThan(name, 3)
  ) {
    throw new Error('Validation Error: Business name must be a valid string (3–100 characters).');
  }
  if (
    !isNotEmpty(physicalAddress) || !isString(physicalAddress) ||
    isLongerThan(physicalAddress, 50) || isShorterThan(physicalAddress, 5)
  ) {
    throw new Error('Validation Error: Business address must be a valid string (5 - 50 characters).');
  }

  if (!isNotEmpty(clientId) || !isNotEmpty(typeId) || !isNotEmpty(locationId) || !isNotEmpty(marketId)) {
    throw new Error('Validation Error: One or more required fields missing');
  }

  if (!isInt(clientId) || !isInt(typeId) || !isInt(locationId) || !isInt(marketId)) {
    throw new Error('Validation Error: One or more required fields missing');
  }
  
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        name: name.trim(),
        clientId: clientId,
        typeId: typeId,
        locationId: locationId,
        marketId: marketId,
        mobileNumber: mobileNumber?.trim() || '',
        physicalAddress: physicalAddress?.trim() || '',
        regNumber: regNumber,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create business profile.');
    }

    return {
      status: response.status,
      data
    };
  } catch (error) {
    console.error('❌ Error creating business profile:', error);
    throw error;
  }
};

// Update client field
export const updateBusinessField = async (businessId, fieldName, newValue) => {
  if (
    !isNotEmpty(newValue) ||
    isLongerThan(newValue, 50)
  ) {
    throw new Error(
      'Validation Error: invalid value'
    );
  }

  try {
    const response = await fetch(`${BASE_URL}/${businessId}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ fieldName, newValue })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update business profile.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error updating business profile:', error);
    throw error;
  }
};

// Get all clients
export const getBusinesses = async () => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch business profiles.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching business profiles:', error);
    throw error;
  }
};

// Get client by ID
export const getBusiness = async (businessId) => {
  if (!businessId || isNaN(businessId)) {
    throw new Error('Invalid business ID.');
  }

  try {
    const response = await fetch(`${BASE_URL}/${businessId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch business profile.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching business profile:', error);
    throw error;
  }
};
