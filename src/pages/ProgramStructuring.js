
import React, {useState, useEffect} from 'react';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card, Alert } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars, FaChevronCircleRight, FaDollarSign, FaFile, FaBan } from "react-icons/fa";
import { usePage } from '../layouts/pageContext';
import { useNavigate, useParams } from 'react-router-dom';
import Select from "react-select";
import { sampleCourses, sampleProgramOutline } from '../_services/dataServices';

const ProgramStructuring = () => {
  const navigate = useNavigate();
  const { programCode } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setPageTitle, setBackUrl } = usePage();
  const [validated, setValidated] = useState(false);
  const [allocatedCourses, setAllocatedCourses] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");  
  const [currentPage, setCurrentPage] = useState(1);
    
  if (!programCode) {
    navigate('/program-structures');
  }

  const [formData, setFormData] = useState({
    programCode: programCode,
    studyLevel: 1,
    semester: 1,
    courseCode: '',
  });
  useEffect(() => {
    setPageTitle('Program Structuring');
    setBackUrl('/program-structures');
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

  const filteredList = sampleProgramOutline.filter(listItem => {
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
              <h5>Allocate Courses</h5>
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Program Code</Form.Label>
                  <Form.Control 
                    required
                    name='programCode' 
                    value={formData.programCode || programCode} 
                    readOnly 
                  />
                  <Form.Control.Feedback type="invalid"> Invalid Program Code. </Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className='required'>Study Level</Form.Label>
                      <Form.Control
                        required
                        min={1}
                        name='studyLevel'
                        type="number"
                        placeholder="e.g. 1"
                        value={formData.studyLevel}
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid"> Study Level is required. </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className='required'>Semester</Form.Label>
                      <Form.Control
                        required
                        name='semester'
                        min={1}
                        type="number"
                        placeholder="e.g. 1"
                        value={formData.semester}
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid"> Invalid Semester. </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Select Courses</Form.Label>
                  <Select
                    required
                    name="courseCode"
                    options={sampleCourses}
                    getOptionLabel={(e) =>  `${e.courseCode} - ${e.courseName}` }
                    getOptionValue={(e) => e.courseCode}
                    onChange={(selectedOption) => handleSelectChange("courseCode", selectedOption.courseCode)}
                    placeholder="-- Select faculty --"
                  />
                  <Form.Control.Feedback type="invalid"> Select a valid course. </Form.Control.Feedback>
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
              <h5>Allocated Courses for {formData.programCode}</h5>
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
                      <th>Structure Code</th>
                      <th>Level</th>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.length === 0 && (
                      <tr className="text-center">
                        <td colSpan="4" className="text-danger">No records found.</td>
                      </tr>
                    )}
                    {filteredList.map((structure, index) => (
                      <tr key={index}>
                        <td>{structure.structuredCode}</td>
                        <td>Y{structure.studyLevel}-S{structure.semester}</td>
                        <td>{structure.courseCode}</td>
                        <td>{structure.courseName}</td>
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

export default ProgramStructuring;