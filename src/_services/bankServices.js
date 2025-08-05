// services/bankServices.js
import {
    isNotEmpty,
    isString,
    isShorterThan,
    isLongerThan,
    isValidCode
  } from '../_utils/validators.js';
  import { getAuthHeader } from '../_utils/AuthHeaders.js';
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const BASE_URL = `${backendUrl}/api/banks`;
  
  export const createBank = async (bankName, bankCodeName) => {
    if (!isNotEmpty(bankName) || !isString(bankName) ||
      isLongerThan(bankName, 100) ||
      isShorterThan(bankName, 4)
    ) {
      throw new Error('Bank name must be a valid string (5–100 characters).');
    }
  
    // ✅ Validate bankCodeName
    if (
      !isNotEmpty(bankCodeName) ||
      !isString(bankCodeName) ||
      isLongerThan(bankCodeName, 20) ||
      isShorterThan(bankCodeName, 2)
    ) {
      throw new Error(
        'Bank code must be 3–20 characters and contain only letters, numbers, dashes, or underscores.'
      );
    }
  
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
      headers: getAuthHeader(),
        body: JSON.stringify({
          bankName: bankName.trim(),
          bankCodeName: bankCodeName.trim()
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create bank');
      }
  
      return data;
    } catch (error) {
      console.error('❌ Error creating bank:', error);
      throw error;
    }
  };

export const updateBankField = async (bankId, fieldName, newValue) => {
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
    const response = await fetch(`${BASE_URL}/${bankId}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ fieldName, newValue })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update bank field.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error updating bank field:', error);
    throw error;
  }
};
  
export const getAllBanks = async () => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch banks.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching banks:', error);
    throw error;
  }
};
  