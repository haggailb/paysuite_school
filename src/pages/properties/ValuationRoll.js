import { useState, useEffect } from "react";
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle, FaHistory, FaReceipt } from "react-icons/fa";
import * as XLSX from "xlsx";
import Select from "react-select"
import AsyncSelect from 'react-select/async';
import {getCurrentDate} from "../../_utils/formatCurrentDate";
import formatCurrency from "../../_utils/formatCurrency";
import formatMobileNumber from "../../_utils/formatMobileNumber"
import { getInstitution } from "../../_services/dataServices";
import NewValuationProperty from "../../components/new_components/NewValuationProperty";
import { updateProperty, getProperties } from '../../_services/propertyServices';
import GlassLoader from "../../components/GlassLoader";
import { useMessageModal } from '../../components/ModalContext';
import { getClients } from '../../_services/clientServices';
import { getLocations } from "../../_services/locationServices";
import { getTypes } from "../../_services/propertyTypeServices";
  
    const date = getCurrentDate('long'); 

  const ValuationRoll = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showMessageModal } = useMessageModal();

  const [inputValue, setInputValue] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);

const handleKeyPress = (e) => {
  if (e.key === ' ') {
    setTriggerSearch(true);
  }
};

const loadClientOptions = (inputText, callback) => {
  if (!triggerSearch || inputText.trim().length < 2) {
    callback([]);
    return;
  }

  const terms = inputText.toLowerCase().split(/\s+/);

  const filtered = clients.filter(client => {
    const haystack = `${client.firstName} ${client.lastName} ${client.nationalId} ${client.mobileNumber}`.toLowerCase();
    return terms.every(term => haystack.includes(term));
  });

  callback(filtered.slice(0, 50)); // limit results to prevent UI overload
  setTriggerSearch(false);
};

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);
  
  const institution = getInstitution;
  const [properties, setProperties] = useState([]);
  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const trueFalse = {choice: "True", choice:'False'};

  const fetchProperties = async () => {
    try {
      const result = await getProperties('rates'); 
      setProperties(result.rows);
    } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(err.message || 'Something went wrong.');
    } 
  };

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
      setPropertyTypes(typeResults.rows);
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
    fetchClients();
    fetchLocations();
    fetchProperties();
    fetchTypes();
    setLoading(false);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchClients();
    fetchLocations();
    fetchProperties();
    fetchTypes();
    setLoading(false);
  };
    

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleOpenModal = (property, modalType) => {
    setSelectedProperty(property);
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
    setSelectedProperty(null);
  };
  
  const handleShowNewModal = () => setShowNewModal(true);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const filteredProperties = properties.filter(property => {
      const propertyValues = Object.values(property).join(' ').toLowerCase();
      return search
          .toLowerCase()
          .split(/\s+/) // split on any whitespace
          .every(word => propertyValues.includes(word));
  });
  
  const totalPages = Math.ceil(filteredProperties.length / recordsPerPage);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleExportCSV = () => {
    setLoading(true);
    const csvContent =
    "Stand No,Description,owner,Property Type,Situation,Land Extent,Land Value,Improvement Value,Total Ratable Value,Exemption,Comment\n" +
      filteredProperties
        .map(
          (property) =>
            `${property.propertyNo},${property.description},${property.firstName + ' ' + property.lastName},${property.propertyTypeName},${property.locationName},${property.land_extent},${property.land_value},${property.improvement_value},${property.trv},${property.isBillable},${property.remarks}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { property: "text/csv;charset=utf-8;" });
    setLoading(false);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${institution.name} Property Valuation Roll.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportXLSX = () => {
    setLoading(true);
    const worksheet = XLSX.utils.json_to_sheet(filteredProperties);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "properties");
    setLoading(false);
    XLSX.writeFile(workbook, `${institution.name} Property Valuation Roll.xlsx`);
  };
  const handleSelectChange = (field, selectedOption) => {

  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    
  };
  
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>${institution.name} Property Valuation Roll</title>
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
                <h3 style="margin: 0">Property Valuation Roll</h3>
                <p> Data Filter: <strong>${search || "none"}</strong> Date Printed: <strong>${date}</strong></p>
                <table>
                    <thead>
                        <tr>
                            <th>Stand No.</th>
                            <th>Owner</th>
                            <th>Type </th>
                            <th>Location </th>
                            <th>Land Extent (Ha) </th>
                            <th>Land Value </th>
                            <th>Improvement Value </th>
                            <th>P and M </th>
                            <th>Total Ratable Value </th>
                            <th>Exempted </th>
                            <th>Comment </th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredProperties
                            .map(
                                (property) => `
                            <tr style="padding: 1px; line-height: 1; font-size: 12px;">
                                <td>${property.propertyNo}</td>
                                <td>${property.firstName + ' ' + property.lastName}</td>
                                <td>${property.propertyTypeName}</td>
                                <td>${property.locationName}</td>
                                <td>${property.land_extent}</td>
                                <td>${formatCurrency(property.land_value, "ZMW", true)}</td>
                                <td>${formatCurrency(property.improvement_value, "ZMW", true)}</td>
                                <td>${formatCurrency(property.pandm, "ZMW", true)}</td>
                                <td>${formatCurrency(property.trv, "ZMW", true)}</td>
                                <td>${property.isRatesPayer}</td>
                                <td>${property.remarks}</td>
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
      <h2 className="page-title text-center mb-4">Property Valuation Roll</h2>
      <Row className="mb-3">
        <Col md={3} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search properties..."
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
      </Row>
      <Table striped bordered hover className="data-table table">
        <thead className="table-dark">
          <tr>
            <th>Stand No.</th>
            <th>Leaseholder</th>
            <th>Type </th>
            <th>Location </th>
            <th>Extent </th>
            <th>Land Value </th>
            <th>Improvements </th>
            <th>P & M </th>
            <th>T.R.V </th>
            <th>Actions </th>
          </tr>
        </thead>
        <tbody>
          {paginatedProperties.length === 0 && (
            <tr className="text-center">
              <td colSpan="10" className="text-danger">No properties found.</td>
            </tr>
          )}
          {paginatedProperties.map((property, index) => (
            <tr key={index}>
              <td>{property.propertyNo}</td>
              <td>{property.firstName + ' ' + property.lastName}</td>
              <td>{property.propertyTypeName}</td>
              <td>{property.locationName}</td>
              <td>{property.land_extent}</td>
              <td>{formatCurrency(property.land_value, "ZMW", true)}</td>
              <td>{formatCurrency(property.improvement_value, "ZMW", true)}</td>
              <td>{formatCurrency(property.pandm, "ZMW", true)}</td>
              <td>{formatCurrency(property.trv, "ZMW", true)}</td>
              <td>
                <Dropdown as={ButtonGroup} className="text-white">
                  <Button variant="outline-secondary" size="sm">
                    Actions
                  </Button>
                  <Dropdown.Toggle split variant="outline-secondary" size="sm" id={`dropdown-split-${index}`} />
                  <Dropdown.Menu>
                    <h6 className=" mb-0 text-center">{property.propertyNo}</h6>
                    <Dropdown.Item onClick={() => handleOpenModal(property, "view")}>
                      <FaEye className="me-2" /> View
                    </Dropdown.Item>
                    {/* <Dropdown.Item onClick={() => handleOpenModal(property, "edit")}>
                      <FaEdit className="me-2 text-success" /> Edit
                    </Dropdown.Item>
                    <Dropdown.Item className="text-danger" onClick={() => handleOpenModal(property, "delete")}>
                      <FaBan className="me-2" /> Delete
                    </Dropdown.Item> */}
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


      <Modal show={showNewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-center">Register New Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <NewValuationProperty />
        </Modal.Body>
      </Modal>

      {/* View bank Modal */}
      <Modal size="lg" show={showViewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Property Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProperty && (
            <>
              <Row>
                <Col md={6}>
                  <div className="border p-2">
                    <h4 className="page-title">Property Details</h4>
                    <p><strong>Property ID:</strong> {selectedProperty.propertyId}</p>
                    <p><strong>Stand No. :</strong> {selectedProperty.propertyNo}</p>
                    <p><strong>Description :</strong> {selectedProperty.description}</p>
                    <p><strong>Property Type :</strong> {selectedProperty.propertyTypeName}</p>
                    <p><strong>Location :</strong> {selectedProperty.locationName}</p>
                    <p><strong>Value of Land:</strong> {formatCurrency(selectedProperty.land_value)}</p>
                    <p><strong>Improvement Value:</strong> {formatCurrency(selectedProperty.improvement_value)}</p>
                    <p><strong>Total Ratable Value:</strong> {formatCurrency(selectedProperty.trv)}</p>
                    <p><strong>Poundage:</strong> {selectedProperty.propertyTypePoundage}</p>
                    <p><strong>Billable Property:</strong> {selectedProperty.isRatesPayer === 1 ? 'Yes': 'No'}</p>
                    <p><strong>Comment:</strong> {selectedProperty.remarks}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="border p-2">
                    <h4 className="page-title">Owner's Details</h4>
                    <p><strong>Owner ID:</strong> {selectedProperty.clientId}</p>
                    <p><strong>Owner Name. :</strong> {selectedProperty.firstName + ' ' + selectedProperty.lastName}</p>
                    <p><strong>National ID. :</strong> {selectedProperty.nationalId}</p>
                    <p><strong>Mobile Contact. :</strong> {formatMobileNumber(selectedProperty.mobileNumber)}</p>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit bank Modal */}
      <Modal show={showEditModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Edit Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProperty && (
            <Form>
            <Row>
              <Col md={6}><h3> Current Details</h3> </Col> 
              <Col md={6}><h3> New Details</h3> </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Stand No.:</strong><br></br> {selectedProperty.propertyNo}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="text" value={selectedProperty.propertyNo} disabled />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Leaseholder:</strong> <br></br> {selectedProperty.firstName + ' ' + selectedProperty.lastName }</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                    <AsyncSelect
                      cacheOptions
                      defaultOptions={false}
                      loadOptions={loadClientOptions}
                      getOptionLabel={(e) => `${e.firstName} ${e.lastName} - ${e.nationalId} - ${e.mobileNumber}`}
                      getOptionValue={(e) => e.clientId}
                      onChange={(selectedOption) => handleSelectChange("clientId", selectedOption)}
                      // value={selectedProperty.clientId}
                      placeholder="Select Leaseholder"
                      onKeyDown={handleKeyPress}
                      inputValue={inputValue}
                      onInputChange={(value) => {
                        setInputValue(value);
                        setTriggerSearch(false);
                      }}
                    />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Property Type:</strong> <br></br> {selectedProperty.propertyTypeName}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                    <Select
                        required
                        options={propertyTypes}
                        getOptionLabel={(e) => e.propertyTypeName}
                        getOptionValue={(e) => e.propertyTypeId}
                        onChange={(selectedOption) => handleSelectChange("propertyTypeId", selectedOption)}
                        placeholder="-- Select Type --"
                    />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Description:</strong> <br></br> {selectedProperty.desc}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="text" placeholder="Enter new description" />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Situation:</strong> <br></br> {selectedProperty.locationname}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                    <Select
                        required
                        options={locations}
                        getOptionLabel={(e) => e.locationName}
                        getOptionValue={(e) => e.locationId}
                        onChange={(selectedOption) => handleSelectChange("locId", selectedOption)}
                        placeholder="-- Select Location --"
                    />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Land Value:</strong> <br></br> {formatCurrency(selectedProperty.land_value)}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="number" placeholder="Enter new value" />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Improvement Value:</strong> <br></br> {formatCurrency(selectedProperty.improvement_value)}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="number" placeholder="Enter new value" onChange={handleChange} />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Total Ratable Value:</strong> <br></br> {formatCurrency(selectedProperty.trv)}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="number" placeholder="Enter new value" />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Is Billable :</strong> <br></br> {selectedProperty.isRatesPayer === 1 ? 'Yes': 'No'}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                    <Select
                        required
                        options={trueFalse}
                        getOptionLabel={(e) => e.choice}
                        getOptionValue={(e) => e.choice}
                        onChange={(selectedOption) => handleSelectChange("isRatesPayer", selectedOption)}
                        placeholder="-- Select Status --"
                    />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Comment:</strong> <br></br> {selectedProperty.remarks}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="number" placeholder="Enter new comment" />
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
      
      {/* confirm history bank Modal */}
      <Modal size="lg" show={showHistoryModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title >Property History</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedProperty && (
            <>
              <div>
                <p><strong>Bills and Receipts for {selectedProperty.stand}</strong></p>
                <Table striped bordered hover className="data-table">
                  <thead className="table-dark">
                    <tr>
                      <th>TXN.</th>
                      <th>Date </th>
                      <th>Amount </th>
                      <th>Description </th>
                      <th>Naration </th>
                      <th>DR / CR </th>
                      <th>Actions </th>
                    </tr>
                  </thead>
                  <tbody>
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* confirm delete bank Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-white text-center">Delete Property</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedProperty && (
            <Form>
                <p><strong>Are you sure you want to remove this property?</strong></p>
                <h2>{selectedProperty.stand}, {selectedProperty.type} <br></br> {selectedProperty.owner}</h2>
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

export default ValuationRoll;
