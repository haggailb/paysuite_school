import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle } from "react-icons/fa";
import * as XLSX from "xlsx";
import {getCurrentDate} from "../../_utils/formatCurrentDate";
import {getInstitution } from "../../_services/dataServices";
import NewUserRole from "../../components/new_components/NewUserRole";
import { updateField, getUserRoles } from '../../_services/authServices';
import GlassLoader from "../../components/GlassLoader";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const date = getCurrentDate('long'); 

const UserRoles = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);

  const institution = getInstitution;
  const [userRolesList, setUserRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
  
    fetchUserRoles();
  }, []);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserRole, setselectedUserRole] = useState(null);

  const handleOpenModal = (userRole, modalType) => {
    setselectedUserRole(userRole);
    if (modalType === "edit") setShowEditModal(true);
    if (modalType === "delete") setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowNewModal(false);
    setselectedUserRole(null);
    handleRefresh();
  };
  
  const handleShowNewModal = () => setShowNewModal(true);

  const handleFieldUpdate = async (e, roleId, fieldName, newValue) => {
    e.preventDefault();
    setLoading(true);
      try {
        const result = await updateField(roleId, fieldName, newValue);
        alert(result.message);
        handleRefresh();
      } catch (err) {
        alert(err.message);
      }
      setLoading(false);
  };

  const onFieldKeyDown = (fieldName) => (e) => {
    if (e.key === 'Enter') {
      handleFieldUpdate(e, selectedUserRole.roleId, fieldName, e.target.value);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const result = await getUserRoles();
      setUserRoles(result.rows); 
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredUserRoles = userRolesList.filter(userRole =>
    Object.values(userRole).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredUserRoles.length / recordsPerPage);
  const paginatedUserRoles = filteredUserRoles.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUserRoles);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserRoles");
    XLSX.writeFile(workbook, `${institution.name} Registered UserRoles.xlsx`);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
      <head>
        <title>${institution.name} Registered User Roles</title>
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
        <h3 style="margin: 0">Registered User Roles</h3>
        <p> Data Filter: <strong>${search || "none"}</strong> Date Printed: <strong>${date}</strong></p>
        <table>
          <thead>
            <tr>
              <th>Role Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${filteredUserRoles
              .map((userRole) => `
                <tr>
                  <td>${userRole.roleName}</td>
                  <td>${userRole.roleDesc}</td>
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
      <h2 className="page-title text-center mb-4">Configure User Access Roles</h2>
      <Row className="mb-3">
        <Col md={3} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search User Roles..."
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
            <th>Role Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUserRoles.length === 0 && (
            <tr className="text-center">
              <td colSpan="4" className="text-danger">No userRoles found</td>
            </tr>
          )}
          {paginatedUserRoles.map((userRole, index) => (
            <tr key={index}>
              <td>{userRole.roleName}</td>
              <td>{userRole.roleDesc}</td>
              <td> 
                {/* onClick={() => navigate(`/role-modules/${userRole.roleId}`)} */}
                <Link variant="outline-primary" size="sm" className="me-2" 
                  to={`/role-modules/${userRole.roleName}`}
                  state={{
                    roleId: userRole.roleId,
                    roleName: userRole.roleName,
                  }} ><FaEye /></Link>
                <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleOpenModal(userRole, "edit")}><FaEdit /></Button>
                {/* <Button variant="outline-danger" size="sm" onClick={() => handleOpenModal(userRole, "delete")}><FaBan /></Button> */}
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
          <Modal.Title className="text-center">Add User Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <NewUserRole />
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" className="hoverable" onClick={[handleCloseModal]}>Cancel</Button>
        </Modal.Footer> */}
      </Modal>

      {/* Edit userRole Modal */}
      <Modal show={showEditModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Edit User Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUserRole && (
            <Form>
            <Row>
              <Col md={6}><h3> Current Details</h3> </Col> 
              <Col md={6}><h3> New Details</h3> </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Role Name:</strong><br></br> {selectedUserRole.roleName}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control
                    name="roleName"
                    type="text"
                    placeholder="Enter new name"
                    onKeyDown={onFieldKeyDown('roleName')}
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Description:</strong><br></br>{selectedUserRole.roleDesc}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control
                    name="roleDesc"
                    type="text"
                    placeholder="Enter new code"
                    onKeyDown={onFieldKeyDown('roleDesc')}

                  />
                </Form.Group>
              </Col> 
            </Row>
            </Form>
          )}
        </Modal.Body>
      </Modal>
      
      {/* confirm delete userRole Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-white text-center">Delete Bank</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedUserRole && (
            <Form>
                <p><strong>Are you sure you want to remove this userRole?</strong></p>
                <h2>{selectedUserRole.userRoleName}, {selectedUserRole.userRoleCodeName}</h2>
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

export default UserRoles;
