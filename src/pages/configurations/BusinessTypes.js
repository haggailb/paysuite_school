import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle } from "react-icons/fa";
import * as XLSX from "xlsx";
import { getInstitution } from "../../_services/dataServices";
import NewBusinessType from "../../components/new_components/NewBusinessType";
import GlassLoader from "../../components/GlassLoader";
import { updateType, getTypes } from "../../_services/businessTypeServices";
import { getCurrentDate } from "../../_utils/formatCurrentDate";
import { useMessageModal } from '../../components/ModalContext';
  
const date = getCurrentDate('long'); 

const BusinessTypes = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);
      const { showMessageModal } = useMessageModal();

  const institution = getInstitution;
    const [businessTypes, setTypes] = useState([]);

  useEffect(() => {
    const fetchTypes = async () => {
      setLoading(true);
      try {
        const result = await getTypes(); 
        setTypes(result.rows);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTypes();
  }, []);
    
    
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedType, setSelectedBusinessTypes] = useState(null);

  const handleFieldUpdate = async (e, typeId, fieldName, newValue) => {
    e.preventDefault();
    setLoading(true);
      try {
        const result = await updateType(typeId, fieldName, newValue);
        showMessageModal({
          heading: 'Success!',
          message: `Business type saved successfully`,
          messageType: 'success',
        });
        handleRefresh();
      } catch (err) {
        showMessageModal({
          heading: 'Saving business type failed!',
          message: `Error: ${err.message}`,
          messageType: 'error',
        });
      }
      setLoading(false);
  };

  const onFieldKeyDown = (fieldName) => (e) => {
    if (e.key === 'Enter') {
      handleFieldUpdate(e, selectedType.typeId, fieldName, e.target.value);
    }
  };

  const handleOpenModal = (bank, modalType) => {
    setSelectedBusinessTypes(bank);
    if (modalType === "view") setShowViewModal(true);
    if (modalType === "edit") setShowEditModal(true);
    if (modalType === "delete") setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowNewModal(false);
    setSelectedBusinessTypes(null);
        handleRefresh();
  };
  
  const handleShowNewModal = () => setShowNewModal(true);

  const handleRefresh = () => {
    const fetchTypes = async () => {
      setLoading(true);
      try {
        const result = await getTypes(); 
        setTypes(result.rows);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTypes();
  };

  const filteredBusinessTypes = businessTypes.filter(Location =>
    Object.values(Location).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredBusinessTypes.length / recordsPerPage);
  const paginatedBusinessTypes = filteredBusinessTypes.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleExportCSV = () => {
    const csvContent =
      "type Code, Business Type\n" +
      filteredBusinessTypes
        .map(
          (type) =>
            `${type.typeCode},${type.typeName}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${institution.name} Registered Business Types.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredBusinessTypes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Business Types");
    XLSX.writeFile(workbook, `${institution.name} Registered Business Types.xlsx`);
  };

    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>${institution.name} Registered Bank Accounts</title>
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
                <h3 style="margin: 0">Registered Banks</h3>
                <p> Data Filter: <strong>${search || "none"}</strong> Date Printed: <strong>${date}</strong></p>
                <table>
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Business Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredBusinessTypes
                            .map(
                                (type) => `
                            <tr>
                                <td>${type.typeCode}</td>
                                <td>${type.typeName}</td>
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
  

  return (
    <div className="form-container mb-5">
      <h2 className="page-title text-center mb-4">Business Types</h2>
      <Row className="mb-3">
        <Col md={3} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search Business Types..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <div className="mb-3 justify-content-center d-flex align-items-center gap-2">
            <Button onClick={handleExportCSV} variant="success" className="me-2"><FaFileCsv /></Button>
            <Button onClick={handleExportXLSX} variant="warning" className="me-2"><FaFileExcel /></Button>
            <Button onClick={handlePrint} variant="primary" className="me-2"><FaPrint/></Button>
            <Button onClick={handleRefresh} className="outline-primaryme-2"><FaRecycle/></Button>
          </div>
        </Col>
        <Col md={3} className="text-end">
          <Button onClick={handleShowNewModal} variant="info" className="hoverable"><FaPlusCircle/> Add </Button>
        </Col>
      </Row>
      <Table striped bordered hover className="data-table">
        <thead className="table-dark">
          <tr>
            <th>Code</th>
            <th>Business Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBusinessTypes.map((type, index) => (
            <tr key={index}>
              <td>{type.typeCode}</td>
              <td>{type.typeName}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(type, "view")}><FaEye /></Button>
                <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleOpenModal(type, "edit")}><FaEdit /></Button>
                {/* <Button variant="outline-danger" size="sm" className="me-2" onClick={() => handleOpenModal(type, "delete")}><FaBan /></Button> */}
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
          <Modal.Title className="text-center">Register New Business Types</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <NewBusinessType />
        </Modal.Body>
      </Modal>

      {/* View bank Modal */}
      <Modal show={showViewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Business Types Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedType && (
            <div>
              <p><strong>Type ID:</strong> {selectedType.typeId}</p>
              <p><strong>Code:</strong> {selectedType.typeCode}</p>
              <p><strong>Business Type:</strong> {selectedType.typeName}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit bank Modal */}
      <Modal show={showEditModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Edit Business Types</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedType && (
            <Form>
            <Row>
              <Col md={6}><h3> Current Details</h3> </Col> 
              <Col md={6}><h3> New Details</h3> </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Code:</strong><br></br> {selectedType.typeCode}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control 
                    name="typeCode"
                    type="text" 
                    placeholder="Enter new code" 
                    onKeyDown={onFieldKeyDown('typeCode')}
                    defaultValue={selectedType.typeCode}
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Name:</strong> <br></br> {selectedType.typeName}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control 
                    type="text" 
                    placeholder="Enter new name" 
                    onKeyDown={onFieldKeyDown('typeName')}
                    defaultValue={selectedType.typeName}
                    name="typeName"
                  />
                </Form.Group>
              </Col> 
            </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      
      {/* confirm delete bank Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-white text-center">Delete Business Types</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedType && (
            <Form>
                <p><strong>Are you sure you want to remove this business type?</strong></p>
                <h2>{selectedType.typeCode}, {selectedType.typeName}</h2>
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

export default BusinessTypes;
