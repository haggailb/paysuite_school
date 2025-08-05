export  const getAuthHeader = (options = { includeContentType: true, custom: {} }) => {
  const headers = {
    Authorization: `Bearer ${sessionStorage.getItem("PaySuiteJWT")}`,
    ...options.custom
  };

  if (options.includeContentType) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};