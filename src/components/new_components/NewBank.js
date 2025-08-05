import React, { useState } from "react";
import { Container, Card, Form, Button, Tabs, Tab, Alert, Row, Col } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { createBank, updateBankField } from '../../_services/bankServices';
import { useMessageModal } from '../../components/ModalContext';
import GlassLoader from "../GlassLoader";

const NewBank = () => {
  const [key, setKey] = useState("personal");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const { showMessageModal } = useMessageModal();
  const [loading, setLoading] = useState(false);
  const [newBank, setFormData] = useState({
    bankName: "",
    bankCodeName: "",
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
    const bankName = newBank.bankName?.trim();
    const bankCodeName = newBank.bankCodeName?.trim();
  
    if (!bankName || !bankCodeName) {
      showMessageModal({
        heading: 'Server Error!',
        message: `❌ Please fill in all required fields.`,
        messageType: 'error',
      });
      return;
    }
  
    try {
      const result = await createBank(bankName, bankCodeName);
      showMessageModal({
        heading: 'Success!',
        message: `Bank saved successfully`,
        messageType: 'success',
      });
      setFormData({ bankName: "", bankCodeName: "" });
    } catch (error) {
      showMessageModal({
        heading: 'Server Error!',
        message: `❌ ${error.message}`,
        messageType: 'error',
      });
    }
  
    setLoading(false);
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...newBank, [name]: value });
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
        <Card.Header className="text-center">
          <Card.Subtitle className="mb-2 text-muted">All fields are mandatory</Card.Subtitle>
        </Card.Header>
        <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="my-3" controlId="bankName">
              <Form.Label>Bank Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter bank name"
                name="bankName"
                value={newBank.bankName}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Bank name is required.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="my-3" controlId="bankCodeName">
              <Form.Label>Bank Code Name (<i>e.g ZANACO</i>)</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter short name"
                name="bankCodeName"
                value={newBank.bankCodeName}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Bank code name is required.
              </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className="bg-primary hoverable w-100">Save</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewBank;
