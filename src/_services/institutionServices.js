
import {
    isNotEmpty,
    isString,
    isShorterThan,
    isLongerThan,
    isValidCode,
    isInt
  } from '../_utils/validators.js';
  import { getAuthHeader } from '../_utils/AuthHeaders.js'
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const BASE_URL = `${backendUrl}/api/institution`;

  // user access roles
  export const saveInfo = async (info) => {
    const res = await fetch(`${BASE_URL}/save-info`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({info}),
    });
    return res.json();
  };
