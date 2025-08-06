import React, { useState } from "react";
import { Container, Card, Form, Button, Tabs, Tab, Alert, Row, Col } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";

const NewFaculty = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [key, setKey] = useState("personal");
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    f_name: "",
    f_code: "",
    desc: "",
    mobile: "",
    email: "",
    office_location: "",
    dean: "",
  });

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
      
    setLoading(false);
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (error) return <div className="text-danger text-center p-4">❌ Error: {error}</div>;

  return (
    <div >
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit} noValidate validated={validated}>
            <Form.Group className="mb-3">
              <Form.Label>Faculty Code</Form.Label>
              <Form.Control type="text" placeholder="Enter faculty code"  required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Faculty Name</Form.Label>
              <Form.Control type="text" placeholder="Enter faculty name"  required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter faculty description"/>
            </Form.Group>
            <Row> 
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control type="text" placeholder="Enter contact number" required/>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email address" required/>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Office Location</Form.Label>
                  <Form.Control type="text" placeholder="Enter office location" required/>
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit">Register</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewFaculty;
