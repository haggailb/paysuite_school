import React, { useState } from "react";
import { Container, Card, Form, Button, Table, Row, Col } from "react-bootstrap";
import { FaBuilding, FaList, FaUserTie, FaMoneyBill, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const JobTitles = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: "Finance" },
    { id: 2, name: "Planing" },
    { id: 3, name: "Institutional Management" },
  ]);

  const [units, setUnits] = useState([
    { id: 1, name: "Revenue", departmentId: 1 },
    { id: 1, name: "Payments", departmentId: 1 },
    { id: 1, name: "I.T", departmentId: 1 },
    { id: 2, name: "Physical Planning", departmentId: 2 },
    { id: 2, name: "Community Development", departmentId: 2 },
    { id: 3, name: "Audit", departmentId: 3 },
    { id: 3, name: "Procurement", departmentId: 3 },
  ]);

  const [jobTitles, setJobTitles] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [salaryGrade, setSalaryGrade] = useState("");

  // Handle department selection and filter units
  const handleDepartmentChange = (e) => {
    const deptId = e.target.value;
    setSelectedDepartment(deptId);
    setFilteredUnits(units.filter((unit) => unit.departmentId === parseInt(deptId)));
    setSelectedUnit(""); // Reset unit when department changes
  };

  // Handle adding a new job title
  const handleAddJobTitle = (e) => {
    e.preventDefault();
    if (!jobTitle.trim() || !selectedDepartment || !selectedUnit || !salaryGrade.trim()) return;

    const newJobTitle = {
      id: jobTitles.length + 1,
      name: jobTitle,
      departmentId: selectedDepartment,
      departmentName: departments.find((d) => d.id === parseInt(selectedDepartment))?.name,
      unitId: selectedUnit,
      unitName: units.find((u) => u.id === parseInt(selectedUnit))?.name,
      salaryGrade,
    };

    setJobTitles([...jobTitles, newJobTitle]);
    setJobTitle("");
    setSalaryGrade("");
    setSelectedDepartment("");
    setSelectedUnit("");
    setFilteredUnits([]);
  };

  // Handle deleting a job title
  const handleDelete = (id) => {
    setJobTitles(jobTitles.filter((job) => job.id !== id));
  };

  return (
    <Container className="flex-column justify-content-center align-items-center min-vh-100 bg-light">
          <h2 className="page-title text-center mb-4">Job Title Management</h2>
      <Card className="form-container">
        <Card.Body>
            
            <Form onSubmit={handleAddJobTitle}>
        <Row >
                <Col md={6}>
                    <Form.Group className="mb-3">
                    <Form.Label className="form-label">
                        <FaBuilding className="icon" /> Select Department
                    </Form.Label>
                    <Form.Select value={selectedDepartment} onChange={handleDepartmentChange} required>
                        <option value="">-- Select Department --</option>
                        {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                            {dept.name}
                        </option>
                        ))}
                    </Form.Select>
                    </Form.Group>
                </Col>
            
            <Col md={6}>
                <Form.Group className="mb-3">
                <Form.Label className="form-label">
                    <FaList className="icon" /> Select Unit/Section
                </Form.Label>
                <Form.Select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)} required>
                    <option value="">-- Select Unit --</option>
                    {filteredUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                        {unit.name}
                    </option>
                    ))}
                </Form.Select>
                </Form.Group>
            </Col>
        </Row>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">
                <FaUserTie className="icon" /> Job Title
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter job title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">
                <FaMoneyBill className="icon" /> Salary Grade (e.g., LGSS10)
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter salary grade"
                value={salaryGrade}
                onChange={(e) => setSalaryGrade(e.target.value)}
                required
              />
            </Form.Group>

            <div className="text-center">
              <Button type="submit" className="btn-submit">
                <FaPlus /> Add Job Title
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Fancy Table for Job Titles */}
      {jobTitles.length > 0 && (
        <Card className="table-container mt-4">
          <Card.Body>
            <h4 className="text-center mb-3">Job Titles List</h4>
            <Table striped bordered hover responsive>
              <thead className="table-header">
                <tr>
                  <th>#</th>
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Unit/Section</th>
                  <th>Salary Grade</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobTitles.map((job, index) => (
                  <tr key={job.id}>
                    <td>{index + 1}</td>
                    <td>{job.name}</td>
                    <td>{job.departmentName}</td>
                    <td>{job.unitName}</td>
                    <td>{job.salaryGrade}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2">
                        <FaEdit />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(job.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default JobTitles;
