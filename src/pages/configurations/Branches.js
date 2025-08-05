import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle } from "react-icons/fa";
import * as XLSX from "xlsx";
import {getCurrentDate} from "../../_utils/formatCurrentDate";
import { getInstitution } from "../../_services/dataServices";
import { getAllBranches,updateBranchField } from '../../_services/branchServices';
import GlassLoader from "../../components/GlassLoader";
import NewBranch from "../../components/new_components/NewBranch";
  
  const date = getCurrentDate('long'); 

const Brances = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);
  const [newBranch, setNewBranch] = useState({
    branchId: "",
    bankid: "",
    branchCode: "",
    branchName: "",
    sortCode: "",
    switCode: "",
  });

  const handleFieldUpdate = async (e, branchId, fieldName, newValue) => {
    e.preventDefault();
    setLoading(true);
      try {
        const result = await updateBranchField(branchId, fieldName, newValue);
        alert(result.message);
        handleRefresh();
      } catch (err) {
        alert(err.message);
      }
      setLoading(false);
  };

  const onFieldKeyDown = (fieldName) => (e) => {
    if (e.key === 'Enter') {
      handleFieldUpdate(e, selectedBranch.branchId, fieldName, e.target.value);
    }
  };

  const institution = getInstitution;
  const [branchList, setBranches] = useState([]);
    
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const result = await getAllBranches(); 
        setBranches(result.rows);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchBranches();
  }, []);
    
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBranch, setselectedBranch] = useState(null);

  const handleOpenModal = (bank, modalType) => {
    setselectedBranch(bank);
    if (modalType === "view") setShowViewModal(true);
    if (modalType === "edit") setShowEditModal(true);
    if (modalType === "delete") setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setShowNewModal(false);
    setselectedBranch(null);
    handleRefresh();
  };
  
  const handleShowNewModal = () => setShowNewModal(true);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const result = await getAllBranches();
      setBranches(result.rows);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBanks = branchList.filter(bank =>
    Object.values(bank).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredBanks.length / recordsPerPage);
  const paginatedBranches = filteredBanks.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleExportCSV = () => {
    const csvContent =
      "Bank Name,Branch Code,Brank Name,Sort Code, Swift Code\n" +
      filteredBanks
        .map(
          (bank) =>
            `${bank.bankName},${bank.branchCode},${bank.branchName},${bank.sortCode},${bank.switCode}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${institution.name} Registered Banks.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredBanks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Banks");
    XLSX.writeFile(workbook, `${institution.name} Registered Banks.xlsx`);
  };

    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>${institution.name} Registered Banks</title>
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
                            <th>Bank Name</th>
                            <th>Bank Code</th>
                            <th>Branch Name</th>
                            <th>Sort Code</th>
                            <th>Swift Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredBanks
                            .map(
                                (bank) => `
                            <tr>
                                <td>${bank.bankName}</td>
                                <td>${bank.bankCodeName}</td>
                                <td>${bank.branchName}</td>
                                <td>${bank.sortCode}</td>
                                <td>${bank.swiftCode}</td>
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
      <h2 className="page-title text-center mb-4">Configure Branches</h2>
      <Row className="mb-3">
        <Col md={3} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search Banks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <div className="mb-3 justify-content-center d-flex align-items-center gap-2">
            <Button onClick={handleExportCSV} variant="success" className="me-2"><FaFileCsv /></Button>
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
            <th>Bank Name</th>
            <th>Bank Code Name</th>
            <th>Branch Name</th>
            <th>Branch Code</th>
            <th>Sort Code</th>
            <th>Swift Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBranches.length === 0 && (
            <tr className="text-center">
              <td colSpan="7" className="text-danger">No branches found</td>
            </tr>
          )}
          {paginatedBranches.map((brach, index) => (
            <tr key={index}>
              <td>{brach.bankName}</td>
              <td>{brach.bankCodeName}</td>
              <td>{brach.branchName}</td>
              <td>{brach.branchCode}</td>
              <td>{brach.sortCode}</td>
              <td>{brach.swiftCode}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(brach, "view")}><FaEye /></Button>
                <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleOpenModal(brach, "edit")}><FaEdit /></Button>
                {/* <Button variant="outline-danger" size="sm" onClick={() => handleOpenModal(bank, "delete")}><FaBan /></Button> */}
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
          <Modal.Title className="text-center">Register New Branch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <NewBranch />
        </Modal.Body>
      </Modal>


      {/* View bank Modal */}
      <Modal show={showViewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Bank Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBranch && (
            <div>
              <p><strong>Bank Name:</strong> {selectedBranch.bankName}</p>
              <p><strong>Branch Code:</strong> {selectedBranch.branchCode}</p>
              <p><strong>Branch Name:</strong> {selectedBranch.branchName}</p>
              <p><strong>Sort Code:</strong> {selectedBranch.sortCode}</p>
              <p><strong>Swift Code:</strong> {selectedBranch.swiftCode}</p>
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
          <Modal.Title>Edit Bank</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBranch && (
            <Form>
            <Row>
              <Col md={6}><h3> Current Details</h3> </Col> 
              <Col md={6}><h3> New Details</h3> </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>Bank Name:</strong><br></br> {selectedBranch.bankName}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="text" placeholder="Enter new name" value={selectedBranch.bankName} readOnly/>
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
              <p><strong>Branch Name:</strong> <br></br> {selectedBranch.branchName}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="text" placeholder="Enter new name" onKeyDown={onFieldKeyDown('branchName')}/>
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <p><strong>branchCode:</strong> <br></br> {selectedBranch.branchCode}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="text" placeholder="Enter new code"  onKeyDown={onFieldKeyDown('branchCode')}/>
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
              <p><strong>Sort Code:</strong> <br></br>{selectedBranch.sortCode}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="text" placeholder="Enter new code"  onKeyDown={onFieldKeyDown('sortCode')}/>
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
              <p><strong>Swift Code:</strong><br></br>{selectedBranch.swiftCode}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="text" placeholder="Enter new code"  onKeyDown={onFieldKeyDown('swiftCode')}/>
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
          <Modal.Title className="text-white text-center">Delete Bank</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedBranch && (
            <Form>
                <p><strong>Are you sure you want to remove this bank?</strong></p>
                <h2>{selectedBranch.bankName}, {selectedBranch.branchName}</h2>
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

export default Brances;
