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
  const BASE_URL = `${backendUrl}/api/clients`;

// Create new client
export const createClient = async (formData) => {
  const {
    nationalId,
    firstName,
    lastName,
    email,
    physicalAddress,
    mobileNumber
  } = formData;

  // Basic validation
  if (
    !isNotEmpty(firstName) || !isString(firstName) ||
    isLongerThan(firstName, 50) || isShorterThan(firstName, 2)
  ) {
    throw new Error('Validation Error: Client name must be a valid string (3–100 characters).');
  }
  if (
    !isNotEmpty(lastName) || !isString(lastName) ||
    isLongerThan(lastName, 50) || isShorterThan(lastName, 2)
  ) {
    throw new Error('Validation Error: Client name must be a valid string (3–100 characters).');
  }

  if (!isNotEmpty(mobileNumber) || isLongerThan(mobileNumber, 13) || isShorterThan(mobileNumber, 10)) {
    throw new Error('Validation Error: Invalid mobile number');
  }
  if (!isNotEmpty(nationalId) || !isValidNRC(nationalId) || isLongerThan(nationalId, 11) || isShorterThan(nationalId, 10)) {
    throw new Error('Validation Error: Invalid national ID');
  }

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        nationalId: nationalId.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        mobileNumber: mobileNumber?.trim() || '',
        email: email?.trim() || '',
        physicalAddress: physicalAddress?.trim() || '',
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create client.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error creating client:', error);
    throw error;
  }
};


// Update client field
export const updateClientField = async (clientId, fieldName, newValue) => {
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
    const response = await fetch(`${BASE_URL}/${clientId}`, {
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
export const getClients = async () => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: getAuthHeader()
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch clients.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching clients:', error);
    throw error;
  }
};

// Get client by ID
export const getClientById = async (clientId) => {
  if (!clientId || isNaN(clientId)) {
    throw new Error('Invalid client ID.');
  }

  try {
    const response = await fetch(`${BASE_URL}/${clientId}`, {
      method: 'GET',
      headers: getAuthHeader()
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch client.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching client:', error);
    throw error;
  }
};
