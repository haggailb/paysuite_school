
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars } from "react-icons/fa";
import NewCourse from '../components/NewCourse';


const Courses = () => {
  const courseData = [
  {
    code: 'CS101',
    name: 'Introduction to Computer Science',
    description: 'Fundamental concepts of computer systems, programming, and algorithms.',
  },
  {
    code: 'BA201',
    name: 'Principles of Business Administration',
    description: 'Overview of business operations, management, and organizational behavior.',
  },
  {
    code: 'ACC102',
    name: 'Financial Accounting',
    description: 'Basic principles of accounting, financial statements, and bookkeeping.',
  },
  {
    code: 'BIO105',
    name: 'General Biology',
    description: 'Introduction to cellular biology, genetics, and human biology systems.',
  },
  {
    code: 'PHY110',
    name: 'Physics for Engineers',
    description: 'Mechanics, thermodynamics, and electromagnetism principles.',
  },
  {
    code: 'MAT120',
    name: 'Calculus I',
    description: 'Limits, derivatives, and integrals of single-variable functions.',
  },
  {
    code: 'ENG103',
    name: 'English Composition',
    description: 'Essay writing, grammar, and academic writing techniques.',
  },
  {
    code: 'IT210',
    name: 'Web Development Basics',
    description: 'HTML, CSS, JavaScript fundamentals for web design and development.',
  },
  {
    code: 'MKT205',
    name: 'Marketing Strategies',
    description: 'Principles of marketing, market analysis, and branding strategies.',
  },
  {
    code: 'LAW300',
    name: 'Business Law',
    description: 'Legal environment of business, contracts, and regulatory compliance.',
  }
];


  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);

  const filteredList = courseData.filter(listItem => {
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
        <div className="custom-header">
          <h1 className="page-title d-flex justify-content-between align-items-center">
            <Link to={'/'} className="back-button d-flex align-items-center">
              <i className="bi bi-arrow-left-circle me-2"></i> Back
            </Link>
            <span><i class="bi bi-journal-text"></i> Course List</span>
          </h1>
        </div>
      
      <Row>
        <Col md={2} className="mb-3">
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
        <Col md={10} className="mb-3 text-end justify-content-end d-flex align-items-center gap-2">
          <Dropdown as={ButtonGroup}>
            <Button variant="warning" size="md">
              Export Data
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
      <div className="custom-table-wrapper">
        <Table striped bordered hover className="custom-table" >
          <thead className="table-success">
            <tr>
              <th>#</th>
              <th>Course Code</th>
              <th>Class Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.length === 0 && (
              <tr className="text-center">
                <td colSpan="4" className="text-danger">No programs registered.</td>
              </tr>
            )}
            {paginatedList.map((course, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{course.description}</td>
                <td>
                  <Dropdown as={ButtonGroup}>
                    <Button variant="outline-secondary" size="sm">
                      Actions
                    </Button>
                    <Dropdown.Toggle split variant="outline-secondary" size="sm" id={`dropdown-split-${index}`} />

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => alert(`Viewing ${course.name}`)}>
                        <FaEye className="me-2" /> View
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => alert(`Editing ${course.name}`)}>
                        <FaEdit className="me-2" /> Edit
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center">
          <Button
            variant="secondary-outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          > Previous </Button>
          <span>Page {currentPage} of {totalPages}</span>
          <Button
            variant="secondary-outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          > Next </Button>
        </div>
      </div>
      <Modal size="lg" show={showNewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white">Register New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewCourse onClose={handleCloseModal} />
        </Modal.Body>
      </Modal>

    </>
  );
};

export default Courses;