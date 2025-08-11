
import React, {useState, useEffect} from 'react';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card, Alert } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars, FaChevronCircleRight, FaDollarSign, FaFile, FaBan } from "react-icons/fa";
import { usePage } from '../layouts/pageContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Select from "react-select";
import { sampleCOA, sampleLevelFees } from '../_services/dataServices';

const EditLevelFees = () => {
  useEffect(() => {
    setPageTitle('Program Level Fees');
  }, []);

  const navigate = useNavigate();
  const { programCode } = useParams();
  const location = useLocation();
  const program = location.state?.program; 
  const studyLevel = location.state?.studyLevel;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setPageTitle } = usePage();
  const [validated, setValidated] = useState(false);
  const [feedback, setFeedback] = useState(null);
    
  if (!programCode) {
    navigate(-1);
  }

  const [formData, setFormData] = useState({
    programCode: programCode,
    studyLevel: 1,
    semester: 1,
    courseCode: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (field, selectedValue) => {
    if (!selectedValue) return;
    setFormData(prev => ({
      ...prev,
      [field]: selectedValue
    }));
  };

  // Save course allocation
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
  
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
  
    setValidated(true);
    setLoading(true);
      
    setLoading(false);
  };

  return (
    <>
    <div className='mb-3 h-100 w-100'>
      <Row>
        <h5> {program.programName} ({studyLevel.levelCode})</h5>
        <Col md={4} className='mb-3'>
          <Card className="h-100">
            <Card.Header as="h5"  className='primary-bg'> Allocate Courses</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Select Account</Form.Label>
                  <Select
                    required
                    name="coaCode"
                    options={sampleCOA}
                    getOptionLabel={(e) =>  `${e.account_code} - ${e.account_name}` }
                    getOptionValue={(e) => e.account_code}
                    onChange={(selectedOption) => handleSelectChange("coaCode", selectedOption.account_code)}
                    placeholder="-- Select faculty --"
                  />
                  <Form.Control.Feedback type="invalid"> Select a valid course. </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Details</Form.Label>
                  <Form.Control
                    required
                    name='details'
                    min={1}
                    type="text"
                    placeholder="Enter details"
                    value={formData.details}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid"> Please enter a valid description. </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className='required'>Amount / Charge</Form.Label>
                  <Form.Control
                    required
                    name='amount_charged'
                    min={1}
                    type="number"
                    placeholder="Enter amount charged"
                    value={formData.amount_charged}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid"> Invalid amount. </Form.Control.Feedback>
                </Form.Group>
                {feedback && <Alert variant={feedback.type}>{feedback.message}</Alert>}

                <Button type='submit' variant="primary">
                  Save Fees
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Panel */}
        <Col md={8} className='mb-3'>
          <Card className="h-100">
            <Card.Header as="h5"  className='primary-bg'>  Courses Allocated</Card.Header>
            <Card.Body>
              <div className="custom-table-wrapper">
                <Table striped bordered hover className="custom-table" >
                  <thead className="table-success">
                    <tr>
                      <th>Semester</th>
                      <th>Account Name</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleLevelFees.length === 0 && (
                      <tr className="text-center">
                        <td colSpan="4" className="text-danger">No records found.</td>
                      </tr>
                    )}
                    {sampleLevelFees.map((fee, index) => (
                      <tr key={index}>
                        <td>{fee.feeCode}</td>
                        <td>{fee.coaCode} - {fee.coaName}</td>
                        <td>{fee.amount}</td>
                        <td>
                          <Dropdown as={ButtonGroup}>
                            <Button variant="outline-secondary" size="sm">
                              Options
                            </Button>
                            <Dropdown.Toggle split variant="outline-secondary" size="sm" id={`dropdown-split-${index}`} />
        
                            <Dropdown.Menu>
                              <Dropdown.Item className=" btn text-danger" onClick={() => {}}>
                                <i className='bi bi-trash3 me-2'></i> Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
    </>
  );
};

export default EditLevelFees;