import React, { useState } from "react";
import { Container, Card, Form, Button, Table } from "react-bootstrap";

const DocumentSetup = () => {
  const [formData, setFormData] = useState({
    documentName: "",
    requiresAudit: false,
    requiresChecking: false,
    requiresVerification: false,
    requiresApproval: false,
  });

  const [documents, setDocuments] = useState([]); // State to store saved documents

  // Handle Input Change
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setDocuments([...documents, formData]); // Save document details in the table
    setFormData({
      documentName: "",
      requiresAudit: false,
      requiresChecking: false,
      requiresVerification: false,
      requiresApproval: false,
    });
  };

  return (
    <Container className="flex-column justify-content-center align-items-center min-vh-100 bg-light">
          <h2 className="page-title text-center mb-4">System Documents Setup</h2>
      <Card className="form-container w-75 mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Document Name */}
            <Form.Group className="mb-3">
              <Form.Label>Document Name</Form.Label>
              <Form.Control
                type="text"
                name="documentName"
                placeholder="e.g. Payment Voucher"
                value={formData.documentName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Checkboxes */}
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Requires Audit"
                name="requiresAudit"
                checked={formData.requiresAudit}
                onChange={handleChange}
              />
              <Form.Check
                type="checkbox"
                label="Requires Checking"
                name="requiresChecking"
                checked={formData.requiresChecking}
                onChange={handleChange}
              />
              <Form.Check
                type="checkbox"
                label="Requires Verification"
                name="requiresVerification"
                checked={formData.requiresVerification}
                onChange={handleChange}
              />
              <Form.Check
                type="checkbox"
                label="Requires Approval"
                name="requiresApproval"
                checked={formData.requiresApproval}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="text-center">
              <Button type="submit" className="btn btn-primary">Save Document Setup</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Saved Documents Table */}
      <Card className="table-container">
        <Card.Body>
          <h3 className="text-center mb-3">Saved Documents</h3>
          {documents.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Document Name</th>
                  <th>Audit</th>
                  <th>Checking</th>
                  <th>Verification</th>
                  <th>Approval</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{doc.documentName}</td>
                    <td>{doc.requiresAudit ? "✔️" : "❌"}</td>
                    <td>{doc.requiresChecking ? "✔️" : "❌"}</td>
                    <td>{doc.requiresVerification ? "✔️" : "❌"}</td>
                    <td>{doc.requiresApproval ? "✔️" : "❌"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center">No documents added yet.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DocumentSetup;
