
import React, {useState, useEffect} from 'react';
import { useNavigate} from 'react-router-dom';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card, Alert, ListGroup } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars, FaChevronCircleRight, FaDollarSign, FaFile, FaBan } from "react-icons/fa";
import { usePage } from '../layouts/pageContext';
import Select from "react-select";
import { sampleStudentExams } from '../_services/dataServices';
import { useLocation, useParams } from "react-router-dom";
import ExamScheduleGantt from "../components/ExamScheduleGantt";

import AttendanceRadio from "../components/AttendanceRadioOptions";

const ExamPaperMarking = () => {
  const navigate = useNavigate();
  const { examCode } = useParams();
  const { courseCode } = useParams();
  const location = useLocation();
  const courseExam = location.state?.courseExam; 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setPageTitle, setBackUrl } = usePage();
  const [validated, setValidated] = useState(false);
  const [search, setSearch] = useState("");  
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpdateResults, setshowUpdateResults] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showGantt, setShowGantt] = useState(false);

    const handleCloseModal = () => {
    setshowUpdateResults(false);
    setSelectedSchedule(null);
  };
  
  const [formData, setFormData] = useState({
    userLevel: '',
    modueId: 0,
    mobuleName: '',
  });
  useEffect(() => {
    setPageTitle('Exam Paper Marking');
    setBackUrl('/exams');
  }, []);


  const handleViewExamPaperMarking = (courseExam) => {
    navigate(`/exam-results/${courseExam.examCode}/${courseExam.courseCode}`, { state: { courseExam } });
  };

  const filteredList = sampleStudentExams.filter(listItem => {
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

  if (!courseExam || !examCode || !courseCode) {
    return <Alert variant="danger">No exam data available.</Alert>;
  }

  return (
    <>
    <div className='mb-3 h-100 w-100'>
      <Row>
        <Col xl={4} >
          <Card className="h-100 shadow-sm">
            <Card.Header as="h5" className="primary-bg">
              Exam Details
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Exam Code:</strong> {courseExam.examCode}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Course Code:</strong> {courseExam.courseCode}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Course Name:</strong> {courseExam.courseName}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Exam Date:</strong> {courseExam.scheduledDate}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Exam Time:</strong> {courseExam.startTime} - {courseExam.endTime}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Invigilator:</strong> {courseExam.invigilator}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={8} className='mb-3'>
          <Card className="h-100 shadow">
            <Card.Header as="h5" className="primary-bg">
              Student Exam Results 
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
                      <th>Course Code</th>
                      <th>Student ID</th>
                      <th>Total Marks</th>
                      <th>Attendance</th>
                      <th>Marks</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.length === 0 && (
                      <tr className="text-center">
                        <td colSpan="4" className="text-danger">No records found.</td>
                      </tr>
                    )}
                    {filteredList.map((studentExam, index) => (
                      <tr key={index}>
                        <td>{studentExam.courseCode}</td>
                        <td>{studentExam.studentId}</td>
                        <td>{studentExam.totalMarks}</td>
                        <td>
                          <AttendanceRadio
                            value={studentExam.attendance}
                            onChange={(selectedOption) => {}}
                            namePrefix={`attendance-${studentExam.studentExamId}`}
                          />
                        </td>
                        <td>
                          <Form.Control
                            name='marksObtained'
                            min={0}
                            type="number"
                            placeholder="Marks Obtained"
                            value={studentExam.marksObtained || 0}
                          />
                        </td>
                        <td>
                          <Button className=" btn" onClick={() => handleViewExamPaperMarking(studentExam)}>
                            Update
                          </Button>
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
    <Modal size="lg" show={showUpdateResults} onHide={handleCloseModal} backdrop="static" keyboard={false}>
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

export default ExamPaperMarking;