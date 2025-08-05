import React, { useState, useEffect, useContext } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../components/styles/Login.css';
import Navbar from '../../components/Navbar';
import { userLogin, verifyToken, getModulesByRole } from '../../_services/authServices';
import { useNavigate } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { useMessageModal } from '../../components/ModalContext';
import GlassLoader from '../../components/GlassLoader';
import { AuthContext } from '../../AuthProvider';


const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { showMessageModal } = useMessageModal();
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem('PaySuiteUserData');
      if (storedUser && storedUser !== 'undefined') {
        return JSON.parse(storedUser);
      }
    } catch (err) {
      console.error('Error parsing stored user data:', err);
    }
    return null;
  });


  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  },);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
  
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
  
    setValidated(true);
    setLoading(true);
  
    try {
      const result = await userLogin(email, password);
      if (!result.token) {
        showMessageModal({
          heading: 'Authentication Error!',
          message: `Error: ${result.message}`,
          messageType: 'error',
        });
      }else{
        login(result.user, result.token);
        const verify = await verifyToken(result.token);
        if(verify.userId){
          const modules_response = await getModulesByRole(verify.roleId);
          const rows = modules_response.rows;
          const moduleNames = [...new Set(rows.map(item => item.moduleName))];
          sessionStorage.setItem("allowedModules", JSON.stringify(moduleNames));
          sessionStorage.setItem("lastActive", Date.now());
          setEmail("");
          setPassword("");
          navigate('/home');
        }else{
          showMessageModal({
            heading: 'Security Alert!',
            message: `${verify.message}`,
            messageType: 'error',
          });
        }
      }
    } catch (error) {
      showMessageModal({
        heading: 'Login Failed!',
        message: `Error: ${error.message === 'Failed to fetch' ? 'Server could not be reached.' : error}`,
        messageType: 'error',
      });
    } finally{
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  if (loading)  return (
    <div className="form-container mb-5 position-relative">
      <GlassLoader show={loading} />
    </div>
  );

  if (error) return <div className="text-danger text-center p-4">❌ Error: {error}</div>;

  return (
    <div className="login-container">
        <Navbar />
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <form noValidate validated={validated} onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="toggle-password" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button type="submit" className="login-button">Login</button>
          <div className="forgot-password">
            <a href="#forgot-password" onClick={handleShowModal}>Forgot Password?</a>
          </div>
        </form>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-center text-white">Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ForgotPassword />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LoginPage;
