
  import {
    isNotEmpty,
    isString,
    isShorterThan,
    isLongerThan,
    isValidMobileNumber
  } from '../_utils/validators.js';
  import { getAuthHeader } from '../_utils/AuthHeaders.js';
  
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const BASE_URL = `${backendUrl}/api/sms-service`;

  export const sendSingleSMS = async (number, message, senderId) => {
    if (!isNotEmpty(number) || !isValidMobileNumber(number) || number === '260970000000' || number === 260970000000) {
      throw new Error('Validation Error: Invalid mobile number. Number should be formatted as 260*********.' );
    }
    
    if (!isNotEmpty(message) || !isString(message) || isShorterThan(message, 5) || isLongerThan(message, 160)) {
      throw new Error('Validation Error: Invalid message. Must be a string between 5 and 160 characters long.' );
    }
    if (!isNotEmpty(senderId) || !isString(senderId)) {
      throw new Error('Validation Error: Invalid sender ID.' );
    }

    const res = await fetch(`${BASE_URL}/send-single`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        number: number,
        message: message.trim(),
        senderId: senderId.trim()
      }),
    });

    return res.json();
  };

  export const sendMultipleSMS = async (messages) => {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error('Validation Error: Messages array cannot be empty.');
    }

    for (let msg of messages) {
      const { number, message, senderId } = msg;

      if (!isNotEmpty(number) || !isValidMobileNumber(number) || number === '260970000000' || number === 260970000000) {
        throw new Error('Validation Error: Invalid mobile number. Number should be formatted as 260*********.');
      }

      if (!isNotEmpty(message) || !isString(message) || isShorterThan(message, 5) || isLongerThan(message, 160)) {
        throw new Error('Validation Error: Invalid message. Must be a string between 5 and 160 characters long.');
      }

      if (!isNotEmpty(senderId) || !isString(senderId)) {
        throw new Error('Validation Error: Invalid sender ID.');
      }
    }

    const res = await fetch(`${BASE_URL}/send-multiple`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        messages: messages
      }),
    });

    return res.json();
  };


