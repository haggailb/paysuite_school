
import React, {useState, useEffect} from 'react';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card, Alert } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars, FaChevronCircleRight, FaDollarSign, FaFile, FaBan } from "react-icons/fa";
import { usePage } from '../layouts/pageContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Select from "react-select";
import { sampleProgramOutline } from '../_services/dataServices';

const ProgramOutlininng = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { programCode } = useParams();
  const program = location.state?.program; 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setPageTitle, setBackUrl } = usePage();
  const [validated, setValidated] = useState(false);
  const [allocatedCourses, setAllocatedCourses] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");  
  const [currentPage, setCurrentPage] = useState(1);
    
  if (!programCode) {
    navigate('/programs');
  }

  const handleEditLevel = (program, studyLevel) => {
    navigate(`./edit/${studyLevel.levelCode}`, { state: { program, studyLevel } });
  };

  const handleEditLevelCourses = (program, studyLevel) => {
    navigate(`./courses/${studyLevel.levelCode}`, { state: { program, studyLevel } });
  };

  const handleEditLevelFees = (program, studyLevel) => {
    navigate(`./fees/${studyLevel.levelCode}`, { state: { program, studyLevel } });
  };

  const [formData, setFormData] = useState({
    programCode: programCode,
    studyLevel: '',
    studyYear: 1,
    semester: 1,
  });
  useEffect(() => {
    setPageTitle('Program Outline');
    setBackUrl('/programs');
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

  if (!program) {
    return <Alert variant="danger">Unknown program data available.</Alert>;
  }

  return (
    <>
    <div className='mb-3 h-100 w-100'>
      <Row>
        {/* Left Panel */}
        <h5> {program.programName} ({program.programCode})</h5>
        <Col md={4} className='mb-3'>
          <Card className="h-100">
            <Card.Header as="h5"  className='primary-bg'> Add Level</Card.Header>
            <Card.Body>
              <Alert variant="danger">Levels must be captured in progressive order</Alert>
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Level Name</Form.Label>
                  <Form.Control
                    required
                    min={1}
                    name='studyLevel'
                    type="text"
                    placeholder="e.g. Y1-S2, Entry Level"
                    value={formData.studyLevel}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid"> Study Level is required. </Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col xs={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className='required'>Year</Form.Label>
                      <Form.Control
                        required
                        min={1}
                        name='studyYear'
                        type="number"
                        placeholder="e.g. 1"
                        value={formData.studyYear}
                        onChange={handleChange}
                      />
                      <Form.Control.Feedback type="invalid"> Year is required. </Form.Control.Feedback>
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
                {feedback && <Alert variant={feedback.type}>{feedback.message}</Alert>}

                <Button type='submit' variant="primary">
                  Save Level
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Panel */}
        <Col md={8} className='mb-3'>
          <Card className="h-100">
            <Card.Header as="h5" className='primary-bg'> 
              Study Levels
            </Card.Header>
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
                      <th>#</th>
                      <th>Level Code</th>
                      <th>Level Name</th>
                      <th>Courses</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.length === 0 && (
                      <tr className="text-center">
                        <td colSpan="4" className="text-danger">No records found.</td>
                      </tr>
                    )}
                    {filteredList.map((level, index) => (
                      <tr key={index}>
                        <td>{level.levelNumber}</td>
                        <td>{level.levelCode}</td>
                        <td>{level.levelName}</td>
                        <td>
                          {level.courses?.map((course, courseIndex) => (
                              <span key={courseIndex}><strong>{courseIndex + 1}: </strong>{course.courseName} <br></br></span> 
                          ))}</td>
                        <td>
                          <Dropdown as={ButtonGroup}>
                            <Button variant="outline-secondary" size="sm">
                              Options
                            </Button>
                            <Dropdown.Toggle split variant="outline-secondary" size="sm" id={`dropdown-split-${index}`} />
        
                            <Dropdown.Menu>
                              <Dropdown.Item className=" btn" onClick={() => {handleEditLevel(program, level)}}>
                                <i className='bi bi-pen me-2'></i> Edit Level Details
                              </Dropdown.Item>
                              <Dropdown.Item className=" btn" onClick={() => {handleEditLevelCourses(program, level)}}>
                                <i className='bi bi-journal-plus me-2'></i> Add / Edit Courses
                              </Dropdown.Item>
                              <Dropdown.Item className=" btn" onClick={() => {handleEditLevelFees(program, level)}}>
                                <i className='bi bi-cash-coin me-2'></i> Add / Edit Fees
                              </Dropdown.Item>
                              <Dropdown.Item className=" btn text-danger" onClick={() => {}}>
                                <i className='bi bi-trash3 me-2'></i> Delete Level
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

export default ProgramOutlininng;