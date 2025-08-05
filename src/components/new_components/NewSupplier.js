import React, { useState } from "react";
import { Container, Card, Form, Button, Tabs, Tab, Alert, Row, Col } from "react-bootstrap";
import { FaCheck, FaArrowRight, FaArrowLeft } from "react-icons/fa";

const NewSupplier = () => {
  const [key, setKey] = useState("business");
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    tpin: "",
    brn: "",
    bName: "",
    contactPerson: "",
    physicalAddress: "",
    mobileNumber: "",
    email: "",
    bankName: "",
    branchName: "",
    sortCode: "",
    swiftCode: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
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

  return (
    <div >
      <Card className=" p-4">
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3" justify>
          {/* Personal Details Tab */}
          <Tab eventKey="business" title="Business Details">
            <Form noValidate validated={validated} onSubmit={(e) => handleNext(e, "banking")}>
              <Row>
                <Col md={6}>
                  <Form.Group className="my-3">
                  <Form.Label>TPIN</Form.Label>
                    <Form.Control 
                      required
                      name="tpin" 
                      type="text" 
                      placeholder="Enter TPIN"
                      onChange={handleChange} 
                      value={formData.tpin}
                    />
                  </Form.Group>
                </Col> 
                <Col md={6}>
                  <Form.Group className="my-3">
                    <Form.Label>Business Registration Number</Form.Label>
                    <Form.Control
                      required
                      name="brn" 
                      type="text" 
                      placeholder="Enter BRN" 
                      onChange={handleChange} 
                      value={formData.brn}
                    />
                  </Form.Group>
                </Col> 
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="my-3">
                    <Form.Label>Business Name</Form.Label>
                    <Form.Control 
                      required
                      name="bName" 
                      type="text" 
                      placeholder="Enter business name" 
                      onChange={handleChange} 
                      value={formData.bName}
                    />
                  </Form.Group>
                </Col> 
                <Col md={6}>
                  <Form.Group className="my-3">
                    <Form.Label>Contact Person</Form.Label>
                    <Form.Control 
                      required
                      name="contactPerson" 
                      type="text" 
                      placeholder="Enter name" 
                      onChange={handleChange} 
                      value={formData.contactPerson}
                    />
                  </Form.Group>
                </Col> 
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="my-3">
                    <Form.Label>Physical Address</Form.Label>
                    <Form.Control 
                      required
                      name="physicalAddress" 
                      type="text" 
                      placeholder="Enter physical address" 
                      onChange={handleChange} 
                      value={formData.physicalAddress}
                    />
                  </Form.Group>
                </Col> 
                <Col md={6}>
                  <Form.Group className="my-3">
                  <Form.Label>Mobile (<i>must start with 260 </i>)</Form.Label>
                    <Form.Control 
                      required
                      name="mobileNumber" 
                      type="number" 
                      placeholder="Enter mobile number"
                      onChange={handleChange} 
                      value={formData.mobileNumber}
                    />
                  </Form.Group>
                </Col> 
              </Row>
              <Col md={6}>
                <Form.Group className="my-3">
                <Form.Label>Email Address</Form.Label>
                  <Form.Control 
                    name="email" 
                    type="email" 
                    placeholder="Enter email"
                    onChange={handleChange} 
                    value={formData.email}
                  />
                </Form.Group>
              </Col> 
              <Row className="d-flex justify-content-end">
                <Col xs="auto">
                  <Button type="submit">
                    Next <FaArrowRight />
                  </Button>
                </Col>
              </Row>
            </Form>
          </Tab>

          {/* Contact Details Tab */}
          <Tab eventKey="banking" title="Bank Details" disabled={key !== "review"} justify>
          <Form noValidate validated={validated} onSubmit={(e) => handleNext(e, "review")}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="bankName"
                    placeholder="Enter Bank Name"
                    value={formData.bankName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Branch Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="branchName"
                    placeholder="Enter Branch Name"
                    value={formData.branchName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sort Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="sortCode"
                    placeholder="Enter Branch Name"
                    value={formData.sortCode}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Swift Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="swiftCode"
                    placeholder="Enter Bank Name"
                    value={formData.swiftCode}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="d-flex justify-content-between">
              <Col xs="auto">
                <Button variant="secondary" onClick={() => setKey("business")} className="me-2">
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
                <p><strong>TPIN:</strong> {formData.tpin}</p>
                <p><strong>BRN:</strong> {formData.brn}</p>
                <p><strong>Name:</strong> {formData.bName}</p>
                <h5>Contact Details</h5>
                <p><strong>Physical Address:</strong> {formData.physicalAddress}</p>
                <p><strong>Contact Person:</strong> {formData.contactPerson}</p>
                <p><strong>Mobile Phone:</strong> {formData.mobileNumber}</p>
                <h5>Banking Details</h5>
                <p><strong>Bank Name:</strong> {formData.bankName}</p>
                <p><strong>Branch Name:</strong> {formData.branchName}</p>
                <p><strong>Sort Code:</strong> {formData.sortCode}</p>
                <p><strong>Swift Code:</strong> {formData.swiftCode}</p>
              </Card.Body>
            </Card>

            <Row className="d-flex justify-content-between">
              <Col xs="auto">
                <Button variant="secondary" onClick={() => setKey("banking")} className="me-2 mt-3 shadow">
                  <FaArrowLeft /> Back
                </Button>
              </Col>
              <Col xs="auto">
                <Button className="mt-3 bg-primary hoverable">
                  Register <FaCheck className="text-white"/>
                </Button>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Card>
    </div>
  );
};

export default NewSupplier;
