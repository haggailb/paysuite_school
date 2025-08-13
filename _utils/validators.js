const isString = (value) => typeof value === 'string';
const isInt = (value) => Number.isInteger(value);
const isShorterThan = (value, max) => isString(value) && value.trim().length < max;
const isLongerThan = (value, min) => isString(value) && value.trim().length > min;
const isValidCode = (value) => /^[A-Za-z0-9_-]+$/.test(value);
const isNumber = (value) => /^[0-9_-]+$/.test(value);
const isEmpty = (value) => value == undefined && value == null && value.toString().trim() == '';
const isValidNRC = (value) => /^\d{6}\/\d{2}\/\d{1}$/.test(value);
const isValidMobileNumber = (value) => /^260[79]\d{8}$/.test(value);

module.exports = {
  isString,
  isInt,
  isShorterThan,
  isLongerThan,
  isValidCode,
  isNumber,
  isEmpty,
  isValidNRC,
  isValidMobileNumber
};
