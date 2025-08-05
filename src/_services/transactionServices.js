
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
  const BASE_URL = `${backendUrl}/api/transactions`;

export const validateTransaction = ({ coaId, accountId, userId, clientName, txnAmount,txnComment, txnRef, txnPayType }) => {
    if (!isNotEmpty(coaId) || !isNotEmpty(accountId) || !isNotEmpty(userId) || !isNotEmpty(clientName) || !isNotEmpty(txnAmount)  || !isNotEmpty(txnComment) || !isNotEmpty(txnRef) || !isNotEmpty(txnPayType)) {
      return "Some required fields are missing.";
    }
    if (!isString(clientName) || !isString(txnComment) || !isString(txnRef) || !isString(txnPayType)) {
      return "Some fields are not strings.";
    }
    if (!isShorterThan(clientName, 50) || !isShorterThan(txnComment, 50) || !isShorterThan(txnRef, 50) || !isShorterThan(txnPayType, 50)) {
      return `Some fields are too long.`;
    }
    if (!isLongerThan(clientName, 3) || !isLongerThan(txnComment, 3) || !isLongerThan(txnRef, 3) || !isLongerThan(txnPayType, 3)) {
      return "Some fields are too short.";
    }
    if (!isValidCode(coaId) || !isValidCode(accountId) || !isValidCode(userId)) {
      return "Some fields are not valid codes.";
    }
    return null;
  };
  
export const saveTransaction = async (transactionData) => {
  const error = validateTransaction(transactionData);
  if (error) throw new Error(`Validation Error: ${error}`);

  const res = await fetch(`${BASE_URL}/`, {
    method: "POST",
      headers: getAuthHeader(),
    body: JSON.stringify(transactionData)
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create account.");
  return result;
};

export const getCashbookTransactions = async (accountId, dateFrom, dateTo) => {
  const res = await fetch(`${BASE_URL}/${accountId}/${dateFrom}/${dateTo}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Transactions not found.");
  return result;
};

export const getGroupedCashbookTransactions = async (accountId, dateFrom, dateTo) => {
  const res = await fetch(`${BASE_URL}/grouped/${accountId}/${dateFrom}/${dateTo}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Transactions not found.");
  return result;
};

export const getIncomeTransactions = async () => {
  const res = await fetch(`${BASE_URL}/`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
  const result = await res.json();
//   console.log(result)
  if (!res.ok) throw new Error(result.message || "Error fetching bank accounts.");
  return result;
};

export const updateTransactionField = async (transactionId, fieldName, newValue) => {
  const allowed = ['accountName', 'accountNumber'];
  if (!allowed.includes(fieldName)) throw new Error("Invalid field for update.");

  const res = await fetch(`${BASE_URL}/${transactionId}`, {
    method: "PATCH",
      headers: getAuthHeader(),
    body: JSON.stringify({ fieldName, newValue })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Update failed.");
  return data;
};
