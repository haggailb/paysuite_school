import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle, FaHistory } from "react-icons/fa";
import * as XLSX from "xlsx";
import Select from "react-select"
import CurrentDate from "../../_utils/formatCurrentDate";
import formatCurrency from "../../_utils/formatCurrency";
import formatMobileNumber from "../../_utils/formatMobileNumber";
import { getInstitution, getTemporalStands, getClients, getLocations, getPropertyTypes, getZones} from "../../_services/dataServices";
import NewTemporalStand from "../../components/new_components/NewTemporalStand";
  
  const today = <CurrentDate />;

const TemporalStands = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProperty, setNewProperty] = useState({
    locId: "",
    zoneId: "",
    code: "",
    name: "",
  });

  useEffect(() => {
    setZones(getZones());
    setClients(getClients());
    setLocations(getLocations());
    setTemporalStands(getTemporalStands());
    setPropertyTypes(getPropertyTypes());
  }, []);
    
  const institution = getInstitution;
  const [zones, setZones] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [clients, setClients] = useState([]);
    const [stands, setTemporalStands] = useState([]);
    const [locations, setLocations] = useState([]);
    const trueFalse = {choice: "True", choice:'False'};

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
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
    console.log(newProperty);
  };

  const handleRefresh = () => {
    setZones(getZones());
    setClients(getClients());
    setLocations(getLocations());
    setTemporalStands(getTemporalStands());
    setPropertyTypes(getPropertyTypes());
  };

  const filteredStands = stands.filter(stand =>
    Object.values(stand).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredStands.length / recordsPerPage);
  const paginatedStands = filteredStands.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleExportCSV = () => {
    const csvContent =
    "Stand No,Type,Description,owner,mobile,national id,anual lease,\n" +
      filteredStands
        .map(
          (property) =>
            `${property.stand},${property.type},${property.owner},${property.mobile},${property.nationalId},${property.rent}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { property: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${institution.name} Registered stands.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredStands);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "stands");
    XLSX.writeFile(workbook, `${institution.name} Registered stands.xlsx`);
  };
  const handleSelectChange = (field, selectedOption) => {
    setNewProperty({ ...newProperty, [field]: selectedOption });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProperty({ ...newProperty, [name]: value });
  };
  
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>${institution.name} Registered stands</title>
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
                <h2>${institution.name}</h2>
                <h3>${institution.address}</h3>
                <h3>Registered stands</h3>
                <p> Data Filter: <strong>${search}</strong> Date Printed: <strong>${today}</strong></p>
                <table>
                    <thead>
                        <tr>
                            <th>Stand No.</th>
                            <th>Type </th>
                            <th>Location </th>
                            <th>Zone </th>
                            <th>Owner </th>
                            <th>Mobile </th>
                            <th>Anual Lease </th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredStands
                            .map(
                                (property) => `
                            <tr style="padding: 1px; line-height: 1; font-size: 12px;">
                                <td>${property.stand}</td>
                                <td>${property.type}</td>
                                <td>${property.location}</td>
                                <td>${property.zone}</td>
                                <td>${property.owner}</td>
                                <td>${formatMobileNumber(property.mobile)}</td>
                                <td>${formatCurrency(property.lease, "ZMW", true)}</td>
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


  return (
    <div className="form-container mb-5">
      <h2 className="page-title text-center mb-4">Temporal Stands</h2>
      <Row className="mb-3">
        <Col md={3} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search stands..."
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
            <th>Stand No.</th>
            <th>Type </th>
            <th>Location </th>
            <th>Zone </th>
            <th>Owner </th>
            <th>Mobile </th>
            <th>Anual Lease </th>
            <th>Actions </th>
          </tr>
        </thead>
        <tbody>
          {paginatedStands.map((property, index) => (
            <tr key={index} onDoubleClick={() => handleOpenModal(property, "view")}>
            <td>{property.stand}</td>
            <td>{property.type}</td>
            <td>{property.location}</td>
            <td>{property.zone}</td>
            <td>{property.owner}</td>
            <td>{formatMobileNumber(property.mobile)}</td>
            <td>{formatCurrency(property.lease, "ZMW", true)}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(property, "view")}><FaEye /></Button>
                <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleOpenModal(property, "edit")}><FaEdit /></Button>
                <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleOpenModal(property, "history")}><FaHistory /></Button>
                <Button variant="outline-danger" size="sm" className="me-2" onClick={() => handleOpenModal(property, "delete")}><FaBan /></Button>
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
          <Modal.Title className="text-center">Register New Stand</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <NewTemporalStand />
        </Modal.Body>
      </Modal>

      {/* View bank Modal */}
      <Modal size="lg" show={showViewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Stand Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProperty && (
            <>
              <Row>
                <Col md={6}>
                  <div className="border p-2">
                    <h4 className="page-title">Stand Details</h4>
                    <p><strong>Property ID:</strong> {selectedProperty.id}</p>
                    <p><strong>Stand No. :</strong> {selectedProperty.stand}</p>
                    <p><strong>Description :</strong> {selectedProperty.desc}</p>
                    <p><strong>Property Type :</strong> {selectedProperty.type}</p>
                    <p><strong>Location :</strong> {selectedProperty.location}</p>
                    <p><strong>Lease Amount:</strong> {formatCurrency(selectedProperty.lease)}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="border p-2">
                    <h4 className="page-title">Occupier Details</h4>
                    <p><strong>Occupier ID:</strong> {selectedProperty.clientId}</p>
                    <p><strong>Occupier Name. :</strong> {selectedProperty.owner}</p>
                    <p><strong>National ID. :</strong> {selectedProperty.nationalId}</p>
                    <p><strong>Mobile Contact. :</strong> {formatMobileNumber(selectedProperty.mobile)}</p>
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
          <Modal.Title>Edit Stand</Modal.Title>
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
                <p><strong>Stand No.:</strong><br></br> {selectedProperty.stand}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="text" value={selectedProperty.stand} disabled />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Property Type:</strong> <br></br> {selectedProperty.type}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                    <Select
                        required
                        options={propertyTypes}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => e.id}
                        onChange={(selectedOption) => handleSelectChange("typeId", selectedOption)}
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
                <p><strong>Situation:</strong> <br></br> {selectedProperty.location}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                    <Select
                        required
                        options={locations}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => e.id}
                        onChange={(selectedOption) => handleSelectChange("locId", selectedOption)}
                        placeholder="-- Select Location --"
                    />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Zone:</strong> <br></br> {selectedProperty.location}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                    <Select
                        required
                        options={zones}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => e.id}
                        onChange={(selectedOption) => handleSelectChange("zoneId", selectedOption)}
                        placeholder="-- Select Zone --"
                    />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Lease Amount:</strong> <br></br> {formatCurrency(selectedProperty.lease)}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="number" placeholder="Enter rent" />
                </Form.Group>
              </Col> 
            </Row>
            </Form>
          )}
        </Modal.Body>
      </Modal>
      
      {/* confirm history bank Modal */}
      <Modal size="lg" show={showHistoryModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title >Stand History</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedProperty && (
            <>
              <div>
                <p><strong>Lease history for {selectedProperty.stand}</strong></p>
                <Table striped bordered hover className="data-table">
                  <thead className="table-dark">
                    <tr>
                      <th>Client Name </th>
                      <th>From </th>
                      <th>To </th>
                      <th>Balance </th>
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
                      </tr>
                  </tbody>
                </Table>
              </div>
              <div className="mt-5">
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
          <Modal.Title className="text-white text-center">Delete Stand</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedProperty && (
            <Form>
                <p><strong>Are you sure you want to remove this stand?</strong></p>
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

export default TemporalStands;
