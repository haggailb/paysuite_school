
import { getAuthHeader } from '../_utils/AuthHeaders.js'

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const BASE_URL = `${backendUrl}/api/bulk-processing`;

export const processRates = async (parameters) => {
  const response = await fetch(`${BASE_URL}/process-rates`, {
    method: "POST",
      headers: getAuthHeader(),
    body: JSON.stringify(
      parameters
    ),
  });

  if (!response.ok) {
    let errorMessage = "Unknown error occurred";
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
    throw new Error(`${errorMessage}`);
  }

  return await response.json();
};
  
export const processRatesFromFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    const response = await fetch(`${BASE_URL}/process-rates-from-file`, {
      method: "POST",
      headers: getAuthHeader(),
      body: formData,
    });
  
    if (!response.ok) {
      let errorMessage = "Unknown error occurred";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
      } catch (err) {
        errorMessage = await response.text();
      }
  
      throw new Error(`${errorMessage}`);
    }
  
    return await response.json();
  };
  
export const fetchBills = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  
  try {
    const response = await fetch(`${BASE_URL}/get-bills?${query}`, {
      method: "GET",
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch property bills');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error.message);
    return [];
  }
};

export const fetchBillsWithBalances = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  
  try {
    const response = await fetch(`${BASE_URL}/get-bills-with-balances?${query}`, {
      method: "GET",
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch property bills');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error.message);
    return [];
  }
};

export const getPropertyStatement = async (filters) => {
  const {propertyId, startDate, endDate } = filters
  try {
    const response = await fetch(`${BASE_URL}/get-property-statement/${propertyId}/${startDate}/${endDate}`, {
      method: "GET",
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch property statement');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error.message);
    return [];
  }
};
