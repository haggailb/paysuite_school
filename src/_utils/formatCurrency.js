// Utility function to format a number into currency (ZMW) with or without the currency symbol
const formatCurrency = (amount, currency = 'ZMW', withSymbol = true) => {
    const options = {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    };
  
    // If withSymbol is false, remove the currency symbol
    if (!withSymbol) {
      options.style = 'decimal';
    }
  
    return new Intl.NumberFormat('en-ZM', options).format(amount);
  };
  
  export default formatCurrency;
  