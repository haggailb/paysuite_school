import React, { useState } from "react";
import { Container, Card, Form, Button, Table, InputGroup } from "react-bootstrap";
import { FaUser, FaEnvelope, FaKey, FaUserShield, FaEye, FaEyeSlash, FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const UserRegistration = () => {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const roles = ["Admin", "Manager", "Clerk", "Viewer"];

  // Add User
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!userName.trim() || !email.trim() || !role || !password.trim()) return;

    const newUser = {
      id: users.length + 1,
      userName,
      email,
      role,
    };

    setUsers([...users, newUser]);
    setUserName("");
    setEmail("");
    setRole("");
    setPassword("");
  };

  // Delete User
  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <Container className="flex-column justify-content-center align-items-center min-vh-100 bg-light">
          <h2 className="page-title text-center mb-4">User Registration</h2>
      <Card className="form-container">
        <Card.Body>
          <Form onSubmit={handleAddUser}>
            <Form.Group className="mb-3">
              <Form.Label className="form-label">
                <FaUser className="icon" /> Username
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter user name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">
                <FaEnvelope className="icon" /> Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">
                <FaUserShield className="icon" /> Role
              </Form.Label>
              <Form.Select value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="">-- Select Role --</option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">
                <FaKey className="icon" /> Password
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <div className="text-center">
              <Button type="submit" className="btn-submit">
                <FaPlus /> Register User
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* User List Table */}
      {users.length > 0 && (
        <Card className="table-container mt-4">
          <Card.Body>
            <h4 className="text-center mb-3">Registered Users</h4>
            <Table striped bordered hover responsive>
              <thead className="table-header">
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2">
                        <FaEdit />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
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

export default UserRegistration;
