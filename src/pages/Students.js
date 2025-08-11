
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars, FaChevronCircleRight, FaDollarSign, FaFile } from "react-icons/fa";
import NewStudent from '../components/NewStudent';
import '../styles/Students.css'
import { usePage } from '../layouts/pageContext';
import { sampleStudents } from '../_services/dataServices';


const Students = () => {
  const { setPageTitle, setBackUrl } = usePage();
  useEffect(() => {
    setPageTitle('Students Register');
    setBackUrl('/');
  }, []);


  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);

  const filteredList = sampleStudents.filter(listItem => {
    const searchValues = Object.values(listItem).join(' ').toLowerCase();
    return search
      .toLowerCase()
      .split(/\s+/)
      .every(word => searchValues.includes(word));
  });

  const handleShowNewModal = () => setShowNewModal(true);
  const handleCloseModal = () => {
    setShowNewModal(false);
  };

  const totalPages = Math.ceil(filteredList.length / recordsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  return (
    <>
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
          <Button onClick={handleShowNewModal} variant="info" className="hoverable"><FaPlusCircle/> Add </Button>
        </Col>
      </Row>
      
      <div className="student-card-list-wrapper">
        {paginatedList.length === 0 ? (
          <div className="text-center text-danger py-3">No records found.</div>
        ) : (
          <Row className="g-3 justify-content-start">
            {paginatedList.map((student, index) => (
              <Col key={index} xs={12} lg={6} xl={4}>
                <Card className="student-card shadow-sm h-100">
                  <Card.Body className="d-flex justify-content-center align-items-center">
                    {/* Student Image */}
                    <img
                      src={student.profileImage || "/images/avatar.jpg"} 
                      alt={`${student.firstName} ${student.lastName}`}
                      className="student-avatar me-3"
                    />

                    {/* Student Info */}
                    <div className="flex-grow-1">
                      <h5 className="mb-1">{student.firstName} {student.lastName}</h5>
                      <div><strong>ID:</strong> {student.studentId}</div>
                      <div><strong>Gender:</strong> {student.gender}</div>
                      <div><strong>Program:</strong> {student.program}</div>
                    </div>

                    {/* Actions Dropdown */}
                    <Dropdown as={ButtonGroup} className="ms-3">
                      {/* <Button variant="outline-primary" size="sm">
                        <FaChevronCircleRight />
                      </Button> */}
                      <Dropdown.Toggle variant="outline-primary" size="sm" id={`dropdown-split-${index}`} />
                      <Dropdown.Menu align="end">
                        <Dropdown.Item onClick={() => alert(`Viewing ${student.firstName}`)}>
                          <FaEye className="me-2" /> View Profile
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => alert(`Viewing ${student.firstName}`)}>
                          <FaFile className="me-2" /> View Results
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => alert(`Viewing ${student.firstName}`)}>
                          <FaDollarSign className="me-2" /> View Statement
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => alert(`Editing ${student.firstName}`)}>
                          <FaEdit className="me-2" /> Edit Info
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <Button
          variant="outline-secondary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        > Previous </Button>

        <span>Page {currentPage} of {totalPages}</span>

        <Button
          variant="outline-secondary"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        > Next </Button>
      </div>
      <Modal size="lg" show={showNewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">Register New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewStudent />
        </Modal.Body>
      </Modal>

    </>
  );
};

export default Students;