
import React, {useState, useEffect} from 'react';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card, Alert } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars, FaChevronCircleRight, FaDollarSign, FaFile, FaBan } from "react-icons/fa";
import { usePage } from '../layouts/pageContext';
import Select from "react-select";
import { sampleCourses, sampleStaffMembers, sampleCourseDirectors} from '../_services/dataServices';

const NumberingSystem = () => {
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
    setPageTitle('Numbering System');
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

  const filteredList = sampleCourseDirectors.filter(listItem => {
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
        <Col lg={6} className='mb-3'>
          <Card className="h-100 shadow">
            <Card.Body>
              <h5 className='text-center'>Student Numbering</h5>
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Row>
                  <Col md={4} className='mb-3'>
                    <Form.Group>
                      <Form.Label>Prefix Code</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="e.g STU" 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>Next Student Number (Auto Incriment)</Form.Label>
                      <Form.Control type="text" placeholder="e.g 5000001" />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary"  className="mt-3 m-auto align-self-center">Save Settings</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className='mb-3'>
          <Card className="h-100 shadow">
            <Card.Body>
              <h5 className='text-center'>Staff Numbering</h5>
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Row>
                  <Col md={4} className='mb-3'>
                    <Form.Group>
                      <Form.Label>Prefix Code</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="e.g STA" 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>Next Staff Number (Auto Incriment)</Form.Label>
                      <Form.Control type="text" placeholder="e.g 1001" />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary"  className="mt-3 m-auto align-self-center">Save Settings</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className='mb-3'>
          <Card className="h-100 shadow">
            <Card.Body>
              <h5 className='text-center'>Invoice Numbering</h5>
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Row>
                  <Col md={4} className='mb-3'>
                    <Form.Group>
                      <Form.Label>Prefix Code</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="e.g INV-" 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>Next Invoice Number (Auto Incriment)</Form.Label>
                      <Form.Control type="text" placeholder="e.g 202500001" />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary"  className="mt-3 m-auto align-self-center">Save Settings</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className='mb-3'>
          <Card className="h-100 shadow">
            <Card.Body>
              <h5 className='text-center'>Receipt Numbering</h5>
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Row>
                  <Col md={4} className='mb-3'>
                    <Form.Group>
                      <Form.Label>Prefix Code</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="e.g RCT-" 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group>
                      <Form.Label>Next Invoice Number (Auto Incriment)</Form.Label>
                      <Form.Control type="text" placeholder="e.g 202500001" />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary"  className="mt-3 m-auto align-self-center">Save Settings</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
    </>
  );
};

export default NumberingSystem;