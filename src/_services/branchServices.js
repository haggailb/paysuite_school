// services/branchServices.js
import {
    isNotEmpty,
    isString,
    isShorterThan,
    isLongerThan,
    isValidCode
  } from '../_utils/validators.js';
import { getAuthHeader } from '../_utils/AuthHeaders.js'
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const BASE_URL = `${backendUrl}/api/branches`;

  // --- ➕ Create a new branch ---
  export const createBranch = async (bankId, branchName, branchCode, sortCode, swiftCode) => {
    console.log('Creating branch with data:', `${bankId}, ${branchName}, ${branchCode}, ${sortCode}, ${swiftCode}`);
    if (!isNotEmpty(bankId) ) {
      return `Invalid bank ID. ${bankId}`;
    }
  
    if (!isNotEmpty(branchName) || !isString(branchName) || !isLongerThan(branchName, 3) || !isShorterThan(branchName, 20)) {
      return 'Branch Name must be 3–20 characters and contain only valid characters.';
    }
  
    if (!isNotEmpty(branchCode) || !isString(branchCode) || !isLongerThan(branchCode, 2) || !isShorterThan(branchCode, 6)) {
      return 'Branch Code must be 5 characters and contain only valid characters.';
    }
  
    if (!isNotEmpty(sortCode) || !isString(sortCode) || !isLongerThan(sortCode, 3) || !isShorterThan(sortCode, 10)) {
      return 'Sort Code must be 3–10 characters and contain only valid characters.';
    }
  
    if (!isNotEmpty(swiftCode)) {
      return 'Swift Code is required.';
    }
  
    const res = await fetch(`${BASE_URL}/`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        bankId: bankId, 
        branchName: branchName, 
        branchCode: branchCode, 
        sortCode: sortCode, 
        swiftCode: swiftCode
      }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create branch.');
    return data;
  };
  
  // --- 📥 Get all branches ---
  export const getAllBranches = async () => {
    const res = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch branches.');
    return data;
  };
  
  // --- ✏️ Update branch field (only supports validated fields) ---
  export const updateBranchField = async (branchId, fieldName, newValue) => {
    if (!branchId || !fieldName || typeof newValue === 'undefined') {
      throw new Error('Validation Error: Required parameters not found.');
    }
  
    const trimmedValue = typeof newValue === 'string' ? newValue.trim() : newValue;
  
    if (!isNotEmpty(trimmedValue) || !isString(trimmedValue) || !isLongerThan(trimmedValue, 2) || !isShorterThan(trimmedValue, 100)) {
      throw new Error('Validation Error: New value is not valid.');
    }
  
    // extra field-specific rules
    if (fieldName === 'branchName') {
      if (!isLongerThan(trimmedValue, 3) || !isShorterThan(trimmedValue, 100)) {
        throw new Error('Validation Error: Branch Name must be 5–100 characters.');
      }
    }
  
    if (fieldName === 'sortCode') {
      if (!isLongerThan(trimmedValue, 3) || !isShorterThan(trimmedValue, 20)) {
        throw new Error('Validation Error: Sort Code must be 3–20 characters.');
      }
    }
  
    const res = await fetch(`${BASE_URL}/${branchId}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      body: JSON.stringify({ fieldName, newValue: trimmedValue }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update branch.');
    return data;
  };
  
  // --- 🔍 Get branch by ID ---
  export const getBranchById = async (branchId) => {
    if (!branchId || isNaN(branchId)) {
      throw new Error('Validation Error: Invalid branch ID.');
    }
  
    const res = await fetch(`${BASE_URL}/${branchId}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch branch.');
    return data;
  };
  