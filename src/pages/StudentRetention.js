
import React, {useState, useEffect} from 'react';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card, Alert, ListGroup } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars, FaChevronCircleRight, FaDollarSign, FaFile, FaBan } from "react-icons/fa";
import { usePage } from '../layouts/pageContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Select from "react-select";
import { samplePrograms, sampleStudents, sampleProgramOutline } from '../_services/dataServices';

const StudentRetention = () => {
  useEffect(() => {
    setPageTitle('Student Retention Evaluation');
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
    <div className='h-100 w-100'>
      <Row>
        <h5> {student.firstName} {student.lastName} ({student.studentId})</h5>
        <Col xl={4} className='mb-3'>
          <div className="h-100 shadow border">
            <Card className="mb-xl-0">
              <Card.Header as="h5"  className='primary-bg'> Curent Level</Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Program Name:</strong> {student.programName}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Study Level:</strong> {student.studyLevel}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
            <Card className="">
              <Card.Header as="h5"  className='primary-bg'> Next Level</Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Program Name:</strong> {student.programName}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Study Level:</strong> {student.studyLevel}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </div>
        </Col>
        <Col xl={8} className='mb-3'>
          <Card className="h-100 mb-3">
            <Card.Header as="h5"  className='primary-bg'> Financial Statement</Card.Header>
            <Card.Body>
              
            </Card.Body>
            <Card.Footer className='bg-success'>
              <span> Qualifies </span>
            </Card.Footer>
          </Card>
          <Card className="h-100 mb-3">
            <Card.Header as="h5"  className='primary-bg'> Results Statement</Card.Header>
            <Card.Body>
              
            </Card.Body>
            <Card.Footer className='bg-warning'>
              <span> Not Qualified </span>
            </Card.Footer>
          </Card>
      <Row>
        <Col sm={4} className='mb-3 offset-sm-4'>
          <Button type='submit' variant="primary">
            Advance
          </Button>
        </Col>
      </Row>
        </Col>
      </Row>
    </div>
    </>
  );
};

export default StudentRetention;