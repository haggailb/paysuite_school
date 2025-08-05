import React, { useState, useEffect, useContext } from "react";
import { Container, Card, Form, Button, InputGroup , Tabs, Tab, Alert, Row, Col, md } from "react-bootstrap";
import { FaUser, FaEnvelope } from "react-icons/fa";
import Select from "react-select"
import { userLogOut } from '../../_services/authServices';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthProvider'; 

const ConfirmLogOut = () => {
  const [showNewModal, setShowConfirmLogout] = useState(false);
  const { logout } = useContext(AuthContext);
  
  const handleCloseModal = () => {
    setShowConfirmLogout(false);
  };
  
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    await logout();
    navigate('/');
  };
  
  return (
    <div >
    <Card>
      <Card.Header>
        <h2 className="text-danger">Are you sure you want to Log Out?</h2>
      </Card.Header>
        <Card.Body>
          <Row>
            <Col xs={6}>
              <Button className="w-100" variant="secondary" onClick={handleCloseModal}>No</Button>
            </Col> 
            <Col xs={6}>
              <Button className="w-100 bg-danger" variant="secondary" onClick={handleLogout}>Yes</Button>
            </Col> 
          </Row>
        </Card.Body>
    </Card> 
    </div>
  );
};

export default ConfirmLogOut;
