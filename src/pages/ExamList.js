
import React, {useState, useEffect} from 'react';
import { Link,  useNavigate} from 'react-router-dom';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars } from "react-icons/fa";
import NewFaculty from '../components/NewFaculty';
import { usePage } from '../layouts/pageContext';
import { sampleExams } from '../_services/dataServices';
import NewExam from '../components/NewExam';


const ExamList = () => {
  const { setPageTitle, setBackUrl } = usePage();

  useEffect(() => {
    setPageTitle('List of Exams');
    setBackUrl('/');
  }, []);
  const navigate = useNavigate();

  const handleViewOutline = (exam) => {
    navigate(`/exam-schedule/${exam.examCode}`, { state: { exam } });
  };

  const handleViewExamPapers = (exam) => {
    navigate(`/exam-papers/${exam.examCode}`, { state: { exam } });
  };

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);

  const filteredList = sampleExams.filter(listItem => {
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
          <Button onClick={handleShowNewModal} variant="info" className="hoverable"><FaPlusCircle/> Add Exam</Button>
        </Col>
      </Row>
      <div className="custom-table-wrapper">
        <Table striped bordered hover className="custom-table" >
          <thead className="table-success">
            <tr>
              <th>#</th>
              <th>Exam Code</th>
              <th>Exam Year</th>
              <th>Exam Name</th>
              <th>Program Code</th>
              <th>Program Name</th>
              <th>Study Level</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.length === 0 && (
              <tr className="text-center">
                <td colSpan="4" className="text-danger">No records found.</td>
              </tr>
            )}
            {paginatedList.map((exam, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{exam.examCode}</td>
                <td>{exam.examYear}</td>
                <td>{exam.examName}</td>
                <td>{exam.programCode}</td>
                <td>{exam.programName}</td>
                <td>Y{exam.studyLevel}S{exam.semester}</td>
                <td>
                  <Dropdown as={ButtonGroup}>
                    <Button variant="outline-secondary" size="sm">
                      Options
                    </Button>
                    <Dropdown.Toggle split variant="outline-secondary" size="sm" id={`dropdown-split-${index}`} />

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => alert(`Editing ${exam.examName}`)}>
                        <i className='bi bi-pen'></i> Edit Exam
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleViewOutline(exam)}>
                        <i className='bi bi-calendar2-range'></i> View Schedule
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleViewExamPapers(exam)}>
                        <i className='bi bi-clipboard-check'></i> Exam Results
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
          <Modal.Title className="text-white">Add New Exam</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewExam />
        </Modal.Body>
      </Modal>

    </>
  );
};

export default ExamList;