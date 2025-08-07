import React, { useState } from "react";
import { Container, Card, Form, Button, Tabs, Tab, Alert, Row, Col } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import Select from "react-select"

const NewStaffMember = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [key, setKey] = useState("personal");
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    nationalId: '',
    title: '',
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    maritalStatus: '',
    nationality: '',
    phone: '',
    email: '',
    address: '',
    jobTitle: '',
    facultyCode: '',
  });

  
  const handleNext = (event, nextKey) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
    } else {
      setValidated(false);
      setKey(nextKey);
    }
  };

  const facultyList = [
  {
    id: 1001,
    name: "Faculty of Science",
    code: "SCI",
  },
  {
    id: 1002,
    name: "School of Engineering",
    code: "ENG",
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
  const handleSelectChange = (field, selectedValue) => {
    if (!selectedValue) return;
    setFormData(prev => ({
      ...prev,
      [field]: selectedValue
    }));
  };

  if (error) return <div className="text-danger text-center p-4">❌ Error: {error}</div>;

  return (
    <div >      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <p className="mb-0">All fields marked <span className="required"></span> are mandatory.</p>
        </Card.Header>
        <Card.Body>
          <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3" justify>
            {/* Personal Details Tab */}
            <Tab eventKey="personal" title="Personal">
              <Form noValidate validated={validated} onSubmit={(e) => handleNext(e, "contact")}>                
                <Form.Group className="mb-3">
                  <Form.Label className="required">National ID (NRC / Passport)</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="nationalId"
                    placeholder="Enter National ID"
                    value={formData.nationalId}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="required">First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="Enter First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Middle Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="middleName"
                        placeholder="Enter Middle Name"
                        value={formData.middleName}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="required">Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        placeholder="Enter Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="required">Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="required">Gender</Form.Label>
                      <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="required">Marital Status</Form.Label>
                      <Form.Select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required>
                        <option value="">Select Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nationality</Form.Label>
                      <Form.Control
                        type="text"
                        name="nationality"
                        placeholder="Enter Nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs="auto">
                    <Button type="submit">
                      Next <FaArrowRight />
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Tab>

            {/* Contact Details Tab */}
            <Tab eventKey="contact" title="Contact" disabled={key !== "contact"}>
              <Form noValidate validated={validated} onSubmit={(e) => handleNext(e, "employment")}>                
                <Form.Group className="mb-3">
                  <Form.Label className="required">Mobile Number (With Country Code)</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobileNumber"
                    placeholder="Enter Mobile Number (e.g. 260977123456)"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="required">Physical Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="physicalAddress"
                    placeholder="Enter Physical Address"
                    value={formData.physicalAddress}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row className="d-flex justify-content-between">
                  <Col xs="auto">
                    <Button variant="secondary" onClick={() => setKey("personal")} className="me-2">
                      <FaArrowLeft /> Back
                    </Button>
                  </Col>
                  <Col xs="auto">
                    <Button type="submit">
                      Next <FaArrowRight />
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Tab>

            {/* employment Details Tab */}
            <Tab eventKey="employment" title="Employment" disabled={key !== "employment"}>
              <Form noValidate validated={validated} onSubmit={(e) => handleNext(e, "review")}>                
                <Form.Group className="mb-3">
                  <Form.Label className="required">Faculty / School</Form.Label>
                  <Select
                    required
                    name="facultyCode"
                    options={facultyList}
                    getOptionLabel={(e) => e.name}
                    getOptionValue={(e) => e.code}
                    onChange={(selectedOption) => handleSelectChange("facultyCode", selectedOption.code)}
                    placeholder="-- Select faculty --"
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="required">Job Title</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="jobTitle"
                        placeholder="Enter job Title"
                        value={formData.jobTitle}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="required">Semester / Term</Form.Label>
                      <Form.Control
                        required
                        type="date"
                        name="dateEmployed"
                        value={formData.dateEmployed}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row className="d-flex justify-content-between">
                  <Col xs="auto">
                    <Button variant="secondary" onClick={() => setKey("contact")}> <FaArrowLeft /> Back </Button>
                  </Col>
                  <Col xs="auto">
                    <Button type="submit"> Next <FaArrowRight /> </Button>
                  </Col>
                </Row>
              </Form>
            </Tab>

            {/* Review & Submit Tab */}
            <Tab eventKey="review" title="Review & Submit" disabled={key !== "review"}>
              <Card>
                <Card.Body>
                  <h5>Personal Details</h5>
                  <p><strong>Name:</strong> {formData.firstName} {formData.middleName} {formData.lastName}</p>
                  <p><strong>National ID:</strong> {formData.nationalId}</p>
                  <p><strong>Date of Birth:</strong> {formData.dob}</p>
                  <p><strong>Gender:</strong> {formData.gender}</p>
                  <p><strong>Marital Status:</strong> {formData.maritalStatus}</p>
                  <p><strong>Nationality:</strong> {formData.gender}</p>
                  <hr></hr>
                  <h5>Contact Details</h5>
                  <p><strong>Phone:</strong> {formData.mobileNumber}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Address:</strong> {formData.physicalAddress}</p>
                  <hr></hr>
                  <h5>Employment Details</h5>
                  <p><strong>Faculty / School:</strong> {formData.facultyCode}</p>
                  <p><strong>Job Title:</strong> {formData.jobTitle}</p>
                  <p><strong>Date Employed:</strong> {formData.dateEmployed}</p>
                </Card.Body>
              </Card>

              <Row className="d-flex justify-content-between">
                <Col xs="auto">
                  <Button variant="secondary" onClick={() => setKey("nok")} className="me-2 mt-3 shadow">
                    <FaArrowLeft /> Back
                  </Button>
                </Col>
                <Col xs="auto">
                  <Button className="mt-3 bg-primary hoverable" onClick={handleSubmit}>
                    Register <FaCheck className="text-white"/>
                  </Button>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

    </div>
  );
};

export default NewStaffMember;
