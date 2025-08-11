
import React, {useState, useEffect} from 'react';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card, Alert } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars, FaChevronCircleRight, FaDollarSign, FaFile, FaBan } from "react-icons/fa";
import { usePage } from '../layouts/pageContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Select from "react-select";
import { samplePrograms, sampleStudents, sampleProgramOutline } from '../_services/dataServices';

const StudentAdmission = () => {
  useEffect(() => {
    setPageTitle('Student Admission');
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const { studentId } = useParams();
  const student = location.state?.student; 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setPageTitle, setBackUrl } = usePage();
  const [validated, setValidated] = useState(false);
  const [feedback, setFeedback] = useState(null);
    
  if (!studentId) {
    navigate('/programs');
  }

  const [formData, setFormData] = useState({
    studentId: student.studentId,
    programId: 0,
    levelId: 0,
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

  if (!student) {
    return <Alert variant="danger">Unknown student data.</Alert>;
  }

  return (
    <>
    <div className='mb-3 h-100 w-100'>
      <Row>
        {/* Left Panel */}
        <h5> {student.firstName} {student.lastName} ({student.studentId})</h5>
        <Col md={8} className='mb-3 offset-md-2'>
          <Card className="h-100">
            <Card.Header as="h5"  className='primary-bg'> Admit Student</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Program Name</Form.Label>
                  <Select
                    required
                    name="programId"
                    options={samplePrograms}
                    getOptionLabel={(e) => e.programName }
                    getOptionValue={(e) => e.programId}
                    onChange={(selectedOption) => handleSelectChange("programId", selectedOption.programId)}
                    placeholder="-- Select Program --"
                  />
                  <Form.Control.Feedback type="invalid"> Study Level is required. </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Level Name</Form.Label>
                  <Select
                    required
                    name="levelId"
                    options={sampleProgramOutline}
                    getOptionLabel={(e) => e.levelName }
                    getOptionValue={(e) => e.levelId}
                    onChange={(selectedOption) => handleSelectChange("levelId", selectedOption.levelId)}
                    placeholder="-- Select Level --"
                  />
                  <Form.Control.Feedback type="invalid"> Study Level is required. </Form.Control.Feedback>
                </Form.Group>
                                  
                {feedback && <Alert variant={feedback.type}>{feedback.message}</Alert>}

                <Button type='submit' variant="primary">
                  Admit Student
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
    </>
  );
};

export default StudentAdmission;