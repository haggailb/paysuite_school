
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars } from "react-icons/fa";
import NewProgram from '../components/NewProgram';


const Programs = () => {
  const data = [
  {
    code: "BSC-CS",
    name: "Bachelor of Science in Computer Science",
    description: "Focuses on programming, algorithms, software development, and data structures.",
    faculty: "Faculty of Science and Technology"
  },
  {
    code: "BA-BA",
    name: "Bachelor of Arts in Business Administration",
    description: "Covers business operations, management principles, and organizational leadership.",
    faculty: "Faculty of Business and Economics"
  },
  {
    code: "BSC-NUR",
    name: "Bachelor of Science in Nursing",
    description: "Equips students with clinical and theoretical nursing knowledge.",
    faculty: "Faculty of Health Sciences"
  },
  {
    code: "BA-LAW",
    name: "Bachelor of Arts in Law",
    description: "Prepares students for legal professions with a foundation in legal theory and practice.",
    faculty: "Faculty of Law"
  },
  {
    code: "BSC-ENG",
    name: "Bachelor of Science in Mechanical Engineering",
    description: "Focuses on mechanical systems, design, thermodynamics, and materials science.",
    faculty: "Faculty of Engineering"
  },
  {
    code: "BA-MKT",
    name: "Bachelor of Arts in Marketing",
    description: "Explores market research, branding, digital marketing, and consumer behavior.",
    faculty: "Faculty of Business and Economics"
  },
  {
    code: "BSC-ECON",
    name: "Bachelor of Science in Economics",
    description: "Studies economic theory, modeling, statistics, and financial systems.",
    faculty: "Faculty of Social Sciences"
  },
  {
    code: "BSC-BIO",
    name: "Bachelor of Science in Biology",
    description: "Provides an understanding of living organisms, genetics, and ecosystems.",
    faculty: "Faculty of Science and Technology"
  },
  {
    code: "BSC-MATH",
    name: "Bachelor of Science in Mathematics",
    description: "Offers in-depth studies in calculus, algebra, statistics, and applied mathematics.",
    faculty: "Faculty of Science and Technology"
  },
  {
    code: "BSC-IT",
    name: "Bachelor of Science in Information Technology",
    description: "Focuses on IT infrastructure, networking, security, and system administration.",
    faculty: "Faculty of Science and Technology"
  }
];

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);

  const filteredList = data.filter(listItem => {
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
            <span><i class="bi bi-journal-text"></i> Programs</span>
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
              <th>Program Code</th>
              <th>Program Name</th>
              <th>Faculty</th>
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
                <td>{course.faculty}</td>
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
          <Modal.Title className="text-white">Register New Program</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewProgram />
        </Modal.Body>
      </Modal>

    </>
  );
};

export default Programs;