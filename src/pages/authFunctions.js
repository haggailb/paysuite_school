import { registerUser, loginUser } from './authService';

// Handle user registration
export const registerUserFn = async (formData, setMessage, navigate) => {
  try {
    const res = await registerUser(formData);

    if (res.message === 'User registered successfully') {
      setMessage({ type: 'success', text: res.message });
      navigate('/login'); // redirect after successful registration
    } else {
      setMessage({ type: 'error', text: res.message });
    }
  } catch (err) {
    setMessage({ type: 'error', text: 'An error occurred during registration.' });
    console.error(err);
  }
};

// Handle user login
export const loginUserFn = async (credentials, setMessage, navigate) => {
  try {
    const res = await loginUser(credentials);

    if (res.token) {
      sessionStorage.setItem('jwtToken', res.token);
      sessionStorage.setItem('userData', JSON.stringify(res.user));
      navigate('/dashboard'); // redirect after successful login
    } else {
      setMessage({ type: 'error', text: res.message || 'Login failed' });
    }
  } catch (err) {
    setMessage({ type: 'error', text: 'An error occurred during login.' });
    console.error(err);
  }
};

// Handle logout
export const logoutUserFn = (navigate) => {
  sessionStorage.removeItem('jwtToken');
  sessionStorage.removeItem('userData');
  navigate('/login');
};
