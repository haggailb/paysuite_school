import React, { useState } from "react";
import { Container, Card, Form, Button, Tabs, Tab, Alert, Row, Col } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { createUserRole } from '../../_services/authServices';
import { useMessageModal } from '../../components/ModalContext';
import GlassLoader from "../GlassLoader";

const NewUserRole = () => {
  const [key, setKey] = useState("personal");
  const [validated, setValidated] = useState(false);
  const { showMessageModal } = useMessageModal();
  const [loading, setLoading] = useState(false);
  const [newUserRole, setFormData] = useState({
    roleName: "",
    roleDesc: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
    }

    setValidated(true);
    setLoading(true);
  
    try {
      const result = await createUserRole(newUserRole);
      showMessageModal({
        heading: 'Success!',
        message: `✅ ${result.message}`,
        messageType: 'success',
      });
      setFormData({ roleName: "", roleDesc: "" });
    } catch (error) {
      showMessageModal({
        heading: 'Saving Failed',
        message: `❌ ${error.message}`,
        messageType: 'error',
      });
      console.error("❌ Error submitting form:", error.message);
    }
    setLoading(false);
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...newUserRole, [name]: value });
  };

  if (loading)  return (
    <div className="form-container mb-5 position-relative">
      <GlassLoader show={loading} />
    </div>
  );

  return (
    <div >
      <Card>
        <Card.Header className="text-center">
          <Card.Subtitle className="mb-2 text-muted text-danger">All fields are mandatory</Card.Subtitle>
        </Card.Header>
        <Card.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="roleName">
              <Form.Label>Role Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter bank name"
                name="roleName"
                value={newUserRole.roleName}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Role name is required.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="my-3" controlId="roleDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter role description"
                name="roleDesc"
                value={newUserRole.roleDesc}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Role description is required.
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" className="bg-primary hoverable w-100">Save</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewUserRole;
