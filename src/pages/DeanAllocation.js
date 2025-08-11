
import React, {useState, useEffect} from 'react';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card, Alert } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars, FaChevronCircleRight, FaDollarSign, FaFile, FaBan } from "react-icons/fa";
import { usePage } from '../layouts/pageContext';
import Select from "react-select";
import { sampleFaculties, sampleStaffMembers, sampleDeanAllocations} from '../_services/dataServices';

const DeanAllocation = () => {
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
    setPageTitle('Faculty Dean Allocation');
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

  const filteredList = sampleDeanAllocations.filter(listItem => {
    const searchValues = Object.values(listItem).join(' ').toLowerCase();
    return search
      .toLowerCase()
      .split(/\s+/)
      .every(word => searchValues.includes(word));
  });

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
        {/* Left Panel */}
        <Col md={4} className='mb-3'>
          <Card className="h-100">
            <Card.Body>
              <h5>Dean Allocation</h5>
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Faculty / School</Form.Label>
                  <Select
                    required
                    name="facultyId"
                    options={sampleFaculties}
                    getOptionLabel={(e) => e.facultyName }
                    getOptionValue={(e) => e.facultyId}
                    onChange={(selectedOption) => handleSelectChange("facultyId", selectedOption.facultyId)}
                    placeholder="-- Select Faculty / School --"
                  />
                  <Form.Control.Feedback type="invalid"> Invalid school / faculty. </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Staff Member</Form.Label>
                  <Select
                    name="staffId"
                    options={sampleStaffMembers}
                    getOptionLabel={(e) => ` ${e.title} ${e.firstName} ${e.lastName} - ${e.jobTitle}`}
                    getOptionValue={(e) => e.staffId}
                    onChange={(selectedOption) => handleSelectChange("", selectedOption.staffId)}
                    placeholder="-- Select Staff Member --"
                  />
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
              <Row>
                <Col md={4} className="mb-3">
                  <Form.Control
                    type="search"
                    placeholder="Search..."
                    className="my-2"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </Col>
                <Col md={8} className="mb-3 text-end justify-content-end d-flex align-items-center gap-2">
                  <Dropdown as={ButtonGroup}>
                    <Button variant="warning">
                      Export
                    </Button>
                    <Dropdown.Toggle split variant="warning" size="md" id={`exports`} />
        
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => {}}>
                        <Button variant="success" className="me-2"><FaFileCsv /> To CSV</Button>
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => {}}>
                        <Button  variant="warning" className="me-2"><FaFileExcel /> To Excel</Button>
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => {}}>
                        <Button variant="primary" className="me-2"><FaPrint/> Print</Button>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button  className="me-2 outline-primary"><FaRecycle/></Button>
                </Col>
              </Row>
              <div className="custom-table-wrapper">
                <Table striped bordered hover className="custom-table" >
                  <thead className="table-success">
                    <tr>
                      <th>Faculty Code</th>
                      <th>Faculty Name</th>
                      <th>Dean</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.length === 0 && (
                      <tr className="text-center">
                        <td colSpan="4" className="text-danger">No records found.</td>
                      </tr>
                    )}
                    {filteredList.map((deans, index) => (
                      <tr key={index}>
                        <td>{deans.facultyCode}</td>
                        <td>{deans.facultyName}</td>
                        <td>{deans.staffName}</td>
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

export default DeanAllocation;