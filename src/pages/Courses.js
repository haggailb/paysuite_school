
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars } from "react-icons/fa";
import NewCourse from '../components/NewCourse';
import { usePage } from '../layouts/pageContext';
import { sampleCourses } from '../_services/dataServices';

const Courses = () => {
  const { setPageTitle, setBackUrl } = usePage();
  useEffect(() => {
    setPageTitle('Course Register');
    setBackUrl('/');
  }, []);


  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);

  const filteredList = sampleCourses.filter(listItem => {
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
            <Button variant="warning">
              Export
            </Button>
            <Dropdown.Toggle split variant="warning" id={`exports`} />

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
                <td colSpan="4" className="text-danger">No records found.</td>
              </tr>
            )}
            {paginatedList.map((course, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{course.courseCode}</td>
                <td>{course.courseName}</td>
                <td>{course.courseDesc}</td>
                <td>
                  <Dropdown as={ButtonGroup}>
                    <Button variant="outline-secondary" size="sm">
                      Options
                    </Button>
                    <Dropdown.Toggle split variant="outline-secondary" size="sm" id={`dropdown-split-${index}`} />

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => alert(`Viewing ${course.courseName}`)}>
                        <FaEye className="me-2" /> View
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => alert(`Editing ${course.courseName}`)}>
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