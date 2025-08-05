import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../components/styles/Login.css';
import Navbar from '../../components/Navbar';
import { userLogin, verifyToken, getModulesByRole } from '../../_services/authServices';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("PaySuiteUserData") || "null");
    if (user) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
  
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
  
    setValidated(true);
  
    try {
      // const result = await userLogin(email);
      // if (!result.token) {
      //   alert(result.message);
      // }else{
        // sessionStorage.setItem('PaySuiteJWTToken', result.token);
        // sessionStorage.setItem('PaySuiteUserData', JSON.stringify(result.user));
        // const verify = await verifyToken(result.token);
        // if(verify.userId){
        //   const modules_response = await getModulesByRole(verify.roleId);
        //   const rows = modules_response.rows;
        //   const moduleNames = [...new Set(rows.map(item => item.moduleName))];
        //   sessionStorage.setItem("allowedModules", JSON.stringify(moduleNames));
        //   setEmail("");
        //   navigate('/home');
        // }else{
        //   alert('Could not verify auth token')
        // }
      // }
    } catch (error) {
      alert(`❌ ${error.message}`);
      console.error("❌ Error submitting form:", error.message);
    }
  };
  
  return (
      <div className="login-card w-100">
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
          <button type="submit" className="login-button">Reset Password</button>
        </form>
      </div>
  );
};

export default ForgotPassword;
