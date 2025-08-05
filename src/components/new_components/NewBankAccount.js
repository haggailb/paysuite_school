import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Tabs, Tab, Alert, Row, Col, md } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import Select from "react-select"
import { getAllBranches } from '../../_services/branchServices';
import { createBankAccount } from '../../_services/bankAccountServices';
import { useMessageModal } from '../../components/ModalContext';
import GlassLoader from "../GlassLoader";

const NewBankAccount = () => {
  const [validated, setValidated] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const { showMessageModal } = useMessageModal();
  const [newBankAccount, setNewBankAccount] = useState({
    branchId: "",
    accountName: "",
    accountNumber: "",
  });
     
  const [bankList, setBranches] = useState([]);
     
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const result = await getAllBranches(); 
        setBranches(result.rows);
      } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      }
    };
  
    fetchBranches();
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
      const result = await createBankAccount(newBankAccount);
      showMessageModal({
        heading: 'Success!',
        message: `Account details saved successfully`,
        messageType: 'success',
      });
      setNewBankAccount({
        branchId: "",
        accountName: "",
        accountNumber: ""
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
    setNewBankAccount(prev => ({
      ...prev,
      [field]: selectedOption.branchId
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBankAccount({ ...newBankAccount, [name]: value });
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
            <Form.Label>Bank / Branch</Form.Label>
            <Select
              required
              options={bankList}
              getOptionLabel={(e) => `${e.branchName} - ${e.bankName}`}
              getOptionValue={(e) => e.branchId}
              onChange={(selectedOption) => handleSelectChange("branchId", selectedOption)}
              placeholder="-- Select Branch --"
            />
          </Form.Group>
          <Form.Group className="my-3">
          <Form.Label>Account Name</Form.Label>
            <Form.Control 
              name="accountName" 
              type="text" 
              placeholder="Enter account name" 
              onChange={handleChange} 
              value={newBankAccount.accountName}
              required
            />
            <Form.Control.Feedback type="invalid">
              Account Name is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="my-3">
          <Form.Label>Account Number</Form.Label>
            <Form.Control 
              name="accountNumber" 
              type="number" 
              placeholder="Enter account number" 
              onChange={handleChange} 
              value={newBankAccount.accountNumber}
              required
            />
            <Form.Control.Feedback type="invalid">
              Account Number is required.
            </Form.Control.Feedback>
          </Form.Group>
          <div md={6} className="">
            <Button type="submit" className="bg-primary hoverable">Save</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default NewBankAccount;
