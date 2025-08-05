
import { getAuthHeader } from '../_utils/AuthHeaders.js'
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const BASE_URL = `${backendUrl}/api/valuation-roll`;

export const uploadValuationRoll = async (file, updateClient, updateProperty) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("updateClient", updateClient);
    formData.append("updateProperty", updateProperty);
  
    const response = await fetch(`${BASE_URL}/upload-roll`, {
      method: "POST",
      headers: getAuthHeader({includeContentType:false}),
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
  
export const uploadTransactions = async (file, transactionType) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("transactionType", transactionType);
  
    const response = await fetch(`${BASE_URL}/upload-rates-transactions`, {
      method: "POST",
      headers: getAuthHeader({includeContentType:false}),
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
  