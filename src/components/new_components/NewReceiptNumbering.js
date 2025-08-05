import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Tabs, Tab, Alert, Row, Col, md } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import Select from "react-select"
import { getUsers } from '../../_services/authServices';
import { saveSerial } from '../../_services/receiptServices';
import { useMessageModal } from '../ModalContext';
import GlassLoader from "../GlassLoader";

const NewReceiptNumbering = () => {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showMessageModal } = useMessageModal();
  const [newSerial, setSerial] = useState({
    userId: 0,
    receiptNo: 0,
    comment: "",
  });
     
  const [users, setUsers] = useState([]);
     
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getUsers(0); 
        setUsers(result.rows);
      } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      }
    };
  
    fetchUsers();
  }, []);

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
      const result = await saveSerial(newSerial);
      showMessageModal({
        heading: 'Success!',
        message: `${result.message}`,
        messageType: 'success',
      });
      setSerial({
        userId: 0,
        receiptNo: "",
        comment: "",
      });
    } catch (error) {
        showMessageModal({
          heading: 'Server Error!',
          message: `❌ ${error.message}`,
          messageType: 'error',
        });
    }
    setLoading(false);
  };
  
  const handleSelectChange = (field, selectedOption) => {
    if (!selectedOption) return;
    setSerial(prev => ({
      ...prev,
      [field]: selectedOption.userId
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSerial({ ...newSerial, [name]: value });
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
        <i className="text-danger">All fields are mandatory</i>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="my-3">
            <Form.Label>User Name</Form.Label>
            <Select
              required
              options={users}
              getOptionLabel={(e) => `${e.userName}`}
              getOptionValue={(e) => e.userId}
              onChange={(selectedOption) => handleSelectChange("userId", selectedOption)}
              placeholder="-- Select User --"
            />
          </Form.Group>
          <Form.Group className="my-3">
          <Form.Label>Receipt No</Form.Label>
            <Form.Control 
              name="receiptNo" 
              type="number" 
              placeholder="Enter Initial Receipt Number" 
              onChange={handleChange} 
              value={newSerial.receiptNo}
              required
            />
            <Form.Control.Feedback type="invalid">
              Receipt Number is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="my-3">
          <Form.Label>Comment</Form.Label>
            <Form.Control 
              name="comment" 
              type="text" 
              placeholder="Enter reference comment" 
              onChange={handleChange} 
              value={newSerial.comment}
              required
            />
            <Form.Control.Feedback type="invalid">
              Comment is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" className="bg-primary hoverable w-100">Save</Button>
        </Form>
      </Card>
    </div>
  );
};

export default NewReceiptNumbering;
