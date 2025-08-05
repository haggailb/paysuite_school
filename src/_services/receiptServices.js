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
const BASE_URL = `${backendUrl}/api/receipts`;

// Create new client
export const saveRatesReceipt = async (receipt) => {
  const { property, accountId, amountDue, txnAmount, balance, txnPayType, txnRef } = receipt;
  // Basic validation
  if (
    !isNotEmpty(property) || typeof property  != 'object'
  ) {
    throw new Error('Validation Error: Invalid property details.');
  }
  if (
    !isNotEmpty(accountId) || !isInt(accountId) || accountId === 0
  ) {
    throw new Error('Validation Error: Invalid account number.');
  }

  if (!isNotEmpty(txnAmount) || !isNotEmpty(txnPayType) || !isNotEmpty(txnRef)) {
    throw new Error('Validation Error: One or more required fields missing');
  }

  try {
    const response = await fetch(`${BASE_URL}/save-rates-receipt`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        property: property,
        accountId: accountId,
        amountDue: amountDue,
        txnAmount: txnAmount,
        balance: balance,
        txnRef: txnRef.trim(),
        txnType: 1,
        txnPayType: txnPayType.trim(),
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save receipt.');
    }

    return {
      status: response.status,
      receipt: data
    };
  } catch (error) {
    console.error('❌ Error saving receipt:', error);
    throw error;
  }
};
  // CONFIGURE RECEIPT NUMBERING
export const saveSerial = async (formData) => {
  const { userId, receiptNo, comment } = formData;
  // Basic validation

  if (!isNotEmpty(receiptNo) || !isNotEmpty(comment) || !isNotEmpty(userId)) {
    throw new Error('Validation Error: One or more required fields missing');
  }

  try {
    const response = await fetch(`${BASE_URL}/configure-receipt-serial`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        userId: userId,
        receiptNo: receiptNo,
        comment: comment.trim(),
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to save receipt configuration.');
    }

    return {
      status: response.status,
      data
    };
  } catch (error) {
    console.error('❌ Error saving receipt configuration:', error);
    throw error;
  }
};

// export const updateBusinessField = async (receiptNo, fieldName, newValue) => {
//   if (
//     !isNotEmpty(newValue) ||
//     isLongerThan(newValue, 50)
//   ) {
//     throw new Error(
//       'Validation Error: invalid value'
//     );
//   }

//   try {
//     const response = await fetch(`${BASE_URL}/${receiptNo}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ fieldName, newValue })
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || 'Failed to update business profile.');
//     }

//     return data;
//   } catch (error) {
//     console.error('❌ Error updating business profile:', error);
//     throw error;
//   }
// };

export const getReceipts = async (filters) => {
  const { coaId, userId, startDate, endDate } = filters;
  
  // if (!coaId || !userId || !startDate || !endDate) {
  //   throw new Error('Validation Error: Missing required parameters.');
  // }

  try {
    const response = await fetch(`${BASE_URL}/${coaId}/${userId}/${startDate}/${endDate}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Server error: Failed to fetch receipts.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching receipts:', error);
    throw error;
  }
};

export const getSerials = async (filters) => {
  const { userId, startDate, endDate } = filters;
  
  // if (!coaId || !userId || !startDate || !endDate) {
  //   throw new Error('Validation Error: Missing required parameters.');
  // }

  try {
    const response = await fetch(`${BASE_URL}/fetch-serials/${userId}/${startDate}/${endDate}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Server error: Failed to fetch receipt numbers.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching receipt numbers:', error);
    throw error;
  }
};

export const getReceipt = async (receiptNo) => {
  if (!receiptNo || isNaN(receiptNo)) {
    throw new Error('Invalid receipt number.');
  }

  try {
    const response = await fetch(`${BASE_URL}/receipt/${receiptNo}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch receipt number details.');
    }

    return data;
  } catch (error) {
    console.error('❌ Error fetching receipt number details:', error);
    throw error;
  }
};
