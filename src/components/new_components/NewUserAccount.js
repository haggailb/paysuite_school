import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, InputGroup , Tabs, Tab, Alert, Row, Col, md } from "react-bootstrap";
import { FaUser, FaEnvelope, FaKey, FaEyeSlash, FaEye } from "react-icons/fa";
import Select from "react-select"
import { getUserRoles, createUser } from '../../_services/authServices';
import { FaK } from "react-icons/fa6";
import { useMessageModal } from '../../components/ModalContext';
import GlassLoader from "../GlassLoader";

const NewUserAccount = () => {
  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
    const { showMessageModal } = useMessageModal();
      const [loading, setLoading] = useState(false);

  const [newUserAccount, setNewUserAccount] = useState({
    roleId: 0,
    userName: "",
    email: "",
    contact: 0,
    password: "",
  });
     
  const [userRoles, setUserRoles] = useState([]);
     
  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const result = await getUserRoles(); 
        setUserRoles(result.rows);
      } catch (err) {
        showMessageModal({
          heading: 'Saving Failed',
          message: `❌ ${err.message}`,
          messageType: 'error',
        });
      }
    };
  
    fetchUserRoles();
  }, []);

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
      const result = await createUser(newUserAccount);
      showMessageModal({
        heading: 'Success!',
        message: `✅ ${result.message}`,
        messageType: 'success',
      });
      setNewUserAccount({
        roleId: 0,
        userName: "",
        email: "",
        contact: 0,
        password: "",
      });
    } catch (error) {
      showMessageModal({
        heading: 'Saving Failed',
        message: `❌ ${error.message}`,
        messageType: 'error',
      });
      console.error("❌ Error submitting form:", error.message);
    }
    setLoading(false);
  };
  
  const handleSelectChange = (field, selectedOption) => {
    if (!selectedOption) return;
    setNewUserAccount(prev => ({
      ...prev,
      [field]: selectedOption.roleId
    }));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUserAccount({ ...newUserAccount, [name]: value });
  };

  if (loading)  return (
    <div className="form-container mb-5 position-relative">
      <GlassLoader show={loading} />
    </div>
  );

  return (
    <div >
      <Card>
        <Card.Header>
          <i className="text-danger">All fields are mandatory</i>
        </Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>userName</Form.Label>
              <InputGroup>
                <InputGroup.Text><FaUser /></InputGroup.Text>
                <Form.Control 
                  name="userName" 
                  type="text" 
                  placeholder="Enter user name" 
                  onChange={handleChange} 
                  value={newUserAccount.userName}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  User Name is required.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
        
            <Form.Group className="my-3">
              <Form.Label>Email Address</Form.Label>
              <InputGroup>
                <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                <Form.Control 
                  name="email" 
                  type="email" 
                  placeholder="Enter email address" 
                  onChange={handleChange} 
                  value={newUserAccount.email}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Email is required.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
        
            <Form.Group className="my-3">
              <Form.Label>Mobile Number</Form.Label>
              <InputGroup>
                <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                <Form.Control 
                  name="contact" 
                  type="number" 
                  placeholder="Enter Mobile Number" 
                  onChange={handleChange} 
                  value={newUserAccount.contact}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Mobile number is required.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
        
            <Form.Group className="my-3">
              <Form.Label>User Role</Form.Label>
              <Select
                required
                options={userRoles}
                getOptionLabel={(e) => e.roleName}
                getOptionValue={(e) => e.roleId}
                onChange={(selectedOption) => handleSelectChange("roleId", selectedOption)}
                placeholder="-- Select User Role --"
              />
              <Form.Control.Feedback type="invalid">
                User role is required.
              </Form.Control.Feedback>
            </Form.Group>
        
            <div>
            <Button type="submit" className="bg-primary hoverable w-100">Save</Button>
          </div>
        </Form>
      </Card.Body>
    </Card> 
    </div>
  );
};

export default NewUserAccount;
