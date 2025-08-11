import React, { useState } from "react";
import { Container, Card, Form, Button, Tabs, Tab, Alert, Row, Col } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import Select from "react-select";
import { samplePrograms } from '../_services/dataServices';

const NewExam = () => {
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
  const handleSelectChange = (field, selectedValue) => {
    if (!selectedValue) return;
    setFormData(prev => ({
      ...prev,
      [field]: selectedValue
    }));
  };


  if (error) return <div className="text-danger text-center p-4">❌ Error: {error}</div>;

  return (
    <div >
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit} noValidate validated={validated}>
            <Row>
              <Col lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Exam year </Form.Label>
                  <Form.Control 
                    type="number" 
                    placeholder="Enter Year e.g 2025"
                    name="exam_year"
                    value={formData.exam_year}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Study Level  <small> (0 = All) </small> </Form.Label>
                  <Form.Control 
                    type="number" 
                    min={0}
                    placeholder="Enter Year e.g 1"
                    name="study_level"
                    value={formData.study_level}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={6} lg={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Semester <small> (0 = All) </small></Form.Label>
                  <Form.Control 
                    type="number" 
                    min={0}
                    placeholder="Enter Year e.g 1"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Exam Name</Form.Label>
              <Form.Control type="text" placeholder="E.g 2025 Semester 1 Final"  required/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className='required'>Program Name</Form.Label>
              <Select
                required
                name="programId"
                options={[{ programId: 0, programName: "All" }, ...samplePrograms]}
                getOptionLabel={(e) => e.programName }
                getOptionValue={(e) => e.programId}
                onChange={(selectedOption) => handleSelectChange("programId", selectedOption.programId)}
                placeholder="-- Select Program --"
              />
              <Form.Control.Feedback type="invalid"> Invalid Program </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">Save Exam</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewExam;
