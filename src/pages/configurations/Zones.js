import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Modal, Card } from "react-bootstrap";
import { FaEye, FaEdit, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle } from "react-icons/fa";
import * as XLSX from "xlsx";
import { getCurrentDate } from "../../_utils/formatCurrentDate";
import { getInstitution } from "../../_services/dataServices";
import NewZone from "../../components/new_components/NewZone";
import { updateZone, getZones } from "../../_services/zoneServices";
import GlassLoader from "../../components/GlassLoader";
import { useMessageModal } from '../../components/ModalContext';
  
    const date = getCurrentDate('long'); 

const Zones = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);
  const { showMessageModal } = useMessageModal();

  const institution = getInstitution;
    const [Zones, setZones] = useState([]);

    const fetchZones = async () => {
      setLoading(true);
      try {
        const result = await getZones(); 
        setZones(result.rows);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
  
  useEffect(() => {
    fetchZones();
  }, []);
    
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedZone, setSelectedZones] = useState(null);

  const handleOpenModal = (bank, modalType) => {
    setSelectedZones(bank);
    if (modalType === "view") setShowViewModal(true);
    if (modalType === "edit") setShowEditModal(true);
    if (modalType === "delete") setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowNewModal(false);
    handleRefresh();
    setSelectedZones(null);
  };
  
  const handleShowNewModal = () => setShowNewModal(true);


  const handleRefresh = () => {
    fetchZones();
  };

  const handleFieldUpdate = async (e, zoneId, fieldName, newValue) => {
    e.preventDefault();
    setLoading(true);
      try {
        const result = await updateZone(zoneId, fieldName, newValue);
        showMessageModal({
          heading: 'Success!',
          message: `Zone updated successfully`,
          messageType: 'success',
        });
        handleRefresh();
      } catch (err) {
        showMessageModal({
          heading: 'Zone update failed!',
          message: `Error: ${err.message}`,
          messageType: 'error',
        });
      }
      setLoading(false);
  };

  const onFieldKeyDown = (fieldName) => (e) => {
    if (e.key === 'Enter') {
      handleFieldUpdate(e, selectedZone.zoneId, fieldName, e.target.value);
    }
  };

  const filteredZones = Zones.filter(Location =>
    Object.values(Location).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredZones.length / recordsPerPage);
  const paginatedZones = filteredZones.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleExportCSV = () => {
    const csvContent =
      "Zone Code, Zone Name\n" +
      filteredZones
        .map(
          (zones) =>
            `${zones.zoneCode},${zones.zoneName}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { zones: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${institution.name} Registered Zones.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredZones);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Zones");
    XLSX.writeFile(workbook, `${institution.name} Registered Zones.xlsx`);
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
                <h3 style="margin: 0">Registered Banks</h3>
                <p> Data Filter: <strong>${search || "none"}</strong> Date Printed: <strong>${date}</strong></p>
                <table>
                    <thead>
                        <tr>
                            <th>Zone Code</th>
                            <th>Zone Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredZones
                            .map(
                                (zone) => `
                            <tr>
                                <td>${zone.zoneCode}</td>
                                <td>${zone.zoneName}</td>
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
      <h2 className="page-title text-center mb-4">Zones</h2>
      <Row className="mb-3">
        <Col md={3} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search Zones..."
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
            <th>Zone Code</th>
            <th>Zone Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedZones.map((zone, index) => (
            <tr key={index} onDoubleClick={() => handleOpenModal(zone, "view")}>
              <td>{zone.zoneCode}</td>
              <td>{zone.zoneName}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(zone, "view")}><FaEye /></Button>
                <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleOpenModal(zone, "edit")}><FaEdit /></Button>
                {/* <Button variant="outline-danger" size="sm" className="me-2" onClick={() => handleOpenModal(zone, "delete")}><FaBan /></Button> */}
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
          <Modal.Title className="text-center">Register New Zone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <NewZone />
        </Modal.Body>
      </Modal>

      {/* View bank Modal */}
      <Modal show={showViewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Zone Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedZone && (
            <div>
              <p><strong>Zone ID:</strong> {selectedZone.zoneId}</p>
              <p><strong>Zone Code:</strong> {selectedZone.zoneCode}</p>
              <p><strong>Zone Name:</strong> {selectedZone.zoneName}</p>
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
          <Modal.Title>Edit Zone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedZone && (
            <Form>
              <Card>
                <Card.Header className="text-center">
                  <i>Press <strong>Enter</strong> to submit changes</i>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}><h3> Current Details</h3> </Col> 
                    <Col md={6}><h3> New Details</h3> </Col> 
                  </Row>
                  <Row>
                    <Col md={6}>
                      <p><strong>Code:</strong><br></br> {selectedZone.zoneCode}</p>
                    </Col> 
                    <Col md={6}>
                      <Form.Group className="my-3">
                        <Form.Control 
                          type="text" 
                          placeholder="Enter new code" 
                          defaultValue={selectedZone.zoneCode}
                          onKeyDown={onFieldKeyDown('zoneCode')}
                        />
                      </Form.Group>
                    </Col> 
                  </Row>
                  <Row>
                    <Col md={6}>
                      <p><strong>Name:</strong> <br></br> {selectedZone.zoneName}</p>
                    </Col> 
                    <Col md={6}>
                      <Form.Group className="my-3">
                        <Form.Control 
                          type="text" 
                          placeholder="Enter new name" 
                          defaultValue={selectedZone.zoneName}
                          onKeyDown={onFieldKeyDown('zoneName')}
                        />
                      </Form.Group>
                    </Col> 
                  </Row>
                </Card.Body>
              </Card>
            </Form>
          )}
        </Modal.Body>
      </Modal>
      
      {/* confirm delete bank Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-white text-center">Delete Zone</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedZone && (
            <Form>
                <p><strong>Are you sure you want to remove this zone?</strong></p>
                <h2>{selectedZone.code}, {selectedZone.name}</h2>
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

export default Zones;
