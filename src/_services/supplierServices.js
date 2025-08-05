
import {
  isNotEmpty,
  isString,
  isShorterThan,
  isLongerThan,
  isInt
} from '../_utils/validators.js';
import { getAuthHeader } from '../_utils/AuthHeaders.js'

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
const BASE_URL = `${backendUrl}/api/suppliers`;

// Create new client
export const createSupplier = async (formData) => {
  const {
    tpin,
    brn,
    bName,
    contactPerson,
    bankName,
    branchName,
    sortCode,
    swiftCode,
    physicalAddress,
    mobileNumber,
    email
  } = formData;

  // Basic validation
  if (
    !isNotEmpty(bName) || !isString(bName) ||
    isLongerThan(bName, 50) || isShorterThan(bName, 3)
  ) {
    throw new Error('Validation Error: Business name must be a valid string (3–100 characters).');
  }
  if (
    !isNotEmpty(physicalAddress) || !isString(physicalAddress) ||
    isLongerThan(physicalAddress, 50) || isShorterThan(physicalAddress, 5)
  ) {
    throw new Error('Validation Error: Business address must be a valid string (5 - 50 characters).');
  }

  if (!isNotEmpty(tpin) || !isNotEmpty(brn) || !isNotEmpty(contactPerson) || !isNotEmpty(bankName)) {
    throw new Error('Validation Error: One or more required fields missing');
  }
  
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        bName: bName.trim(),
        tpin: tpin,
        brn: brn,
        contactPerson: contactPerson,
        bankName: bankName,
        branchName: branchName,
        sortCode: sortCode,
        swiftCode: swiftCode,
        mobileNumber: mobileNumber?.trim() || '',
        physicalAddress: physicalAddress?.trim() || '',
        email:email
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create supplier profile.');
    }

    return {
      status: response.status,
      data
    };
  } catch (error) {
    console.error('❌ Error creating supplier profile:', error);
    throw error;
  }
};

// Update client field
export const updateSupplier = async (supplierId, fieldName, newValue) => {
  if (
    !isNotEmpty(newValue) ||
    isLongerThan(newValue, 50)
  ) {
    throw new Error(
      'Validation Error: invalid value'
    );
  }

  try {
    const response = await fetch(`${BASE_URL}/${supplierId}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ fieldName, newValue })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update supplier profile.');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get all clients
export const getSuppliers = async () => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch supplier profiles.');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Get client by ID
export const getSupplier = async (supplierId) => {
  if (!supplierId || isNaN(supplierId)) {
    throw new Error('Invalid supplier ID.');
  }

  try {
    const response = await fetch(`${BASE_URL}/${supplierId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch supplier profile.');
    }

    return data;
  } catch (error) {
    throw error;
  }
};
