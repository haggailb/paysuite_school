import React, { useState } from "react";
import { Container, Card, Form, Button, Tabs, Tab, Alert, Row, Col } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import Select from "react-select"

const NewStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [key, setKey] = useState("personal");
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    nationalId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender : "",
    maritalStatus: "",
    nationality: "",
    mobileNumber: "",
    email: "",
    physicalAddress: "",
    programId: "",
    studyLevel: "",
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

  const programsList = [
  {
    code: "BSC-CS",
    name: "Bachelor of Science in Computer Science",
    description: "Focuses on programming, algorithms, software development, and data structures.",
    faculty: "Faculty of Science and Technology"
  },
  {
    code: "BA-BA",
    name: "Bachelor of Arts in Business Administration",
    description: "Covers business operations, management principles, and organizational leadership.",
    faculty: "Faculty of Business and Economics"
  },
  {
    code: "BSC-NUR",
    name: "Bachelor of Science in Nursing",
    description: "Equips students with clinical and theoretical nursing knowledge.",
    faculty: "Faculty of Health Sciences"
  }
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
              <Form noValidate validated={validated} onSubmit={(e) => handleNext(e, "academic")}>                
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

            {/* Academic Details Tab */}
            <Tab eventKey="academic" title="Academic" disabled={key !== "academic"}>
              <Form noValidate validated={validated} onSubmit={(e) => handleNext(e, "nok")}>                
                <Form.Group className="mb-3">
                  <Form.Label className="required">Program Enrolled</Form.Label>
                  <Select
                    required
                    name="programId"
                    options={programsList}
                    getOptionLabel={(e) => e.name}
                    getOptionValue={(e) => e.code}
                    onChange={(selectedOption) => handleSelectChange("programId", selectedOption.code)}
                    placeholder="-- Select Program --"
                  />
                </Form.Group>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="required">Level / Year of Study</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        min={1}
                        max={5}
                        name="studyLevel"
                        placeholder="e.g. 2"
                        value={formData.studyLevel}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="required">Semester / Term</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        min={1}
                        max={3}
                        name="semester"
                        placeholder="e.g. 1"
                        value={formData.semester}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="required">Mode of Study</Form.Label>
                      <Form.Select name="studyMode" value={formData.studyMode} onChange={handleChange} required>
                        <option value="">Select Mode</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Distance">Distance</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label className="required">Entry Type</Form.Label>
                      <Form.Select name="entryType" value={formData.entryType} onChange={handleChange} required>
                        <option value="">Select Mode</option>
                        <option value="Direct Entry">Direct Entry</option>
                        <option value="Transfer">Transfer</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Previous Institution</Form.Label>
                      <Form.Control
                        type="text"
                        name="previousInstitution"
                        placeholder="Name of last institution attended"
                        value={formData.previousInstitution}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Highest Qualification</Form.Label>
                      <Form.Control
                        type="text"
                        name="highestQualification"
                        placeholder="e.g. Certificate, Diploma, Degree"
                        value={formData.highestQualification}
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

            {/* nok Details Tab */}
            <Tab eventKey="nok" title="Next on Keen" disabled={key !== "nok"}>
              <Form noValidate validated={validated} onSubmit={(e) => handleNext(e, "review")}>                
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="nokName"
                    value={formData.nokName}
                    onChange={handleChange}
                    placeholder="Enter Full Name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="nokPhone"
                    value={formData.nokPhone}
                    onChange={handleChange}
                    placeholder="Enter Mobile Number"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Relationship</Form.Label>
                  <Form.Control
                    type="text"
                    name="nokRelation"
                    value={formData.nokRelation}
                    onChange={handleChange}
                    placeholder="Enter Relationship (e.g. Father, Mother, nok, etc.)"
                  />
                </Form.Group>
                <Row className="d-flex justify-content-between">
                  <Col xs="auto">
                    <Button variant="secondary" onClick={() => setKey("academic")} className="me-2">
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
                  <h5>Academic Details</h5>
                  <p><strong>Program:</strong> {formData.programId}</p>
                  <p><strong>Study Mode:</strong> {formData.studyMode}</p>
                  <p><strong>Level:</strong> Y{formData.studyLevel}-S{formData.semester}</p>
                  <p><strong>Entry:</strong> {formData.entryType}</p>
                  <p><strong>Previous Ins.:</strong> {formData.previousInstitution}</p>
                  <p><strong>Highest Qualification:</strong> {formData.highestQualification}</p>
                  <hr></hr>
                  <h5>nok Details</h5>
                  <p><strong>Name:</strong> {formData.nokName}</p>
                  <p><strong>Phone:</strong> {formData.nokPhone}</p>
                  <p><strong>Relationship:</strong> {formData.nokRelation}</p>
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

export default NewStudent;
