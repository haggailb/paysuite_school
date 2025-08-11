
import React, {useState, useEffect} from 'react';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card, Alert, ListGroup } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars, FaChevronCircleRight, FaDollarSign, FaFile, FaBan } from "react-icons/fa";
import { usePage } from '../layouts/pageContext';
import Select from "react-select";
import { sampleSchedules} from '../_services/dataServices';
import { useLocation, useParams } from "react-router-dom";
import ExamScheduleGantt from "../components/ExamScheduleGantt";

const ExamSchedule = () => {
  const { examCode } = useParams();
  const location = useLocation();
  const exam = location.state?.exam; 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setPageTitle, setBackUrl } = usePage();
  const [validated, setValidated] = useState(false);
  const [search, setSearch] = useState("");  
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showGantt, setShowGantt] = useState(false);

  const handleEditClick = (schedule) => {
    setSelectedSchedule(schedule);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedSchedule(null);
  };
  
  const [formData, setFormData] = useState({
    userLevel: '',
    modueId: 0,
    mobuleName: '',
  });
  useEffect(() => {
    setPageTitle('Exam Schedule');
    setBackUrl('/exams');
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

  const filteredList = sampleSchedules.filter(listItem => {
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

  if (!exam || !examCode) {
    return <Alert variant="danger">No exam data available.</Alert>;
  }

  return (
    <>
    <div className='mb-3 h-100 w-100'>
      <Row>
        <Col xl={8} className="mb-3 offset-xl-2">
          <Card className="h-100 shadow-sm">
            <Card.Header as="h5" className="primary-bg">
              Exam Details
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Program Name:</strong> {exam.programName}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Study Level:</strong> Y{exam.studyLevel}S{exam.semester}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Exam Code:</strong> {exam.examCode}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Exam Name:</strong> {exam.examName}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Exam Year:</strong> {exam.examYear}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={8} className='mb-3 offset-xl-2'>
          <Card className="h-100">
            <Card.Header> Course Schedule </Card.Header>
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
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Exam Venue</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.length === 0 && (
                      <tr className="text-center">
                        <td colSpan="4" className="text-danger">No records found.</td>
                      </tr>
                    )}
                    {filteredList.map((schedule, index) => (
                      <tr key={index}>
                        <td>{schedule.courseCode}</td>
                        <td>{schedule.courseName}</td>
                        <td>{schedule.scheduledDate}</td>
                        <td>{schedule.startTime} - {schedule.endTime}</td>
                        <td>{schedule.examVenue}</td>
                        <td>
                          <Dropdown as={ButtonGroup}>
                            <Button variant="outline-secondary" size="sm">
                              Options
                            </Button>
                            <Dropdown.Toggle split variant="outline-secondary" size="sm" id={`dropdown-split-${index}`} />
        
                            <Dropdown.Menu>
                              <Dropdown.Item className=" btn" onClick={() => handleEditClick(schedule)}>
                                <i className='bi bi-pen me-2'></i> Edit Schedule
                              </Dropdown.Item>
                              <Dropdown.Item className=" text-danger" onClick={() => handleEditClick(schedule)}>
                                <i className='bi bi-trash me-2'></i> Remove Paper
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <Card.Footer>
                <Button variant="primary" onClick={() => setShowGantt(true)}>
                  View Gantt Chart
                </Button>
              </Card.Footer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
    <Modal size="lg" show={showGantt} onHide={() => setShowGantt(false)} backdrop="static">
      <Modal.Header className='primary-bg' closeButton>
        <Modal.Title>Weekly Exam Schedule</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <ExamScheduleGantt schedules={sampleSchedules} /> */}
      </Modal.Body>
    </Modal>
    <Modal size="lg" show={showEditModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        {selectedSchedule && (
        <>
        <Modal.Header closeButton className="primary-bg">
          <Modal.Title className="text-white">Edit {selectedSchedule.courseCode}-{selectedSchedule.courseName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Exam Venue</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedSchedule.examVenue}
                onChange={(e) => setSelectedSchedule({ ...selectedSchedule, examVenue: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Scheduled Date</Form.Label>
              <Form.Control
                type="date"
                defaultValue={selectedSchedule.scheduledDate}
                onChange={(e) => setSelectedSchedule({ ...selectedSchedule, scheduledDate: e.target.value })}
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    defaultValue={selectedSchedule.startTime}
                    onChange={(e) => setSelectedSchedule({ ...selectedSchedule, startTime: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    defaultValue={selectedSchedule.endTime}
                    onChange={(e) => setSelectedSchedule({ ...selectedSchedule, endTime: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Invigilator</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedSchedule.invigilator}
                onChange={(e) => setSelectedSchedule({ ...selectedSchedule, invigilator: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
      
        </>
        )}
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => {}}>
          Save Paper
        </Button>
      </Modal.Footer>
    </Modal>

    </>
  );
};

export default ExamSchedule;