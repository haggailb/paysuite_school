import { useState, useEffect } from "react";
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaRecycle } from "react-icons/fa";
import * as XLSX from "xlsx";
import {getCurrentDate} from "../../_utils/formatCurrentDate";
import formatMobileNumber from "../../_utils/formatMobileNumber";
import Select from 'react-select';
import { getInstitution } from "../../_services/dataServices";
import NewBusiness from "../../components/new_components/NewBusiness";
import { updateBusinessField, getBusinesses } from '../../_services/businessServices';
import GlassLoader from "../../components/GlassLoader";
import { useMessageModal } from '../../components/ModalContext';
import { getClients } from '../../_services/clientServices';
import { getLocations } from "../../_services/locationServices";
import { getMarkets } from "../../_services/marketServices";
import { getTypes } from "../../_services/businessTypeServices";
  
    const date = getCurrentDate('long'); 

const Businesses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showMessageModal } = useMessageModal();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewBusinessModal, setShowNewBusinessModal] = useState(false);

  const [showNewModal, setShowNewModal] = useState(false);
  const handleShowNewModal = () => setShowNewModal(true);
  
  const institution = getInstitution;
  const [locations, setLocations] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [clients, setClients] = useState([]);
  const [businesses, setBusinesses] = useState([]);
      
  const fetchClients = async () => {
    try {
      const clientResults = await getClients(); 
      setClients(clientResults.rows);
    } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(err.message || 'Something went wrong.');
    }
  };

  const fetchLocations = async () => {
    try {
      const locationResults = await getLocations(); 
      setLocations(locationResults.rows);
    } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(err.message || 'Something went wrong.');
    }
  };

  const fetchTypes = async () => {
    try {
      const typeResults = await getTypes(); 
      setBusinessTypes(typeResults.rows);
    } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(err.message || 'Something went wrong.');
    }
  };

  const fetchMarkets = async () => {
    try {
      const marketResults = await getMarkets(); 
      setMarkets(marketResults.rows);
    } catch (err) {
      showMessageModal({
        heading: 'Server Error!',
        message: `Error: ${err.message || 'Something went wrong.'}`,
        messageType: 'error',
      });
      setError(err.message || 'Something went wrong.');
    } 
  };

  const fetchBusinesses = async () => {
    try {
      const result = await getBusinesses(); 
      setBusinesses(result.rows);
    } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(err.message || 'Something went wrong.');
    }
  };


  useEffect(() => {
    setLoading(true);

    fetchMarkets();
    fetchTypes();
    fetchLocations();
    fetchClients();
    fetchBusinesses();

    setLoading(false);
  }, []);
    
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const handleOpenModal = (business, modalType) => {
    setSelectedBusiness(business);
    if (modalType === "view") setShowViewModal(true);
    if (modalType === "edit") setShowEditModal(true);
    if (modalType === "history") setShowHistoryModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowHistoryModal(false);
    setShowNewBusinessModal(false);
    setSelectedBusiness(null);
    handleRefresh();
  };
  
  const handleShowNewBusinessModal = () => setShowNewBusinessModal(true);

  const handleSelectChange = (field, selectedOption) => {
    handleFieldUpdate(selectedBusiness.businessId, field, selectedOption);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchMarkets();
    fetchTypes();
    fetchLocations();
    fetchClients();
    fetchBusinesses();
    setLoading(false);
  };
    
  const handleFieldUpdate = async (businessId, fieldName, newValue) => {
    setLoading(true);
      try {
        const result = await updateBusinessField(businessId, fieldName, newValue);
        showMessageModal({
          heading: 'Success',
          message: `${result.message || 'Update Successful'}`,
          messageType: 'success',
        });
        handleRefresh();
      } catch (err) {
          showMessageModal({
            heading: 'Server Error!',
            message: `Error: ${err.message || 'An error occured while performing update.'}`,
            messageType: 'error',
          });
      }
      setLoading(false);
  };

  const onFieldKeyDown = (fieldName) => (e) => {
    if (e.key === 'Enter') {
      handleFieldUpdate(selectedBusiness.businessId, fieldName, e.target.value);
    }
  };
  

    const filteredBusinesses = businesses.filter(business => {
        const businessValues = Object.values(business).join(' ').toLowerCase();
        return search
            .toLowerCase()
            .split(/\s+/) // split on any whitespace
            .every(word => businessValues.includes(word));
    });

  const totalPages = Math.ceil(filteredBusinesses.length / recordsPerPage);
  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleExportCSV = () => {
    const csvContent =
      "Business Name,Owner,Zone,Market,Type\n" +
      filteredBusinesses
        .map(
          (business) =>
            `${business.name},${business.firstName} ${business.lastName},${business.zoneName},${business.marketName},${business.typeName}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${institution.name} Registered Business.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredBusinesses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Businesses");
    XLSX.writeFile(workbook, `${institution.name} Registered Business.xlsx`);
  };

    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>${institution.name} Registered Business Accounts</title>
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
                <h3 style="margin: 0">Registered Businesses</h3>
                <p> Data Filter: <strong>${search || "none"}</strong> Date Printed: <strong>${date}</strong></p>
                <table>
                    <thead>
                        <tr>
                            <th>Business Name</th>
                            <th>Owner's Name</th>
                            <th>Type</th>
                            <th>Zone</th>
                            <th>Market</th>
                            <th>Address</th>
                            <th>Mobile</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredBusinesses
                            .map(
                                (business) => `
                            <tr style="padding: 1px; line-height: 1; font-size: 12px;">
                                <td>${business.name}</td>
                                <td>${business.firstName} ${business.lastName}</td>
                                <td>${business.typeName}</td>
                                <td>${business.zoneName}</td>
                                <td>${business.marketName}</td>
                                <td>${business.physicalAddress},${business.locationName}</td>
                                <td>${business.mobileNumber}</td>
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
      <h2 className="page-title text-center mb-4">Registered Businesses</h2>
      <Row className="mb-3">
        <Col md={3} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search businesses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <div className="mb-3 justify-content-center d-flex align-items-center gap-2">
            <Button onClick={handleExportCSV} variant="success" className="me-2"><FaFileCsv /></Button>
            <Button onClick={handleExportXLSX} variant="warning" className="me-2"><FaFileExcel /></Button>
            <Button onClick={handlePrint} variant="primary" className="me-2"><FaPrint/></Button>
            <Button onClick={handleRefresh} className="outline-primary me-2"><FaRecycle/></Button>
          </div>
        </Col>
        <Col md={3} className="text-end">
          <Button onClick={handleShowNewBusinessModal} variant="info" className="hoverable"><FaPlusCircle/> Add </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead className="table-dark">
          <tr>
            <th>Business Name</th>
            <th>Owner's Name</th>
            <th>Type</th>
            <th>Location</th>
            <th>Zone</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBusinesses.length === 0 && (
            <tr className="text-center">
              <td colSpan="8" className="text-danger">No business profiles found.</td>
            </tr>
          )}
          {paginatedBusinesses.map((business, index) => (
            <tr key={index}>
            <td>{business.name}</td>
            <td>{business.firstName} {business.lastName}</td>
            <td>{business.typeName}</td>
            <td>{business.locationName}</td>
            <td>{business.zoneName}</td>
            <td>{business.mobileNumber}</td>
            <td>
              <Dropdown as={ButtonGroup}>
                <Button variant="outline-secondary" size="sm">
                  Actions
                </Button>
                <Dropdown.Toggle split variant="outline-secondary" size="sm" id={`dropdown-split-${index}`} />

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleOpenModal(business, "view")}>
                    <FaEye className="me-2" /> View
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleOpenModal(business, "edit")}>
                    <FaEdit className="me-2" /> Edit
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleOpenModal(business, "history")}>
                    <FaHistory className="me-2" /> History
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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
      
      <Modal show={showNewBusinessModal} size="lg" onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-center">Register New Business</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NewBusiness onClose={handleCloseModal} />
        </Modal.Body>
      </Modal>


      <Modal show={showViewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Business Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBusiness && (
            <div>
              <p><strong>Business Name:</strong> {selectedBusiness.name}</p>
              <p><strong>Owner:</strong> {selectedBusiness.firstName} {selectedBusiness.lastName}</p>
              <p><strong>Location:</strong> {selectedBusiness.locationName}</p>
              <p><strong>Address:</strong> {selectedBusiness.physicalAddress}</p>
              <p><strong>Mobile:</strong> {formatMobileNumber(selectedBusiness.mobileNumber)}</p>
              <p><strong>Business Type:</strong> {selectedBusiness.typeName}</p>
              <p><strong>Zone:</strong> {selectedBusiness.zoneName}</p>
              <p><strong>Market:</strong> {selectedBusiness.marketName}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Edit Business</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBusiness && (
            <Form>
            <Row>
              <Col md={6}><h3> Current Details</h3> </Col> 
              <Col md={6}><h3> New Details</h3> </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Business Name:</strong><br></br> {selectedBusiness.name}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control 
                    type="text" 
                    placeholder="Enter new name" 
                    name="name"
                    onKeyDown={onFieldKeyDown('name')}
                    defaultValue={selectedBusiness.name}
                    inputMode="text"
                    enterKeyHint="enter"
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Owner:</strong> <br></br> {selectedBusiness.firstName} {selectedBusiness.lastName}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Select
                    required
                    options={clients}
                    getOptionLabel={(e) => `${e.firstName} ${e.lastName}`}
                    getOptionValue={(e) => e.clientId}
                    onChange={(selectedOption) => handleSelectChange("clientId", selectedOption.clientId)}
                    placeholder="-- Select Owner --"
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
              <p><strong>Location:</strong> <br></br> {selectedBusiness.locationName}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Select
                    required
                    options={locations}
                    getOptionLabel={(e) => e.locationName}
                    getOptionValue={(e) => e.locationId}
                    onChange={(selectedOption) => handleSelectChange("locationId", selectedOption.locationId)}
                    placeholder="-- Select Location --"
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
              <p><strong>Address:</strong> <br></br>{selectedBusiness.physicalAddress}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control 
                    type="text" 
                    placeholder="Enter new address" 
                    name="physicalAddress"
                    onKeyDown={onFieldKeyDown('physicalAddress')}
                    defaultValue={selectedBusiness.physicalAddress}
                    inputMode="text"
                    enterKeyHint="enter"
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
              <p><strong>Mobile:</strong><br></br>{formatMobileNumber(selectedBusiness.mobileNumber)}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control 
                    type="number" 
                    placeholder="Enter new number" 
                    name="mobileNumber"
                    defaultValue={selectedBusiness.mobileNumber}
                    onKeyDown={onFieldKeyDown('mobileNumber')}
                    inputMode="number"
                    enterKeyHint="enter"
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
              <p><strong>Business Type:</strong> <br></br> {selectedBusiness.typeName}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Select
                    required
                    options={businessTypes}
                    getOptionLabel={(e) => e.typeName}
                    getOptionValue={(e) => e.id}
                    onChange={(selectedOption) => handleSelectChange("typeId", selectedOption.typeId)}
                    placeholder="-- Select Type --"
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
              <p><strong>Market:</strong><br></br>{selectedBusiness.marketName}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Select
                    required
                    options={markets}
                    getOptionLabel={(e) => e.marketName}
                    getOptionValue={(e) => e.marketId}
                    onChange={(selectedOption) => handleSelectChange("marketId", selectedOption.marketId)}
                    placeholder="-- Select Market --"
                  />
                </Form.Group>
              </Col> 
            </Row>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showHistoryModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Business History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Past Invoices & Payments:</strong></p>
          <ul>
            {selectedBusiness?.history?.map((entry, index) => (
              <li key={index}>{entry.date} - {entry.description} - {entry.amount}</li>
            ))}
          </ul>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Businesses;
