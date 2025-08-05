import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { FaCity, FaPhone, FaMapMarkerAlt, FaEnvelope, FaQuoteLeft, FaEye, FaCheck } from "react-icons/fa";

const ViewInstitution = () => {
  const [institutionData, setInstitutionData] = useState({
    councilName: "Kafue Town Council",
    province: "Lusaka",
    contactNumber: "+260 97 123 4567",
    landline: "+260 21 123 456",
    email: "info@kafuecouncil.gov.zm",
    mission: "To provide efficient and effective service delivery to the community.",
    vision: "To be a model council that promotes sustainable development.",
    motto: "Service with Integrity.",
  });

  return (
    <Container className="justify-content-center align-items-center min-vh-100 bg-light">
      <h2 className="page-title text-center mb-4">Institutional Information</h2>
      <Card className="form-container">
        <Card.Body>
          <p className="info-item"><FaCity className="icon" /> <strong>Council Name:</strong> {institutionData.councilName}</p>
          <p className="info-item"><FaMapMarkerAlt className="icon" /> <strong>Province:</strong> {institutionData.province}</p>
          <p className="info-item"><FaPhone className="icon" /> <strong>Contact Number:</strong> {institutionData.contactNumber}</p>
          <p className="info-item"><FaPhone className="icon" /> <strong>Landline:</strong> {institutionData.landline}</p>
          <p className="info-item"><FaEnvelope className="icon" /> <strong>Email:</strong> {institutionData.email}</p>
            
          <hr />
            
          <p className="info-item"><FaQuoteLeft className="icon" /> <strong>Mission Statement:</strong> {institutionData.mission}</p>
          <p className="info-item"><FaEye className="icon" /> <strong>Vision:</strong> {institutionData.vision}</p>
          <p className="info-item"><FaCheck className="icon" /> <strong>Motto:</strong> {institutionData.motto}</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ViewInstitution;
