// Utility function to format date
export const getCurrentDate = (format = 'default') => {
  const date = new Date();

  const optionsShort = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const optionsLong = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
  const optionsDefault = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const optionsTimeShort = { hour: '2-digit', minute: '2-digit', hour12: false };
  const timeStamp = date.getTime();

  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', optionsShort);
    case 'long':
      return date.toLocaleDateString('en-US', optionsLong);
    case 'default':
      return date.toLocaleDateString('en-US', optionsDefault);
    case 'timeShort':
      return date.toLocaleTimeString('en-US', optionsTimeShort);
    case 'timeStamp':
      return timeStamp;
    case 'input':
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    default:
      return date.toLocaleDateString('en-US', optionsDefault);
  }
};

const CurrentDate = ({ format = 'default' }) => {
  const formattedDate = getCurrentDate(format);
  return <>{formattedDate}</>;
};

export default CurrentDate;
