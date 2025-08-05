import React, { useState } from "react";
import { Container, Card, Form, Button, Table } from "react-bootstrap";
import { FaBuilding, FaList, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Units = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: "Finance" },
    { id: 2, name: "Planing" },
    { id: 3, name: "Institutional Management" },
  ]);

  const [units, setUnits] = useState([]);
  const [unitName, setUnitName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const handleAddUnit = (e) => {
    e.preventDefault();
    if (!unitName.trim() || !selectedDepartment) return;

    const newUnit = {
      id: units.length + 1,
      name: unitName,
      departmentId: selectedDepartment,
      departmentName: departments.find((d) => d.id === parseInt(selectedDepartment))?.name,
    };

    setUnits([...units, newUnit]);
    setUnitName("");
    setSelectedDepartment("");
  };

  // Handle deleting a unit
  const handleDelete = (id) => {
    setUnits(units.filter((unit) => unit.id !== id));
  };

  return (
    <Container className="flex-column justify-content-center align-items-center min-vh-100 bg-light">
          <h2 className="page-title text-center mb-4">Unit/Section Management</h2>
      <Card className="form-container">
        <Card.Body>
          <Form onSubmit={handleAddUnit}>
            <Form.Group className="mb-3">
              <Form.Label className="form-label">
                <FaBuilding className="icon" /> Select Department
              </Form.Label>
              <Form.Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                required
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">
                <FaList className="icon" /> Unit/Section Name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter unit/section name"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                required
              />
            </Form.Group>

            <div className="text-center">
              <Button type="submit" className="btn-submit">
                <FaPlus /> Add Unit
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Fancy Table for Units */}
      {units.length > 0 && (
        <Card className="table-container mt-4">
          <Card.Body>
            <h4 className="text-center mb-3">Units/Sections List</h4>
            <Table striped bordered hover responsive>
              <thead className="table-header">
                <tr>
                  <th>#</th>
                  <th>Unit Name</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit, index) => (
                  <tr key={unit.id}>
                    <td>{index + 1}</td>
                    <td>{unit.name}</td>
                    <td>{unit.departmentName}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2">
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(unit.id)}
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

export default Units;
