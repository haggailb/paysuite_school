import React, { useState } from "react";
import { Container, Card, Form, Button, Table } from "react-bootstrap";
import { FaBuilding, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Departments = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [departments, setDepartments] = useState([]);

  // Handle adding a new department
  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (!departmentName.trim()) return;

    const newDepartment = {
      id: departments.length + 1,
      name: departmentName,
    };

    setDepartments([...departments, newDepartment]);
    setDepartmentName("");
  };

  // Handle deleting a department
  const handleDelete = (id) => {
    setDepartments(departments.filter((dept) => dept.id !== id));
  };

  return (
    <Container className="flex-column justify-content-center align-items-center min-vh-100 bg-light">
          <h2 className="page-title text-center mb-4">Department Management</h2>
      <Card className="form-container">
        <Card.Body>
          <Form onSubmit={handleAddDepartment}>
            <Form.Group className="mb-3">
              <Form.Label className="form-label">
                <FaBuilding className="icon" /> Department Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter department name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                required
              />
            </Form.Group>
            <div className="text-center">
              <Button type="submit" className="btn-submit">
                <FaPlus /> Add Department
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Fancy Table */}
      {departments.length > 0 && (
        <Card className="table-container mt-4">
          <Card.Body>
            <h4 className="text-center mb-3">Department List</h4>
            <Table striped bordered hover responsive>
              <thead className="table-header">
                <tr>
                  <th>#</th>
                  <th>Department Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, index) => (
                  <tr key={dept.id}>
                    <td>{index + 1}</td>
                    <td>{dept.name}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2">
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(dept.id)}
                      >
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

export default Departments;
