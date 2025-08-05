
import { getAuthHeader } from '../_utils/AuthHeaders.js'

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const BASE_URL = `${backendUrl}/api/coa`;

export const uploadCoaExcel = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload chart of accounts.');
    }

    return data;
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
};

export const getAllCOAs = async (coaType) => {
  const response = await fetch(`${BASE_URL}?coaType=${encodeURIComponent(coaType)}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
  const result = await response.json();
  if (!response.ok) throw result;
  return result;
};

export const getCOAByCode = async (coaCode) => {
  const response = await fetch(`${BASE_URL}/${coaCode}`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
  const result = await response.json();
  if (!response.ok) throw result;
  return result;
};

  