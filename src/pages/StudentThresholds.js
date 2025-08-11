
import React, {useState, useEffect} from 'react';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card, Alert } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars, FaChevronCircleRight, FaDollarSign, FaFile, FaBan } from "react-icons/fa";
import { usePage } from '../layouts/pageContext';
import Select from "react-select";
import { samplePassGrading } from '../_services/dataServices';

const StudentThresholds = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setPageTitle, setBackUrl } = usePage();
  const [validated, setValidated] = useState(false);
  const [allocatedCourses, setAllocatedCourses] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");  
  const [currentPage, setCurrentPage] = useState(1);
    
  const [formData, setFormData] = useState({
    userLevel: '',
    modueId: 0,
    mobuleName: '',
  });
  useEffect(() => {
    setPageTitle('Student Thresholds');
    setBackUrl('/');
  }, []);


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
        <Col lg={6} xl={4} className='mb-3'>
          <Card className="h-100 shadow">
            <Card.Body>
              <h5 className='text-center'>Payment for admission to classes</h5>
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group>
                  <Form.Label>% of Tuition Fees</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="minPaymentForClasses" 
                    value={formData.minPaymentForClasses}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    placeholder="e.g 50%" 
                  />
                </Form.Group>
                <Button variant="primary"  className="mt-3 m-auto align-self-center">Save Settings</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} xl={4} className='mb-3'>
          <Card className="h-100 shadow">
            <Card.Body>
              <h5 className='text-center'>Payment for writting exams</h5>
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group>
                  <Form.Label>% of Tuition Fees</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="minPaymentForExams" 
                    value={formData.minPaymentForExams}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    placeholder="e.g 75%" 
                  />
                </Form.Group>
                <Button variant="primary"  className="mt-3 m-auto align-self-center">Save Settings</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} xl={4} className='mb-3'>
          <Card className="h-100 shadow">
            <Card.Body>
              <h5 className='text-center'>Payment for viewing results</h5>
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group>
                  <Form.Label>% of Tuition Fees</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="minPaymentForViewingResults" 
                    value={formData.minPaymentForViewingResults}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    placeholder="e.g 75%" 
                  />
                </Form.Group>
                <Button variant="primary"  className="mt-3 m-auto align-self-center">Save Settings</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

      </Row>
      
      <Row>
        {/* Left Panel */}
        <Col md={4} className='mb-3'>
          <Card className="h-100">
            <Card.Body>
              <h5>Grade Allocation</h5>
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Grade Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="passGradeName" 
                    value={formData.passGradeName}
                    onChange={handleChange}
                    required
                    min="0"
                    max="100"
                    placeholder="e.g A+" 
                  />
                  <Form.Control.Feedback type="invalid"> Grade is required </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Percentage Range</Form.Label>
                  <Row>
                    <Col xl={6}>
                      <Form.Control 
                        type="number" 
                        name="minPercentage" 
                        value={formData.minPercentage}
                        onChange={handleChange}
                        required
                        placeholder="Minnimum e.g 95%" 
                      />
                    </Col>
                    <Col xl={6}>
                      <Form.Control 
                        type="number" 
                        name="maxPercentage" 
                        value={formData.maxPercentage}
                        onChange={handleChange}
                        required
                        placeholder="Maximum e.g 100%" 
                      />
                    </Col>
                  </Row>
                  <Form.Control.Feedback type="invalid"> Select a staff member. </Form.Control.Feedback>
                </Form.Group>
                {feedback && <Alert variant={feedback.type}>{feedback.message}</Alert>}

                <Button type='submit' variant="primary">
                  Save Allocation
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Panel */}
        <Col md={8} className='mb-3'>
          <Card className="h-100">
            <Card.Body>
              <div className="custom-table-wrapper">
                <Table striped bordered hover className="custom-table" >
                  <thead className="table-success">
                    <tr>
                      <th>Grade</th>
                      <th>Percentage Range</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {samplePassGrading.length === 0 && (
                      <tr className="text-center">
                        <td colSpan="4" className="text-danger">No records found.</td>
                      </tr>
                    )}
                    {samplePassGrading.map((grade, index) => (
                      <tr key={index}>
                        <td>{grade.grade}</td>
                        <td>{grade.minPercentage}%-{grade.maxPercentage}%</td>
                        <td>
                          <Dropdown as={ButtonGroup}>
                            <Button variant="outline-secondary" size="sm">
                              Options
                            </Button>
                            <Dropdown.Toggle split variant="outline-secondary" size="sm" id={`dropdown-split-${index}`} />
        
                            <Dropdown.Menu>
                              <Dropdown.Item className=" btn" onClick={() => {}}>
                                <i className='bi bi-pen me-2'></i> Edit
                              </Dropdown.Item>
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

export default StudentThresholds;