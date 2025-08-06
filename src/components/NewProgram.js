import React, { useState } from "react";
import { Container, Card, Form, Button, Tabs, Tab, Alert, Row, Col } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import Select from "react-select"

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

  
  const facultyData = [
  {
    id: 1001,
    name: "Faculty of Science",
    code: "SCI",
    description: "Covers all scientific programs including Biology, Physics, and Chemistry.",
    dean: "Dr. Alice Mwansa",
    email: "science@university.edu",
    phone: "+260 211 123456",
    office_location: "Block A, Main Campus"
  },
  {
    id: 1002,
    name: "School of Engineering",
    code: "ENG",
    description: "Covers all scientific programs in engineering including Civil, Mechanical, and Electrical.",
    dean: "Dr. Mabumbula",
    email: "engineering@university.edu",
    phone: "+260 211 123456",
    office_location: "Block A, Main Campus"
  },
];

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
                    options={facultyData}
                    getOptionLabel={(e) => e.name}
                    getOptionValue={(e) => e.code}
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
