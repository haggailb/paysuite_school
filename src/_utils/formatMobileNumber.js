// Utility function to format a mobile number into the desired format
const formatMobileNumber = (number) => {
    // Ensure the number is a string and remove any non-numeric characters
    const cleanNumber = number.toString().replace(/\D/g, '');
  
    // Check if the number has the correct length (Zambian mobile number: 13 digits, starts with 260)
    if (cleanNumber.length === 12 && cleanNumber.startsWith('260')) {
      // Format the number: +260 979 780 441
      return `+${cleanNumber.slice(0, 3)} ${cleanNumber.slice(3, 6)} ${cleanNumber.slice(6, 9)} ${cleanNumber.slice(9)}`;
    } else {
      // If the number doesn't match the expected format, return the original number
      return number;
    }
  };
  
  export default formatMobileNumber;
  