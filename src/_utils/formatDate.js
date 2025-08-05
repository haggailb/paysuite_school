// Utility function to format date
const formatDate = (dbDate, format = 'default') => {
  const date = new Date(dbDate);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date provided');
  }

  const options = {day: "2-digit", month: "short",year: "2-digit"};
  // const optionsShort = { day: '2-digit', month: 'short', year: 'numeric' };
  const optionsLong = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
  const optionsDefault = { year: 'numeric', month: '2-digit', day: '2-digit' };

  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', options);
    case 'long':
      return date.toLocaleDateString('en-US', optionsLong);
    case 'default':
      return date.toLocaleDateString('en-US', optionsDefault);
    case 'input':
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    default:
      return date.toLocaleDateString('en-US', optionsDefault);
  }
};

export default formatDate;