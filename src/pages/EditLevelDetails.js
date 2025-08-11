
import React, {useState, useEffect} from 'react';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card, Alert } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars, FaChevronCircleRight, FaDollarSign, FaFile, FaBan } from "react-icons/fa";
import { usePage } from '../layouts/pageContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Select from "react-select";

const EditProgramLevel = () => {
  useEffect(() => {
    setPageTitle('Edit Program Level');
    setBackUrl('/programs');
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const { programCode } = useParams();
  const program = location.state?.program; 
  const studyLevel = location.state?.studyLevel; 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setPageTitle, setBackUrl } = usePage();
  const [validated, setValidated] = useState(false);
  const [feedback, setFeedback] = useState(null);
    
  if (!programCode) {
    navigate('/programs');
  }

  const [formData, setFormData] = useState({
    levelId: studyLevel.levelId,
    levelName: studyLevel.levelName,
    studyYear: studyLevel.studyYear,
    semester: studyLevel.semester,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  if (!program) {
    return <Alert variant="danger">Unknown program data available.</Alert>;
  }

  return (
    <>
    <div className='mb-3 h-100 w-100'>
      <Row>
        {/* Left Panel */}
        <h5> {program.programName} ({program.programCode})</h5>
        <Col md={8} className='mb-3 offset-md-2'>
          <Card className="h-100">
            <Card.Header as="h5"  className='primary-bg'> Edit Level: {studyLevel.levelCode}</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Level Name</Form.Label>
                  <Form.Control
                    required
                    min={1}
                    name='levelName'
                    type="text"
                    placeholder="e.g. Y1-S2, Entry Level"
                    value={formData.levelName}
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
                  Update Level
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

export default EditProgramLevel;