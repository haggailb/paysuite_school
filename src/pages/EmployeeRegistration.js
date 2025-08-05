import React, { useState } from "react";
import { Container, Card, Form, Button, Tab, Nav, Row, Col, InputGroup } from "react-bootstrap";
import { FaUser, FaPhone, FaBuilding, FaBriefcase, FaPaperPlane, FaIdBadge, FaCalendarAlt } from "react-icons/fa";

const EmployeeRegistration = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [showPassword, setShowPassword] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    fName: "",
    lName: "",
    oNames: "",
    gender: "",
    dob: "",
    contact: "",
    department: "",
    unit: "",
    position: "",
    salary: "",
    email: "",
  });

  // Mock Data
  const departments = ["Finance", "HR", "IT", "Marketing"];
  const units = {
    Finance: ["Payroll", "Accounts", "Audits"],
    HR: ["Recruitment", "Training", "Employee Relations"],
    IT: ["Development", "Support", "Security"],
    Marketing: ["Sales", "Branding", "Advertising"],
  };
  const positions = {
    Payroll: ["Payroll Officer", "Senior Accountant"],
    Accounts: ["Junior Accountant", "Accounts Manager"],
    Audits: ["Internal Auditor", "Risk Analyst"],
    Recruitment: ["HR Officer", "Talent Acquisition"],
    Training: ["Training Specialist", "Learning Manager"],
    Development: ["Software Engineer", "UI/UX Designer"],
    Support: ["IT Support", "Helpdesk"],
    Sales: ["Sales Executive", "Business Developer"],
  };

  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Employee Data:", formData);
    alert("Employee Registered Successfully!");
  };

  return (
    <Container className=" flex-column justify-content-center align-items-center min-vh-100 bg-light">
          <h2 className="page-title text-center mb-4">Employee Registration</h2>
      <Card className="form-container">
        <Card.Body>
          
          {/* Tabs */}
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav variant="pills" className="justify-content-center mb-3">
              <Nav.Item>
                <Nav.Link eventKey="personal">Personal Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="employment" disabled={!formData.fullName}>Employment Details</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {/* Step 1: Personal Info */}
              <Tab.Pane eventKey="personal">
                <Form>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FaIdBadge className="icon" /> National ID</Form.Label>
                                <Form.Control type="text" name="nationalID" placeholder="Enter ID Number" value={formData.fName} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FaIdBadge className="icon" /> Employee Number</Form.Label>
                                <Form.Control type="text" name="empNumber" placeholder="Enter Employee Number" value={formData.lName} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                    </Row>
                  <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label><FaUser className="icon" /> First Name</Form.Label>
                            <Form.Control type="text" name="fName" placeholder="Enter First Name" value={formData.fName} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label><FaUser className="icon" /> Last Name</Form.Label>
                            <Form.Control type="text" name="lName" placeholder="Enter Last Name" value={formData.lName} onChange={handleChange} required />
                        </Form.Group>
                    </Col>
                  </Row>
                    <Form.Group className="mb-3">
                        <Form.Label><FaUser className="icon" /> Other Names</Form.Label>
                        <Form.Control type="text" name="oNames" placeholder="Enter other Names" value={formData.lName} onChange={handleChange} required />
                    </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label> Gender</Form.Label>
                        <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label><FaCalendarAlt className="icon"/>Date of Birth</Form.Label>
                        <Form.Control type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                  </Row>
                <Form.Group className="mb-3">
                    <Form.Label><FaPaperPlane className="icon" /> Email</Form.Label>
                    <Form.Control type="email" name="fName" placeholder="Enter Email" value={formData.fName} onChange={handleChange} required />
                </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label><FaPhone className="icon" /> Contact Number</Form.Label>
                    <Form.Control type="phone" name="contact" placeholder="Enter Mobile Number" value={formData.contact} onChange={handleChange} required />
                  </Form.Group>

                  <Button onClick={() => setActiveTab("employment")}>Next</Button>
                </Form>
              </Tab.Pane>

              {/* Step 2: Employment Details */}
              <Tab.Pane eventKey="employment">
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label><FaBuilding className="icon" /> Department</Form.Label>
                    <Form.Select name="department" value={formData.department} onChange={handleChange} required>
                      <option value="">Select Department</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>{dept}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Unit/Section</Form.Label>
                    <Form.Select name="unit" value={formData.unit} onChange={handleChange} required>
                      <option value="">Select Unit</option>
                      {(units[formData.department] || []).map((unit, index) => (
                        <option key={index} value={unit}>{unit}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label><FaBriefcase className="icon" /> Job Title</Form.Label>
                    <Form.Select name="position" value={formData.position} onChange={handleChange} required>
                      <option value="">Select Position</option>
                      {(positions[formData.unit] || []).map((pos, index) => (
                        <option key={index} value={pos}>{pos}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Button type="submit">Register Employee</Button>
                </Form>
              </Tab.Pane>

            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EmployeeRegistration;
