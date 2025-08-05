import React, { useEffect, useState} from "react";
import { Form, Card, Button, Container, Row, Col, InputGroup } from "react-bootstrap";
import { FaCity, FaPhone, FaMapMarkerAlt, FaEnvelope, FaMobile, FaMobileAlt, FaInfo } from "react-icons/fa";
import Select from "react-select";
import { getProvinces } from "../../_services/dataServices";
import { saveInfo } from "../../_services/institutionServices";

function ConfigInstitutionInfo() {
  const [validated, setValidated] = useState(false);

  const [institutionalInfo, setNewInfo] = useState({
    head: "",
    councilName: "",
    province: "",
    mobile: "",
    landline: "",
    email: "",
    postal: "",
    mission: "",
    vision: "",
    motto: "",
  });
  
  const provinces = getProvinces();

  useEffect(() => {
    
  }, []);
     
  const handleSelectChange = (field, selectedOption) => {
    if (!selectedOption) return;
    setNewInfo(prev => ({
      ...prev,
      [field]: selectedOption.roleId
    }));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewInfo({ ...institutionalInfo, [name]: value });
  };
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     const form = e.currentTarget;
   
     if (form.checkValidity() === false) {
       e.stopPropagation();
       setValidated(true);
       return;
     }
   
     setValidated(true);
   
     try {
       const result = await saveInfo(institutionalInfo);
       alert("✅ Institutional information saved successfully!");
     } catch (error) {
       alert(`❌ ${error.message}`);
       console.error("❌ Error submitting form:", error.message);
     }
   };
   
  return (
    <div className="form-container mb-5">
      <Card className="">
        <Card.Header>
          <Card.Title className="page-title text-center">Institutional Information</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Head</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaCity /></InputGroup.Text>
                    <Form.Control 
                      name="head" 
                      type="number" 
                      placeholder="Enter head code" 
                      onChange={handleChange} 
                      value={institutionalInfo.head}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Institution head is required.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label"> Province </Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaMapMarkerAlt /></InputGroup.Text>
                    <Select
                      required
                      options={provinces}
                      getOptionLabel={(e) => e.name}
                      getOptionValue={(e) => e.name}
                      onChange={(selectedOption) => handleSelectChange("province", selectedOption)}
                      placeholder="-- Select Province --"
                    />
                    <Form.Control.Feedback type="invalid">
                      Province name is required.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Council Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaCity /></InputGroup.Text>
                    <Form.Control 
                      name="councilName" 
                      type="text" 
                      placeholder="Enter council name" 
                      onChange={handleChange} 
                      value={institutionalInfo.councilName}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Council name is required.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Contact Number</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaMobileAlt /></InputGroup.Text>
                    <Form.Control 
                      name="contact" 
                      type="number" 
                      placeholder="Enter mobile number" 
                      onChange={handleChange} 
                      value={institutionalInfo.contact}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Mobile number is required.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Landline</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaPhone /></InputGroup.Text>
                    <Form.Control 
                      name="landline" 
                      type="number" 
                      placeholder="Enter mobile number" 
                      onChange={handleChange} 
                      value={institutionalInfo.landline}
                    />
                    <Form.Control.Feedback type="invalid">
                      Council name is required.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="form-label">Email</Form.Label>
              <InputGroup>
                <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                <Form.Control 
                  name="email" 
                  type="email" 
                  placeholder="Enter email" 
                  onChange={handleChange} 
                  value={institutionalInfo.email}
                />
              </InputGroup>
            </Form.Group>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Mision Statement</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaInfo /></InputGroup.Text>
                    <Form.Control 
                      name="mission" 
                      as="textarea" 
                      className="form-control form-textarea" 
                      onChange={handleChange} 
                      placeholder="Enter mission statement" 
                      value={institutionalInfo.mission}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Vision</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaInfo /></InputGroup.Text>
                    <Form.Control 
                      name="vision" 
                      as="textarea" 
                      onChange={handleChange} 
                      className="form-control form-textarea" 
                      placeholder="Enter vision statement" 
                      value={institutionalInfo.vision}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Motto</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaInfo /></InputGroup.Text>
                    <Form.Control 
                      name="motto" 
                      as="textarea" 
                      onChange={handleChange} 
                      className="form-control form-textarea" 
                      placeholder="Enter motto" 
                      value={institutionalInfo.motto}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <div className="text-center">
              <Button type="submit" className="btn-submit hoverable bg-primary">Save</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ConfigInstitutionInfo;
