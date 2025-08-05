import { useState, useEffect } from "react";
import { Button, Table, Form, Card, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle, FaTrash } from "react-icons/fa";
import * as XLSX from "xlsx";
import Select from "react-select"
import CurrentDate from "../../_utils/formatCurrentDate";
import formatCurrency from "../../_utils/formatCurrency";
import { getInstitution, getCOA, getLicencingCategories } from "../../_services/dataServices";
import NewLicensingCategory from "../../components/new_components/NewLicensingCategory";
  
  const today = <CurrentDate />;

const LicencingCategories = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    locId: "",
    zoneId: "",
    code: "",
    name: "",
  });

    useEffect(() => {
      setCOA(getCOA());
      setLicencingStructure(getLicencingCategories());
    }, []);
  
  const [coAccounts, setCOA] = useState([]);
    const institution = getInstitution;
  const [licenceCategories, setLicencingStructure] = useState([]);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLicenceCategory, setSelectedLicenceCategory] = useState(null);

  const handleOpenModal = (bank, modalType) => {
    setSelectedLicenceCategory(bank);
    if (modalType === "view") setShowViewModal(true);
    if (modalType === "edit") setShowEditModal(true);
    if (modalType === "delete") setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowNewModal(false);
    setSelectedLicenceCategory(null);
  };
  
  const handleShowNewModal = () => setShowNewModal(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newCategory);
  };

  const handleRefresh = () => {
    setCOA(getCOA());
    setLicencingStructure(getLicencingCategories());
  };

  const filteredLicenceCategories = licenceCategories.filter(coaCategory =>
    Object.values(coaCategory).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredLicenceCategories.length / recordsPerPage);
  const paginatedLicenceCategories = filteredLicenceCategories.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleExportCSV = () => {
    const csvContent =
      "Account Code, Account Name, Business Category, Amount\n" +
      filteredLicenceCategories
        .map(
          (coaCategory) =>
            `${coaCategory.code},${coaCategory.name},${coaCategory.category},${coaCategory.amount}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { coaCategory: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${institution.name} Registered Licence Categories.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredLicenceCategories);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Licence Categories");
    XLSX.writeFile(workbook, `${institution.name} Registered Licence Categories.xlsx`);
  };

  const handleSelectChange = (field, selectedOption) => {
    setNewCategory({ ...newCategory, [field]: selectedOption });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };
  
    const handlePrint = () => {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
              <title>${institution.name} Registered Licence Categories</title>
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
              <h3>Registered Licence Categories</h3>
              <p> Data Filter: <strong>${search}</strong> Date Printed: <strong>${today}</strong></p>
              <table>
                  <thead>
                      <tr>
                          <th>Account Code</th>
                          <th>Account Name</th>
                          <th>Business Category </th>
                          <th>Amount </th>
                      </tr>
                  </thead>
                  <tbody>
                      ${filteredLicenceCategories
                          .map(
                              (coaCategory) => `
                          <tr>
                            <td>${coaCategory.code}</td>
                            <td>${coaCategory.name}</td>
                            <td>${coaCategory.category}</td>
                            <td>${formatCurrency(coaCategory.amount, "ZMW")}</td>
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
      <h2 className="page-title text-center mb-4"> Fee Structures<br></br> ( Licensing )</h2>
      <Row className="mb-3">
        <Col md={3} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search Categories..."
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
            <th>Account Code</th>
            <th>Account Name</th>
            <th>Business Category </th>
            <th>Amount </th>
            <th>Actions </th>
          </tr>
        </thead>
        <tbody>
          {paginatedLicenceCategories.map((coaCategory, index) => (
            <tr key={index}>
              <td>{coaCategory.code}</td>
              <td>{coaCategory.name}</td>
              <td>{coaCategory.category}</td>
              <td>{formatCurrency(coaCategory.amount, "ZMW")}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2 hoverable" onClick={() => handleOpenModal(coaCategory, "view")}><FaEye /></Button>
                <Button variant="outline-success" size="sm" className="me-2 hoverable" onClick={() => handleOpenModal(coaCategory, "edit")}><FaEdit /></Button>
                <Button variant="outline-danger" size="sm" className="me-2 hoverable" onClick={() => handleOpenModal(coaCategory, "delete")}><FaTrash /></Button>
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
          <Modal.Title className="text-center">Register New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <NewLicensingCategory />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="hoverable" onClick={handleCloseModal}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      {/* View bank Modal */}
      <Modal show={showViewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Category Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLicenceCategory && (
            <div>
              <p><strong>Account Code:</strong> {selectedLicenceCategory.code}</p>
              <p><strong>Account Name:</strong> {selectedLicenceCategory.name}</p>
              <p><strong>Category:</strong> {selectedLicenceCategory.category}</p>
              <p><strong>Amount:</strong> {formatCurrency(selectedLicenceCategory.amount, "ZMW")}</p>
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
          <Modal.Title>Edit Market</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLicenceCategory && (
            <Form>
            <Row>
              <Col md={6}><h3> Current Details</h3> </Col> 
              <Col md={6}><h3> New Details</h3> </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Account Code:</strong> <br></br> {selectedLicenceCategory.code}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                    <Select
                        required
                        options={coAccounts}
                        getOptionLabel={(e) => `${e.code} - ${e.name}`}
                        getOptionValue={(e) => e.code}
                        onChange={(selectedOption) => handleSelectChange("coaCode", selectedOption)}
                        placeholder="-- Select Code --"
                    />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Category:</strong><br></br> {selectedLicenceCategory.category}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="text" placeholder="Enter new category" />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Amount:</strong> <br></br> {formatCurrency(selectedLicenceCategory.amount, "ZMW")}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="number" placeholder="Enter new amount" />
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
          <Modal.Title className="text-white text-center">Delete Category</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedLicenceCategory && (
            <Card>
              <Card.Header><strong>Are you sure you want to remove this category?</strong></Card.Header>
              <Card.Body>
                <Form>
                    <h2>{selectedLicenceCategory.code}, {selectedLicenceCategory.name}<br></br> {selectedLicenceCategory.category} </h2>
                </Form>
              </Card.Body>
              <Card.Footer>
                <Row className="">
                <Col md={6}>
                    <Button variant="secondary" onClick={handleCloseModal}>No</Button>
                </Col> 
                <Col md={6}>
                  <Button variant="secondary" className="bg-danger" >Yes</Button>
                </Col> 
                </Row>
              </Card.Footer>
            </Card>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LicencingCategories;
