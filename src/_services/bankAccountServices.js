
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
const BASE_URL = `${backendUrl}/api/bank-accounts`;

export const validateBankAccount = ({ branchId, accountName, accountNumber }) => {
    if (!isNotEmpty(accountName) || !isString(accountName) || isLongerThan(accountName, 50) || isShorterThan(accountName, 5)) {
      return "Account name must be 5–50 characters.";
    }
  
    if (!isNotEmpty(accountNumber) || isLongerThan(accountNumber, 13) || isShorterThan(accountNumber, 9)) {
      return `Account number must be 9–13 digits: ${accountNumber}`;
    }
  
    if (!isNotEmpty(branchId) || isLongerThan(branchId.toString(), 6) || isShorterThan(branchId.toString(), 1)) {
      return "Invalid branch ID.";
    }
  
    return null;
  };
  
export const createBankAccount = async (accountData) => {
  const error = validateBankAccount(accountData);
  if (error) throw new Error(`Validation Error(s): ${error}`);

  const res = await fetch(`${BASE_URL}/`, {
    method: "POST",
      headers: getAuthHeader(),
    body: JSON.stringify(accountData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create account.");
  return data;
};

export const getBankAccounts = async () => {
  const res = await fetch(`${BASE_URL}/`, {
    method: 'GET',
      headers: getAuthHeader(),
  });
  const result = await res.json();
//   console.log(result)
  if (!res.ok) throw new Error(`Error fetching bank accounts. Error: ${result.message}`);
  return result;
};

export const getBankAccountById = async (accountKey) => {
  const res = await fetch(`${BASE_URL}/${accountKey}`, {
    method: 'GET',
      headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Account not found.");
  return data;
};

export const updateBankAccountField = async (accountId, fieldName, newValue) => {
  const allowed = ['accountName', 'accountNumber'];
  if (!allowed.includes(fieldName)) throw new Error("Invalid field for update.");

  const res = await fetch(`${BASE_URL}/${accountId}`, {
    method: "PATCH",
      headers: getAuthHeader(),
    body: JSON.stringify({ fieldName, newValue })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Update failed.");
  return data;
};
