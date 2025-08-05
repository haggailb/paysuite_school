import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle } from "react-icons/fa";
import * as XLSX from "xlsx";
import { getCurrentDate } from "../../_utils/formatCurrentDate";
import { getInstitution } from "../../_services/dataServices";
import NewPropertyType from "../../components/new_components/NewPropertyType";
import { updateType, getTypes } from "../../_services/propertyTypeServices";
import GlassLoader from "../../components/GlassLoader";
import { useMessageModal } from '../../components/ModalContext';
  
  const date = getCurrentDate('long'); 

const PropertyTypes = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);
    const { showMessageModal } = useMessageModal();

  const institution = getInstitution;
  const [propertyTypes, setTypes] = useState([]);

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
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const handleOpenModal = (bank, modalType) => {
    setSelectedType(bank);
    if (modalType === "view") setShowViewModal(true);
    if (modalType === "edit") setShowEditModal(true);
    if (modalType === "history") setShowHistoryModal(true);
    if (modalType === "delete") setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowHistoryModal(false);
    setShowDeleteModal(false);
    setShowNewModal(false);
    setSelectedType(null);
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

  const handleFieldUpdate = async (e, propertyTypeId, fieldName, newValue) => {
    e.preventDefault();
    setLoading(true);
      try {
        const result = await updateType(propertyTypeId, fieldName, newValue);
        showMessageModal({
          heading: 'Success!',
          message: `Property type saved successfully`,
          messageType: 'success',
        });
        handleRefresh();
      } catch (err) {
        showMessageModal({
          heading: 'Saving property type failed!',
          message: `Error: ${err.message}`,
          messageType: 'error',
        });
      }
      setLoading(false);
  };

  const onFieldKeyDown = (fieldName) => (e) => {
    if (e.key === 'Enter') {
      handleFieldUpdate(e, selectedType.propertyTypeId, fieldName, e.target.value);
    }
  };
  
  const filteredTypes = propertyTypes.filter(propertyType =>
    Object.values(propertyType).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredTypes.length / recordsPerPage);
  const paginatedPropertyTypes = filteredTypes.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleExportCSV = () => {
    const csvContent =
      "Type Code, Property Type\n" +
      filteredTypes
        .map(
          (type) =>
            `${type.propertyTypeCode},${type.propertyTypeName}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${institution.propertyTypeName} Registered Property Types.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredTypes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bank Accounts");
    XLSX.writeFile(workbook, `${institution.propertyTypeName} Registered Property Types.xlsx`);
  };
  
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>${institution.propertyTypeName} Registered Banks</title>
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
                <h2 style="margin: 0">${institution.propertyTypeName}</h2>
                <h3 style="margin: 0">${institution.address}</h3>
                <h3 style="margin: 0">Registered Property Types</h3>
                <p> Data Filter: <strong>${search || "none"}</strong> Date Printed: <strong>${date}</strong></p>
                <table>
                    <thead>
                        <tr>
                            <th>Type Code</th>
                            <th>Type Name</th>
                            <th>Poundage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredTypes
                            .map(
                                (type) => `
                            <tr>
                                <td>${type.propertyTypeCode}</td>
                                <td>${type.propertyTypeName}</td>
                                <td>${type.propertyTypePoundage}</td>
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
      <h2 className="page-title text-center mb-4">Property Types</h2>
      <Row className="mb-3">
        <Col md={3} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search Types..."
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
            <th>Type Code</th>
            <th>Type Name</th>
            <th>Poundage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPropertyTypes.map((type, index) => (
            <tr key={index}>
              <td>{type.propertyTypeCode}</td>
              <td>{type.propertyTypeName}</td>
              <td>{type.propertyTypePoundage}</td>
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
          <Modal.Title className="text-center">Register New Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <NewPropertyType />
        </Modal.Body>
      </Modal>


      {/* View bank Modal */}
      <Modal show={showViewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Property Type Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedType && (
            <div>
              <p><strong>Property Type ID:</strong> {selectedType.propertyTypeId}</p>
              <p><strong>Property Type Code:</strong> {selectedType.propertyTypeCode}</p>
              <p><strong>Property Type Name:</strong> {selectedType.propertyTypeName}</p>
              <p><strong>Property Type Poundage:</strong> {selectedType.propertyTypePoundage}</p>
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
          <Modal.Title>Edit Property Type</Modal.Title>
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
                <p><strong>Code:</strong><br></br> {selectedType.propertyTypeCode}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control 
                    name="propertyTypeCode"
                    type="text" 
                    placeholder="Update code"
                    defaultValue={selectedType.propertyTypeCode}
                    onKeyDown={onFieldKeyDown('propertyTypeCode')}
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Name:</strong> <br></br> {selectedType.propertyTypeName}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control 
                    type="text" 
                    placeholder="update name" 
                    defaultValue={selectedType.propertyTypeName}
                    onKeyDown={onFieldKeyDown('propertyTypeName')}
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
              <p><strong>Poundage:</strong> <br></br> {selectedType.propertyTypePoundage}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control 
                    type="number" 
                    placeholder="Enter new propertyTypePoundage" 
                    defaultValue={selectedType.propertyTypePoundage}
                    onKeyDown={onFieldKeyDown('propertyTypePoundage')}
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
          <Modal.Title className="text-white text-center">Delete Property Type</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedType && (
            <Form>
                <p><strong>Are you sure you want to remove this property type?</strong></p>
                <h2>{selectedType.propertyTypeCode}, {selectedType.propertyTypeName}</h2>
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

export default PropertyTypes;
