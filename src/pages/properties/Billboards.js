import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle, FaHistory } from "react-icons/fa";
import * as XLSX from "xlsx";
import Select from "react-select"
import CurleaseDate from "../../_utils/formatCurrentDate";
import formatCurrency from "../../_utils/formatCurrency";
import formatMobileNumber from "../../_utils/formatMobileNumber";
import { getInstitution, getBillboards, getClients, getLocations, getBillboardCats } from "../../_services/dataServices";
import NewBillboard from "../../components/new_components/NewBillboard";
  
  const today = <CurleaseDate />;

const Billboards = () => {
  const [search, setSearch] = useState("");
  const [curleasePage, setCurleasePage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);
  const [newBillboard, setNewBillboard] = useState({
    locId: "",
    zoneId: "",
    code: "",
    name: "",
  });

  useEffect(() => {
    setClients(getClients());
    setLocations(getLocations());
    setBillboards(getBillboards());
    setCategories(getBillboardCats());
  }, []);
    
  const institution = getInstitution;
  const billboardTypes = {choice:"Billboard", choice:"Banner"};
  const [clients, setClients] = useState([]);
  const [billboards, setBillboards] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedProperty, setSelectedBillboard] = useState(null);

  const handleOpenModal = (billboard, modalType) => {
    setSelectedBillboard(billboard);
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
    setSelectedBillboard(null);
  };
  
  const handleShowNewModal = () => setShowNewModal(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newBillboard);
  };

  const handleRefresh = () => {
    setClients(getClients());
    setLocations(getLocations());
    setBillboards(getBillboards());
    setCategories(getBillboardCats());
  };

  const filteredBillboards = billboards.filter(billboard =>
    Object.values(billboard).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredBillboards.length / recordsPerPage);
  const paginatedBillboards = filteredBillboards.slice(
    (curleasePage - 1) * recordsPerPage,
    curleasePage * recordsPerPage
  );

  const handleExportCSV = () => {
    const csvContent =
    "Billboard No,Type,Description,owner,mobile,national id,anual lease,\n" +
      filteredBillboards
        .map(
          (billboard) =>
            `${billboard.stand},${billboard.type},${billboard.owner},${billboard.mobile},${billboard.nationalId},${billboard.lease}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { billboard: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${institution.name} Registered billboards.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredBillboards);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "billboards");
    XLSX.writeFile(workbook, `${institution.name} Registered billboards.xlsx`);
  };
  const handleSelectChange = (field, selectedOption) => {
    setNewBillboard({ ...newBillboard, [field]: selectedOption });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBillboard({ ...newBillboard, [name]: value });
  };
  
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>${institution.name} Registered billboards</title>
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
                <h3>Registered billboards</h3>
                <p> Data Filter: <strong>${search}</strong> Date Printed: <strong>${today}</strong></p>
                <table>
                    <thead>
                        <tr>
                            <th>Billboard No.</th>
                            <th>Type </th>
                            <th>Location </th>
                            <th>Owner </th>
                            <th>Occupier </th>
                            <th>Address </th>
                            <th>Anual Lease </th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredBillboards
                            .map(
                                (billboard) => `
                            <tr style="padding: 1px; line-height: 1; font-size: 12px;">
                                <td>${billboard.stand}</td>
                                <td>${billboard.type}</td>
                                <td>${billboard.location}</td>
                                <td>${billboard.owner}</td>
                                <td>${billboard.occupier}</td>
                                <td>${billboard.address}</td>
                                <td>${formatCurrency(billboard.lease, "ZMW", true)}</td>
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
      <h2 className="page-title text-center mb-4">Registered Billboards</h2>
      <Row className="mb-3">
        <Col md={3} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search billboards..."
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
            <th>Billboard No.</th>
            <th>Type </th>
            <th>Location </th>
            <th>Owner </th>
            <th>Occupier </th>
            <th>Address </th>
            <th>Anual Lease </th>
            <th>Actions </th>
          </tr>
        </thead>
        <tbody>
          {paginatedBillboards.map((billboard, index) => (
            <tr key={index}>
            <td>{billboard.stand}</td>
            <td>{billboard.type}</td>
            <td>{billboard.location}</td>
            <td>{billboard.owner}</td>
            <td>{billboard.occupier}</td>
            <td>{billboard.address}</td>
            <td>{formatCurrency(billboard.lease, "ZMW", true)}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(billboard, "view")}><FaEye /></Button>
                <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleOpenModal(billboard, "edit")}><FaEdit /></Button>
                <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleOpenModal(billboard, "history")}><FaHistory /></Button>
                <Button variant="outline-danger" size="sm" className="me-2" onClick={() => handleOpenModal(billboard, "delete")}><FaBan /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button variant="secondary" onClick={() => setCurleasePage(prev => Math.max(prev - 1, 1))} disabled={curleasePage === 1}>Previous</Button>
        <span>Page {curleasePage} of {totalPages}</span>
        <Button variant="secondary" onClick={() => setCurleasePage(prev => Math.min(prev + 1, totalPages))} disabled={curleasePage === totalPages}>Next</Button>
      </div>


      <Modal show={showNewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-center">Register New Billboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <NewBillboard />
        </Modal.Body>
      </Modal>

      {/* View bank Modal */}
      <Modal size="lg" show={showViewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Billboard Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProperty && (
            <>
              <Row>
                <Col md={6}>
                  <div className="border p-2">
                    <h4 className="page-title">Billboard Details</h4>
                    <p><strong>Property ID:</strong> {selectedProperty.id}</p>
                    <p><strong>Billboard No. :</strong> {selectedProperty.stand}</p>
                    <p><strong>Category :</strong> {selectedProperty.category}</p>
                    <p><strong>Description :</strong> {selectedProperty.desc}</p>
                    <p><strong>Billboard Type :</strong> {selectedProperty.type}</p>
                    <p><strong>Sides :</strong> {selectedProperty.sides}</p>
                    <p><strong>Location :</strong> {selectedProperty.location}</p>
                    <p><strong>Lease Amount:</strong> {formatCurrency(selectedProperty.lease)}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="border p-2">
                    <h4 className="page-title">Owner Details</h4>
                    <p><strong>Occupier ID:</strong> {selectedProperty.clientId}</p>
                    <p><strong>Occupier Name. :</strong> {selectedProperty.owner}</p>
                    <p><strong>National ID. :</strong> {selectedProperty.nationalId}</p>
                    <p><strong>Mobile Contact. :</strong> {formatMobileNumber(selectedProperty.mobile)}</p>
                    <p><strong>Occupier. :</strong> {selectedProperty.occupier}</p>
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
          <Modal.Title>Edit Billboard</Modal.Title>
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
                <p><strong>Billboard No.:</strong><br></br> {selectedProperty.stand}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="text" value={selectedProperty.stand} disabled />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Category:</strong> <br></br> {selectedProperty.category}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                    <Select
                        required
                        options={categories}
                        getOptionLabel={(e) => e.category}
                        getOptionValue={(e) => e.id}
                        onChange={(selectedOption) => handleSelectChange("catId", selectedOption)}
                        placeholder="-- Select Category --"
                    />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Sides:</strong> <br></br> {selectedProperty.sides}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="number" placeholder="Enter sides" />
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
                <p><strong>Address:</strong> <br></br> {selectedProperty.address}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="text" placeholder="Enter new address" />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Owner:</strong> <br></br> {selectedProperty.owner}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                    <Select
                        required
                        options={clients}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => e.id}
                        onChange={(selectedOption) => handleSelectChange("clientId", selectedOption)}
                        placeholder="-- Select Owner --"
                    />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Ocuppier:</strong> <br></br> {selectedProperty.occupier}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="text" placeholder="Enter new occupier" />
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
          <Modal.Title >Billboard History</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedProperty && (
            <>
              <div >
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
          <Modal.Title className="text-white text-center">Delete Billboard</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedProperty && (
            <Form>
                <p><strong>Are you sure you want to remove this billboard?</strong></p>
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

export default Billboards;
