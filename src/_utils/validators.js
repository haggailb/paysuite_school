// services/validators.js

export const isString = (value) => typeof value === 'string';
export const isInt = (value) => Number.isInteger(Number(value));
export const isShorterThan = (value, max) => isString(value) && value.trim().length < max;
export const isLongerThan = (value, min) => isString(value) && value.trim().length > min;
export const isValidCode = (value) => /^[0-9_-]+$/.test(value);
export const isNotEmpty = (value) => value !== undefined && value !== null && value.toString().trim() !== '';
export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const isValidPhone = (value) => /^\+?[0-9\s-]+$/.test(value);
export const isValidDate = (value) => !isNaN(Date.parse(value));
export const isValidNumber = (value) => !isNaN(value) && isFinite(value);
export const isEmpty = (value) => value == undefined || value == null || value.toString().trim() == '';
export const isValidNRC = (value) => /^\d{6}\/\d{2}\/\d{1}$/.test(value);
export const isValidMobileNumber = (value) => /^260[79]\d{8}$/.test(value);
