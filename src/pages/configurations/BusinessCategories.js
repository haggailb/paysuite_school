import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Modal, Card } from "react-bootstrap";
import { FaEye, FaEdit, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle } from "react-icons/fa";
import * as XLSX from "xlsx";
import CurrentDate from "../../_utils/formatCurrentDate";
import {getInstitution, getBusinessCategories } from "../../_services/dataServices";
import NewBusinessCategory from "../../components/new_components/NewBusinessCategory";
import EditBusinessCategory from "../../components/edit_components/EditBusinessCategory";
  
  const today = <CurrentDate />;

const BusinessCategories = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    code: "",
    name: "",
  });

  const institution = getInstitution;
    const [categories, setBusinessCategories] = useState([]);

    useEffect(() => {
        setBusinessCategories(getBusinessCategories());
    }, []);
    
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleOpenModal = (bank, modalType) => {
    setSelectedCategory(bank);
    if (modalType === "view") setShowViewModal(true);
    if (modalType === "edit") setShowEditModal(true);
    if (modalType === "delete") setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowNewModal(false);
    setSelectedCategory(null);
  };
  
  const handleShowNewModal = () => setShowNewModal(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newCategory);
  };

  const handleRefresh = () => {
    setBusinessCategories(getBusinessCategories());
  };

  const filteredCategories = categories.filter(category =>
    Object.values(category).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredCategories.length / recordsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleExportCSV = () => {
    const csvContent =
      "Code,Category,Description\n" +
      filteredCategories
        .map(
          (type) =>
            `${type.code},${type.name},${type.desc}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${institution.name} Registered Business Categories.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredCategories);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Business Categories");
    XLSX.writeFile(workbook, `${institution.name} Registered Business Categories.xlsx`);
  };

  const handleSelectChange = (field, selectedOption) => {
    setNewCategory({ ...newCategory, [field]: selectedOption });
  };
  
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>${institution.name} Registered Business Categories</title>
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
                <h3>Registered Business Categories</h3>
                <p> Data Filter: <strong>${search}</strong> Date Printed: <strong>${today}</strong></p>
                <table>
                    <thead>
                        <tr>
                            <th>Category Code</th>
                            <th>Category Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredCategories
                            .map(
                                (category) => `
                            <tr>
                                <td>${category.code}</td>
                                <td>${category.name}</td>
                                <td>${category.desc}</td>
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
      <h2 className="page-title text-center mb-4">Business Categories</h2>
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
            <th>Category Code</th>
            <th>Category Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCategories.map((category, index) => (
            <tr key={index}>
            <td>{category.code}</td>
            <td>{category.name}</td>
            <td>{category.desc}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(category, "view")}><FaEye /></Button>
                <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleOpenModal(category, "edit")}><FaEdit /></Button>
                <Button variant="outline-danger" size="sm" className="me-2" onClick={() => handleOpenModal(category, "delete")}><FaBan /></Button>
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
            <NewBusinessCategory />
        </Modal.Body>
      </Modal>

      {/* View bank Modal */}
      <Modal show={showViewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title> Category Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Card.Body>
              {selectedCategory && (
                <div>
                  <p><strong>Category ID:</strong> {selectedCategory.id}</p>
                  <p><strong>Category Code:</strong> {selectedCategory.code}</p>
                  <p><strong>Category Name:</strong> {selectedCategory.name}</p>
                  <p><strong>Category Description:</strong> {selectedCategory.desc}</p>
                </div>
              )}
          </Card.Body>
        </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit bank Modal */}
      <Modal show={showEditModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditBusinessCategory category={selectedCategory}/>
        </Modal.Body>
      </Modal>
      
      {/* confirm delete bank Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-white text-center">Delete Business Category</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedCategory && (
            <Card>
                <Card.Header><strong>Are you sure you want to remove this business category?</strong></Card.Header>
                <Card.Body>
                  <h2>{selectedCategory.code}, {selectedCategory.name}</h2>
                </Card.Body>
                <Card.Footer>
                  <Row >
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

export default BusinessCategories;
