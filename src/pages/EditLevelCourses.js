
import React, {useState, useEffect} from 'react';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card, Alert } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars, FaChevronCircleRight, FaDollarSign, FaFile, FaBan } from "react-icons/fa";
import { usePage } from '../layouts/pageContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Select from "react-select";
import { sampleCourses, sampleLevelCourses } from '../_services/dataServices';

const EditLevelCourses = () => {
  useEffect(() => {
    setPageTitle('Program Level Course');
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
                  <Form.Label className='required'>Select Course</Form.Label>
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
            <Card.Header as="h5"  className='primary-bg'>  Courses Allocated</Card.Header>
            <Card.Body>
              <div className="custom-table-wrapper">
                <Table striped bordered hover className="custom-table" >
                  <thead className="table-success">
                    <tr>
                      <th>Code</th>
                      <th>Course Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleLevelCourses.length === 0 && (
                      <tr className="text-center">
                        <td colSpan="4" className="text-danger">No records found.</td>
                      </tr>
                    )}
                    {sampleLevelCourses.map((structure, index) => (
                      <tr key={index}>
                        <td>{structure.levelCourseCode}</td>
                        <td>{structure.courseName} ({structure.courseCode})</td>
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

export default EditLevelCourses;