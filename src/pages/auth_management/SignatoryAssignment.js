import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Table, Row, Col } from "react-bootstrap";
import { FaUser, FaCheckCircle, FaFileInvoice, FaUserShield, FaEye, FaEyeSlash, FaTrash, FaEdit, FaPlus } from "react-icons/fa";


const SignatoryAssignment = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [signatories, setSignatories] = useState([]);

  const users = [
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
    { id: 3, name: "User 3" },
  ]; // Example users list

  // Simulate fetching documents from an API
  useEffect(() => {
    const fetchDocuments = () => {
      // Dummy list of documents
      const dummyDocuments = [
        { documentName: "Payment Voucher", requiresAudit: true },
        { documentName: "Expense Report", requiresChecking: true },
        { documentName: "Invoice", requiresApproval: true },
        { documentName: "Purchase Order", requiresVerification: true },
      ];
      setDocuments(dummyDocuments);
    };

    fetchDocuments(); // Fetch documents
  }, []);

  // Handle adding signatory to a document
  const handleAddSignatory = () => {
    if (selectedDocument && selectedUser && selectedRole) {
      const newSignatory = {
        documentName: selectedDocument,
        user: selectedUser,
        role: selectedRole,
      };
      setSignatories([...signatories, newSignatory]);
      setSelectedUser("");
      setSelectedRole("");
    }
  };

  return (
    <Container className="flex-column justify-content-center align-items-center min-vh-100 bg-light">
          <h2 className="page-title text-center mb-4">Signatory Assignment</h2>
      <Card className="form-container w-75 mb-4">
        <Card.Body>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label><FaFileInvoice className="icon"/> Select Document</Form.Label>
                        <Form.Select value={selectedDocument} onChange={(e) => setSelectedDocument(e.target.value)} required>
                        
                        <option value="">--Select a document--</option>
                        {documents.map((doc, index) => (
                            <option key={index} value={doc.documentName}>
                            {doc.documentName}
                            </option>
                        ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label><FaUser className="icon"/> Select Signatory</Form.Label>
                        <Form.Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                        <option value="">--Select a user--</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.name}>
                            {user.name}
                            </option>
                        ))}
                        </Form.Select>
                    </Form.Group>

                </Col>
                    <Form.Group className="mb-3">
                        <Form.Label><FaCheckCircle className="icon"/>Select Role</Form.Label>
                        <Form.Control
                        as="select"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        >
                        <option value="">Select a role</option>
                        <option value="Checking">Checking</option>
                        <option value="Verification">Verification</option>
                        <option value="Approval">Approval</option>
                        </Form.Control>
                    </Form.Group>
            </Row>
          <Button type="button" onClick={handleAddSignatory} className="btn btn-submit mb-3">
            Add Signatory
          </Button>
        </Card.Body>
      </Card>

      {/* Signatories Table */}
      <Card className="table-container">
        <Card.Body>
          <h3 className="text-center mb-3">Assigned Signatories</h3>
          {signatories.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Document Name</th>
                  <th>User</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {signatories.map((signatory, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{signatory.documentName}</td>
                    <td>{signatory.user}</td>
                    <td>{signatory.role}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center">No signatories assigned yet.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SignatoryAssignment;
