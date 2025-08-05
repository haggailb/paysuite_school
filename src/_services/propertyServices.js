// services/bankServices.js
import {
  isNotEmpty,
  isString,
  isShorterThan,
  isLongerThan,
  isValidNRC
} from '../_utils/validators.js';
import { getAuthHeader } from '../_utils/AuthHeaders.js'

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
const BASE_URL = `${backendUrl}/api/properties`;

export const saveRentalProperty = async (formData) => {
  const {
    propertyTypeId,
    locationId,
    standNo,
    description,
    floorArea 
  } = formData;

  // Basic validation
  if (
    !isNotEmpty(locationId)
  ) {
    throw new Error('Validation Error: Invalid location.');
  }
  if (
    !isNotEmpty(standNo) || !isString(standNo) ||
    isLongerThan(standNo, 20) || isShorterThan(standNo, 3)
  ) {
    throw new Error('Validation Error: Stand number must be a string ( 3 to 20 characters).');
  }

  if (!isNotEmpty(description) || isLongerThan(description, 50) || isShorterThan(description, 5)) {
    throw new Error('Validation Error: Description must be a string ( 3 to 20 characters)');
  }

  try {
    const response = await fetch(`${BASE_URL}/save-rental-property`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        propertyTypeId: propertyTypeId,
        locationId: locationId,
        propertyNo: standNo.trim(),
        description: description.trim(),
        floorArea: floorArea || 0,
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to save rental property.');
    }

    return {data, status:response.status};
  } catch (error) {
    console.error('❌ Error creating rental property:', error);
    throw error;
  }
};


// Update client field
export const updateProperty = async (propertyId, fieldName, newValue) => {
  if (
    !isNotEmpty(newValue) ||
    !isString(newValue) ||
    !isLongerThan(newValue, 2) ||
    !isShorterThan(newValue, 100)
  ) {
    throw new Error(
      'Validation Error: Field value must be a valid string (3–100 characters).'
    );
  }

  try {
    const response = await fetch(`${BASE_URL}/${propertyId}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ fieldName, newValue })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update client field.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error updating client field:', error);
    throw error;
  }
};

// Get all clients
export const getProperties = async (propertyType) => {
  try {
    const response = await fetch(`${BASE_URL}/${propertyType}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch property deatils.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching property deatils:', error);
    throw error;
  }
};


export const getProperty = async (propertyId) => {
  if (!propertyId || isNaN(propertyId)) {
    throw new Error('Invalid property ID.');
  }

  try {
    const response = await fetch(`${BASE_URL}/get-property/${propertyId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch property details.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching property details:', error);
    throw error;
  }
};

export const getPropertyBalance = async (propertyId) => {
  if (!propertyId || isNaN(propertyId)) {
    throw new Error('Invalid property number.');
  }

  try {
    const response = await fetch(`${BASE_URL}/property-balance/${propertyId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch property balance.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching property balance:', error);
    throw error;
  }
};