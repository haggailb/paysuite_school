import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Tabs, Tab, Alert, Row, Col, md } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import Select from "react-select"
import { getBankAccounts } from '../../_services/bankAccountServices';
import { createDefaultAccount } from '../../_services/defaultAccountServices';
import { useMessageModal } from '../ModalContext';
import GlassLoader from "../GlassLoader";

const NewDefaultAccount = () => {
  const [validated, setValidated] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const { showMessageModal } = useMessageModal();
  const [newDefault, setNewDefault] = useState({
    accountId: "",
    serviceName: "",
  });
     
  const [accounts, setAccounts] = useState([]);
     
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const result = await getBankAccounts(); 
        setAccounts(result);
      } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      }
    };
  
    fetchAccounts();
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
      const result = await createDefaultAccount(newDefault.accountId, newDefault.serviceName);
      showMessageModal({
        heading: 'Success!',
        message: `Account details saved successfully`,
        messageType: 'success',
      });
      setNewDefault({
        accountId: "",
        serviceName: "",
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
  
  const handleSelectChange = (field, value) => {
    if (!value) return;
    setNewDefault(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDefault({ ...newDefault, [name]: value });
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
            <Form.Label>Account Number</Form.Label>
            <Select
              required
              options={accounts}
              getOptionLabel={(e) => `${e.accountName} - ${e.accountNumber}`}
              getOptionValue={(e) => e.accountId}
              onChange={(selectedOption) => handleSelectChange("accountId", selectedOption.accountId)}
              placeholder="-- Select Account --"
            />
          </Form.Group>
          <Form.Group className="my-3">
          <Form.Label>Service Name</Form.Label>
            <Form.Control 
              name="serviceName" 
              type="text" 
              placeholder="Enter service name" 
              onChange={handleChange} 
              value={newDefault.serviceName}
              required
            />
            <Form.Control.Feedback type="invalid">
              Service name is required.
            </Form.Control.Feedback>
          </Form.Group>
          <div md={6} className="">
            <Button type="submit" className="bg-primary hoverable w-100">Save</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default NewDefaultAccount;
