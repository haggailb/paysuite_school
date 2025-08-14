import React, { useState, useEffect, useContext } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './styles/Login.css';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";


const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
  
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
  
    setValidated(true);

  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  if (error) return <div className="text-danger text-center p-4">❌ Error: {error}</div>;

  return (
    <div className="login-container">
        {/* <Navbar /> */}
      <div className="login-card">
        <h2 className="login-title">Welcome To <br></br> <strong>Magyne</strong> </h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Password:</Form.Label>
            <div className="password-input-container">
              <Form.Control
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
          </Form.Group>
          <Button type='submit' className="btn-primary w-100"> Login </Button>
          <div className="forgot-password text-danger">
            <a href="#">Forgot Password?</a>
          </div>
        </Form>
      </div>

    </div>
    
  );
};

export default LoginPage;
