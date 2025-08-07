import React, { useState, useEffect } from 'react';
import {
  Dropdown,
  ButtonGroup,
  Button,
  Table,
  Form,
  Row,
  Col,
  Modal,
  Card,
  Alert
} from "react-bootstrap";
import {
  FaEye,
  FaEdit,
  FaPlusCircle,
  FaRecycle,
  FaFileCsv,
  FaFileExcel,
  FaPrint,
  FaFile
} from "react-icons/fa";
import { usePage } from '../layouts/pageContext';
import Select from "react-select";
import { sampleAccessLevels, sampleUsers } from '../_services/dataServices'; // Make sure to have these

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setPageTitle, setBackUrl } = usePage();
  const [validated, setValidated] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [search, setSearch] = useState("");  
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    setPageTitle('Users Management');
    setBackUrl('/');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (field, selectedValue) => {
    if (!selectedValue) return;
    setFormData(prev => ({
      ...prev,
      [field]: selectedValue.value
    }));
  };

  const filteredUsers = sampleUsers.filter(user => {
    const searchValues = Object.values(user).join(' ').toLowerCase();
    return search
      .toLowerCase()
      .split(/\s+/)
      .every(word => searchValues.includes(word));
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setLoading(true);

    // Simulated API save...
    setTimeout(() => {
      setFeedback({ type: "success", message: "User successfully added!" });
      setFormData({ fullName: '', email: '', role: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className='mb-3 h-100 w-100'>
      <Row>
        {/* Left Panel - Add User */}
        <Col md={4} className='mb-3'>
          <Card className="h-100">
            <Card.Body>
              <h5>Add New User</h5>
              <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Full Name</Form.Label>
                  <Form.Control
                    required
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder='Enter full name'
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Email</Form.Label>
                  <Form.Control
                    required
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='Enter email'
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className='required'>Access Level</Form.Label>
                  <Select
                    name="role"
                    options={sampleAccessLevels}
                    getOptionLabel={(e) => e.levelName}
                    getOptionValue={(e) => e.levelId}
                    onChange={(selectedOption) => handleSelectChange("role", selectedOption.levelId)}
                    placeholder="-- Select Level --"
                  />
                </Form.Group>
                {feedback && <Alert variant={feedback.type}>{feedback.message}</Alert>}

                <Button type='submit' variant="primary" disabled={loading}>
                  {loading ? "Saving..." : "Save User"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Panel - Users List */}
        <Col md={8} className='mb-3'>
          <Card className="h-100">
            <Card.Body>
              <h5>Registered Users</h5>
              <Row>
                <Col md={4} className="mb-3">
                  <Form.Control
                    type="search"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </Col>
                <Col md={8} className="mb-3 text-end d-flex align-items-center gap-2">
                  <Dropdown as={ButtonGroup}>
                    <Button variant="warning">Export</Button>
                    <Dropdown.Toggle split variant="warning" size="md" id={`exports`} />
                    <Dropdown.Menu>
                      <Dropdown.Item><FaFileCsv className="me-2" /> Export CSV</Dropdown.Item>
                      <Dropdown.Item><FaFileExcel className="me-2" /> Export Excel</Dropdown.Item>
                      <Dropdown.Item><FaPrint className="me-2" /> Print</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button variant="outline-primary"><FaRecycle /></Button>
                </Col>
              </Row>

              <div className="custom-table-wrapper">
                <Table striped bordered hover className="custom-table">
                  <thead className="table-success">
                    <tr>
                      <th>#</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 && (
                      <tr className="text-center">
                        <td colSpan="5" className="text-danger">No users found.</td>
                      </tr>
                    )}
                    {filteredUsers.map((user, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <Dropdown as={ButtonGroup}>
                            <Button variant="outline-secondary" size="sm">Options</Button>
                            <Dropdown.Toggle split variant="outline-secondary" size="sm" />
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => alert(`Editing ${user.fullName}`)}>
                                <FaEdit className="me-2" /> Edit
                              </Dropdown.Item>
                              <Dropdown.Item className="text-danger">
                                <i className='bi bi-trash3 me-2'></i> Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Users;
