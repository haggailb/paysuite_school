import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle } from "react-icons/fa";
import * as XLSX from "xlsx";
import {getCurrentDate} from "../../_utils/formatCurrentDate";
import {getInstitution } from "../../_services/dataServices";
import { getUserRoles, updateUser , getUsers } from '../../_services/authServices';
import GlassLoader from "../../components/GlassLoader";
import Select from "react-select"
import NewUserAccount from "../../components/new_components/NewUserAccount";

const date = getCurrentDate('long'); 

const Users = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
    const [newRoleId, setRoleId] = useState({
      roleId: 0,
    });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);

  const institution = getInstitution;
  const [users, setUsers] = useState([]);
  const [userRoles, setUserRoles] = useState([]);

  const fetchUsers = async () => {
    try {
      const result = await getUsers(0); 
      setUsers(result.rows);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRoles = async () => {
    try {
      const result = await getUserRoles(); 
      setUserRoles(result.rows);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setLoading(true);
    fetchUserRoles();
    fetchUsers();
    setLoading(false);
  }, []);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setselectedUser] = useState(null);

  const handleOpenModal = (user, modalType) => {
    setselectedUser(user);
    if (modalType === "edit") setShowEditModal(true);
    if (modalType === "delete") setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowNewModal(false);
    setselectedUser(null);
    handleRefresh();
  };
  
  const handleShowNewModal = () => setShowNewModal(true);

  // const handleFieldUpdate = async (e, roleId, fieldName, newValue) => {
  //   e.preventDefault();
  //   setLoading(true);
  //     try {
  //       const result = await updateUser(roleId, fieldName, newValue);
  //       alert(result.message);
  //       handleRefresh();
  //     } catch (err) {
  //       alert(err.message);
  //     }
  //     setLoading(false);
  // };

  // const onFieldKeyDown = (fieldName) => (e) => {
  //   if (e.key === 'Enter') {
  //     handleFieldUpdate(e, selectedUser.roleId, fieldName, e.target.value);
  //   }
  // };

  const handleRefresh = async () => {
    setLoading(true);
    fetchUserRoles();
    fetchUsers();
    setLoading(false);
  };
  
  const handleSelectChange = async (field, selectedOption) => {
    if (!selectedOption) return;
    try {
      setLoading(true);
      const result = await updateUser(selectedUser.userId, "roleId", selectedOption.roleId);
      alert (result.message);
      handleRefresh();
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
    
  };

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserRoles");
    XLSX.writeFile(workbook, `${institution.name} Registered UserRoles.xlsx`);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
      <head>
        <title>${institution.name} Registered Users</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; }
          h2 { margin-bottom: 10px; }
          img { max-width: 100px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>REPUBLIC OF ZAMBIA</h2>
        <img src="${institution.logo}" alt="Institution Logo" />
        <h2 style="margin: 0">${institution.name}</h2>
        <h3 style="margin: 0">${institution.address}</h3>
        <h3 style="margin: 0">Registered Users</h3>
        <p> Data Filter: <strong>${search || "none"}</strong> Date Printed: <strong>${date}</strong></p>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            ${filteredUsers
              .map((user) => `
                <tr>
                  <td>${user.username}</td>
                  <td>${user.email}</td>
                  <td>${user.roleName}</td>
                </tr>`
              )
            .join("")}
          </tbody>
        </table>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

    if (loading)  return (
      <div className="form-container mb-5 position-relative">
        <GlassLoader show={loading} />
      </div>
    );

    if (error) return <div className="text-danger text-center p-4">❌ Error: {error}</div>;

  return (
    <div className="form-container mb-5">
      <h2 className="page-title text-center mb-4">Configure Users</h2>
      <Row className="mb-3">
        <Col md={3} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search Users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <div className="mb-3 justify-content-center d-flex align-items-center gap-2">
            <Button onClick={handleExportXLSX} variant="warning" className="me-2"><FaFileExcel /></Button>
            <Button onClick={handlePrint} variant="primary" className="me-2"><FaPrint/></Button>
            <Button onClick={handleRefresh} variant="primary" className="me-2"><FaRecycle/></Button>
          </div>
        </Col>
        <Col md={3} className="text-end">
          <Button onClick={handleShowNewModal} variant="info" className="hoverable"><FaPlusCircle/> Add </Button>
        </Col>
      </Row>
      <Table striped bordered hover className="data-table">
        <thead className="table-dark">
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.length === 0 && (
            <tr className="text-center">
              <td colSpan="4" className="text-danger">No users found</td>
            </tr>
          )}
          {paginatedUsers.map((user, index) => (
            <tr key={index}>
            <td>{user.userName}</td>
            <td>{user.email}</td>
            <td>{user.roleName}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => {}}><FaEye /></Button>
                <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleOpenModal(user, "edit")}><FaEdit /></Button>
                {/* <Button variant="outline-danger" size="sm" onClick={() => handleOpenModal(user, "delete")}><FaBan /></Button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button variant="secondary" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button variant="secondary" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</Button>
      </div>
      <Modal show={showNewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-center">Add User Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <NewUserAccount />
        </Modal.Body>
      </Modal>

      {/* Edit user Modal */}
      <Modal show={showEditModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Edit User Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form>
            <Row>
              <Col md={6}><h3> Current Details</h3> </Col> 
              <Col md={6}><h3> New Details</h3> </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Username:</strong><br></br> {selectedUser.username}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control
                    name="username"
                    type="text"
                    placeholder="Enter new username"
                    // onKeyDown={onFieldKeyDown('username')}
                    value={selectedUser.username}
                    readOnly
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Email:</strong><br></br> {selectedUser.email}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control
                    name="email"
                    type="text"
                    placeholder="Enter new name"
                    // onKeyDown={onFieldKeyDown('email')}
                    value={selectedUser.email}
                    readOnly
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Role Name:</strong><br></br> {selectedUser.roleName}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Select
                    required
                    options={userRoles}
                    getOptionLabel={(e) => e.roleName}
                    getOptionValue={(e) => e.roleId}
                    onChange={(selectedOption) => handleSelectChange("roleId", selectedOption)}
                    placeholder="-- Select User Role --"
                  />
                </Form.Group>
              </Col> 
            </Row>
            </Form>
          )}
        </Modal.Body>
      </Modal>
      
      {/* confirm delete user Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-white text-center">Delete Bank</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedUser && (
            <Form>
                <p><strong>Are you sure you want to remove this user?</strong></p>
                <h2>{selectedUser.userName}, {selectedUser.userCodeName}</h2>
                <Row className="mt-5">
                <Col md={6}>
                    <Button variant="secondary" onClick={handleCloseModal}>No</Button>
                </Col> 
                <Col md={6}>
                    <Button variant="secondary" className="bg-danger" >Yes</Button>
                </Col> 
                </Row>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Users;
