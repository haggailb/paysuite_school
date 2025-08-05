import React, { useState } from "react";
import { Container, Card, Form, Button, Tabs, Tab, Alert, Row, Col } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import { createClient} from '../../_services/clientServices';
import GlassLoader from "../GlassLoader";
import { useMessageModal } from '../../components/ModalContext';

const NewClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showMessageModal } = useMessageModal();

  const [key, setKey] = useState("personal");
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    nationalId: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    physicalAddress: "",
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
    try {
      const result = await createClient(formData);
      showMessageModal({
        heading: 'Success!',
        message: `Client saved successfully`,
        messageType: 'success',
      });
      setFormData({ firstName: "", lastName: "", mobileNumber: "", email: "", nationalId: "", physicalAddress: "" });
    } catch (error) {
      showMessageModal({
        heading: 'Error saving client!',
        message: `${error.message}`,
        messageType: 'error',
      });
      // console.error("❌ Error submitting form:", error.message);
    }
    setLoading(false);
  };
 
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

  if (loading)  return (
    <div className="form-container mb-5 position-relative">
      <GlassLoader show={loading} />
    </div>
  );

  if (error) return <div className="text-danger text-center p-4">❌ Error: {error}</div>;

  return (
    <div >
      <Card className=" p-4">
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3" justify>
          {/* Personal Details Tab */}
          <Tab eventKey="personal" title="Personal Details">
            <Form noValidate validated={validated} onSubmit={(e) => handleNext(e, "contact")}>
              <Form.Group className="mb-3">
                <Form.Label>National ID (NRC / Passport)</Form.Label>
                <Form.Control
                  type="text"
                  name="nationalId"
                  placeholder="Enter National ID"
                  value={formData.nationalId}
                  onChange={handleChange}
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
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
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
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
          <Tab eventKey="contact" title="Contact Details" disabled={key !== "contact"}>
          <Form noValidate validated={validated} onSubmit={(e) => handleNext(e, "review")}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="mobileNumber"
                  placeholder="Enter Phone Number"
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
                <Form.Label>Address</Form.Label>
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

          {/* Review & Submit Tab */}
          <Tab eventKey="review" title="Review & Submit" disabled={key !== "review"}>
            <Card>
              <Card.Body>
                <h5>Personal Details</h5>
                <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>National ID:</strong> {formData.nationalId}</p>

                <h5>Contact Details</h5>
                <p><strong>Phone:</strong> {formData.mobileNumber}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Address:</strong> {formData.physicalAddress}</p>
              </Card.Body>
            </Card>

            <Row className="d-flex justify-content-between">
              <Col xs="auto">
                <Button variant="secondary" onClick={() => setKey("contact")} className="me-2 mt-3 shadow">
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
      </Card>
    </div>
  );
};

export default NewClient;
