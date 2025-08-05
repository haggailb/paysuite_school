import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Tabs, Tab, Alert, Row, Col } from "react-bootstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import Select from "react-select"
import { createBranch } from '../../_services/branchServices';
import { getAllBanks } from '../../_services/bankServices';
import { useMessageModal } from '../../components/ModalContext';
import GlassLoader from "../GlassLoader";

const NewBranch = () => {
  const [validated, setValidated] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const { showMessageModal } = useMessageModal();
  const [newBranch, setFormData] = useState({
    bankId: "",
    branchName: "",
    branchCode: "",
    sortCode: "",
    swiftCode: "",
  });

  const [bankList, setBanks] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const result = await getAllBanks(); 
        setBanks(result.rows);
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
    const { bankId, branchName, branchCode, sortCode, swiftCode } = newBranch;
    console.log("🚀 newBranch values:", newBranch);
  
    try {
      const result = await createBranch(bankId, branchName, branchCode, sortCode, swiftCode);
      showMessageModal({
        heading: 'Success!',
        message: `Branch saved successfully`,
        messageType: 'success',
      });
      setFormData({
        bankId: "",
        branchName: "",
        branchCode: "",
        sortCode: "",
        swiftCode: "",
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
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...newBranch, [name]: value });
  };

  const handleSelectChange = (field, selectedOption) => {
    if (!selectedOption) return;
    // console.log("✅ Selected Bank:", selectedOption);
    setFormData(prev => ({
      ...prev,
      [field]: selectedOption.bankId
    }));
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
            <Form.Group className="my-3">
              <Form.Label>Bank Name</Form.Label>
              <Select
                required
                name="bankId"
                options={bankList}
                getOptionLabel={(e) => e.bankName}
                getOptionValue={(e) => e.bankId}
                onChange={(selectedOption) => handleSelectChange("bankId", selectedOption)}
                placeholder="-- Select Bank --"
              />
              <Form.Control.Feedback type="invalid">
                Bank ID is required.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="my-3" controlId="bankName">
              <Form.Label>Branch Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter bank name"
                name="branchName"
                onChange={handleChange}
                value={newBranch.branchName}
              />
              <Form.Control.Feedback type="invalid">
                Branch name is required.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="my-3" controlId="branchCode">
              <Form.Label>Branch Code (<i>e.g KAF</i>)</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter Short Branch Code"
                name="branchCode"
                onChange={handleChange}
                value={newBranch.branchCode}
              />
              <Form.Control.Feedback type="invalid">
                Branch code is required.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="my-3" controlId="sortCode">
              <Form.Label>Sort Code</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter Sort Code"
                name="sortCode"
                onChange={handleChange}
                value={newBranch.sortCode}
              />
              <Form.Control.Feedback type="invalid">
                Sort Code is required.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="my-3" controlId="swiftCode">
              <Form.Label>Swift code </Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter swift code"
                name="swiftCode"
                value={newBranch.swiftCode}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Swift codeis required.
              </Form.Control.Feedback>
            </Form.Group>

            <div className="text-center">
              <Button type="submit" className="bg-primary hoverable">Save</Button>
              <Button
                variant="secondary"
                className="mx-2"
                onClick={() => setFormData({ branchName: "", branchCode: "", swiftCode: "", sortCode: "" })}
                type="button"
              >
                Clear
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewBranch;
