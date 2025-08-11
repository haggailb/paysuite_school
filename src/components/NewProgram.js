import React, { useState } from "react";
import { Container, Card, Form, Button, Tabs, Tab, Alert, Row, Col } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import Select from "react-select"
import { sampleFaculties } from '../_services/dataServices';

const NewProgram = () => {
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
            <Row> 
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Program Code</Form.Label>
                  <Form.Control type="text" placeholder="Enter program code"  required/>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Faculty / School</Form.Label>
                  <Select
                    required
                    name="bankId"
                    options={sampleFaculties}
                    getOptionLabel={(e) => e.facultyName }
                    getOptionValue={(e) => e.facultyId}
                    // onChange={(selectedOption) => handleSelectChange("bankId", selectedOption)}
                    placeholder="-- Select Faculty --"
                  />
                  <Form.Control.Feedback type="invalid">
                    Bank ID is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Program Name</Form.Label>
              <Form.Control type="text" placeholder="Enter program name"  required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter faculty description"/>
            </Form.Group>
            <Button variant="primary" type="submit">Register</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewProgram;
