
import React, {useState, useEffect} from 'react';
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card, Accordion } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars, FaChevronCircleRight, FaDollarSign, FaFile, FaDownload } from "react-icons/fa";
import { usePage } from '../layouts/pageContext';
import { sampleProgramCourseStructures } from '../_services/dataServices';
import { Link,  useNavigate} from 'react-router-dom';

const ProgramCourseStructures = () => {
  const { setPageTitle, setBackUrl } = usePage();
  useEffect(() => {
    setPageTitle('Program Outlines');
    setBackUrl('/');
  }, []);
  const navigate = useNavigate();

  const handleViewOutline = (program) => {
    navigate(`/programs/${program.programCode}/outline`, { state: { program } });
  };

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 1;

  const filteredList = sampleProgramCourseStructures.filter(listItem => {
    const searchValues = Object.values(listItem).join(' ').toLowerCase();
    return search
      .toLowerCase()
      .split(/\s+/)
      .every(word => searchValues.includes(word));
  });

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
          <Button  className="me-2 outline-primary"><FaRecycle/> Refresh</Button>
          {/* <Link to="/program-structuring" ><Button variant="info" className="hoverable"><FaPlusCircle/> Add Structure</Button></Link>  */}
        </Col>
      </Row>
      
    <div className="program-structure-wrapper">
      {paginatedList.length === 0 ? (
        <div className="text-muted text-center py-4">No program structures defined yet.</div>
      ) : (
        paginatedList.map((program, pIndex) => (
          <Card className="mb-3 shadow" key={pIndex}>
            <Card.Header className="bg-primary text-white">
              <strong>{program.programCode} - {program.programName}</strong>
            </Card.Header>
            <Card.Body>
              {program.structure.map((yearItem, yIndex) => (
                <div key={yIndex} className="mb-4">
                  <h5 className="text-secondary">Year {yearItem.year}</h5>
                  <Row>
                    {yearItem.semesters.map((sem, sIndex) => (
                      <Col md={6} key={sIndex}>
                        <Card className="mb-3 bg-light h-100">
                          <Card.Body>
                            <h6 className="text-primary">Semester {sem.semester}</h6>
                            <ul className="mb-0 ps-3">
                              {sem.courses.length > 0 ? (
                                sem.courses.map((course, cIndex) => (
                                  <li key={cIndex}>{course}</li>
                                ))
                              ) : (
                                <li className="text-muted">No courses assigned</li>
                              )}
                            </ul>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
              <Card.Footer>
                <Button onClick={() => handleViewOutline(program)} > View / Edit Outline </Button>
              </Card.Footer>
            </Card.Body>
          </Card>
        ))
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
    </>
  );
};

export default ProgramCourseStructures;
