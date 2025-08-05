import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle, FaAnchor } from "react-icons/fa";
import * as XLSX from "xlsx";
import Select from 'react-select';
import {getCurrentDate} from "../../_utils/formatCurrentDate";
import formatCurrency from "../../_utils/formatCurrency";
import { getInstitution } from "../../_services/dataServices";
import { getDefaultAccounts } from "../../_services/defaultAccountServices";
import GlassLoader from "../../components/GlassLoader";
import { FaAngleRight } from "react-icons/fa6";
import NewDefaultAccount from "../../components/new_components/NewDefaultAccount";
  
    const date = getCurrentDate('long'); 

const DefaultBankAccounts = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFieldUpdate = async (e, accountId, fieldName, newValue) => {
    e.preventDefault();
    setLoading(true);
    try {
      // const result = await updateBankAccountField(accountId, fieldName, newValue);
      // alert(result.message);
      handleRefresh();
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const onFieldKeyDown = (fieldName) => (e) => {
    if (e.key === 'Enter') {
      handleFieldUpdate(e, selectedBankAccount.accountId, fieldName, e.target.value);
    }
  };

  const institution = getInstitution;
  const [defaults, setDefaults] = useState([]);
        
  const fetchBankAccounts = async () => {
    try {
      const result = await getDefaultAccounts(); 
      setDefaults(result.rows);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBankAccounts();
  }, []);
        
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedBankAccount, setSelectedBankAccount] = useState(null);

  const handleOpenModal = (bank, modalType) => {
    setSelectedBankAccount(bank);
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
    setSelectedBankAccount(null);
    handleRefresh();
  };
  
  const handleShowNewModal = () => setShowNewModal(true);

  const handleRefresh = async () => {
    fetchBankAccounts();
  };

  const fildertedDefaults = defaults.filter(defaultAccount =>
    Object.values(defaultAccount).some(value =>
      value != null && value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(fildertedDefaults.length / recordsPerPage);
  const paginatedDefaults = fildertedDefaults.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleExportCSV = () => {
    const csvContent =
      "Bank Name,Branch Code,Brank Name,Account Name,Account Number,Estimated Balance\n" +
      fildertedDefaults
        .map(
          (account) =>
            `${account.bankName},${account.branchCode},${account.branchName},${account.accountName},${account.accountNumber},${account.balanceEstimate}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${institution.name} Registered Bank Accounts.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(fildertedDefaults);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bank Accounts");
    XLSX.writeFile(workbook, `${institution.name} Registered Bank Accounts.xlsx`);
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
                            <th>Bank Name</th>
                            <th>Branch Name</th>
                            <th>Account Number</th>
                            <th>Account Name</th>
                            <th>Sort Code</th>
                            <th>Swift Code</th>
                            <th>Estimated Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${fildertedDefaults
                            .map(
                                (account) => `
                            <tr>
                                <td>${account.bankName}</td>
                                <td>${account.branchName}</td>
                                <td>${account.accountNumber}</td>
                                <td>${account.accountName}</td>
                                <td>${account.sortCode}</td>
                                <td>${account.swiftCode}</td>
                                <td>${formatCurrency(account.balanceEstimate)}</td>
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

    if (error) return (
      // <div className="text-danger text-center p-4">❌ Error: {error}</div>
      <div className="form-container mb-5 position-relative">
        <GlassLoader show={true} />
      </div>
      );
      
  return (
    <div className="form-container mb-5">
      <h2 className="page-title text-center mb-4">Default Bank Accounts</h2>
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
          <div className="mb-3 justify-content-end d-flex align-items-center gap-2">
            {/* <Button onClick={handleExportCSV} variant="success" className="me-2"><FaFileCsv /></Button>
            <Button onClick={handleExportXLSX} variant="warning" className="me-2"><FaFileExcel /></Button>
            <Button onClick={handlePrint} variant="primary" className="me-2"><FaPrint/></Button> */}
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
            <th>Bank Name</th>
            <th>Branch Name</th>
            <th>Account Number</th>
            <th>Account Name</th>
            <th>Service Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDefaults.length === 0 && (
            <tr className="text-center">
              <td colSpan="6" className="text-danger">No default accounts found</td>
            </tr>
          )}
          {paginatedDefaults.map((account, index) => (
            <tr key={index}>
              <td>{account.bankName}</td>
              <td>{account.branchName}</td>
              <td>{account.accountNumber}</td>
              <td>{account.accountName}</td>
              <td>{account.name}</td>
              <td>
                {/* <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(account, "view")}><FaEye /></Button>
                <Button variant="outline-success" size="sm" className="me-2" onClick={() => handleOpenModal(account, "edit")}><FaEdit /></Button>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => {}}><FaAngleRight /></Button>
                <Button variant="outline-danger" size="sm" className="me-2" onClick={() => handleOpenModal(account, "delete")}><FaBan /></Button> */}
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
          <Modal.Title className="text-center">New Deafult Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <NewDefaultAccount />
        </Modal.Body>
      </Modal>


      {/* View bank Modal */}
      <Modal show={showViewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Account Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBankAccount && (
            <div>
              <p><strong>Bank Name:</strong> {selectedBankAccount.bankName}</p>
              <p><strong>Bank Code Name:</strong> {selectedBankAccount.bankCodeName}</p>
              <p><strong>Branch Name:</strong> {selectedBankAccount.branchName}</p>
              <p><strong>Branch Code:</strong> {selectedBankAccount.branchCode}</p>
              <p><strong>Account Name:</strong> {selectedBankAccount.accountName}</p>
              <p><strong>Account Number:</strong> {selectedBankAccount.accountNumber}</p>
              <p><strong>Sort Code:</strong> {selectedBankAccount.sortCode}</p>
              <p><strong>Swift Code:</strong> {selectedBankAccount.swiftCode}</p>
              <p><strong>Estimated Balance:</strong> {formatCurrency(selectedBankAccount.balanceEstimate)}</p>
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
          <Modal.Title>Edit Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBankAccount && (
            <Form>
            <Row>
              <Col md={6}><h3> Current Details</h3> </Col> 
              <Col md={6}><h3> New Details</h3> </Col> 
            </Row>
            {/* <Row>
              <Col md={6}>
                <p><strong>Bank Name / Branch:</strong><br></br> {selectedBankAccount.name}</p>
              </Col> 
              <Col md={6}>
                  <Form.Group className="my-3">
                    <Select
                      required
                      options={banks}
                      getOptionLabel={(e) => e.name}
                      getOptionValue={(e) => e.bankId}
                      onChange={(selectedOption) => handleSelectChange("bankId", selectedOption)}
                      placeholder="-- Select Bank --"
                    />
                  </Form.Group>
              </Col> 
            </Row> */}
            <Row>
              <Col md={6}>
                <p><strong>Account Name:</strong> <br></br> {selectedBankAccount.accountName}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="text" placeholder="Enter new name"  onKeyDown={onFieldKeyDown('accountName')}/>
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
              <p><strong>Account Number:</strong> <br></br> {selectedBankAccount.accountNumber}</p>
              </Col> 
              <Col md={6}>
                <Form.Group className="my-3">
                  <Form.Control type="number" placeholder="Enter new number"  onKeyDown={onFieldKeyDown('accountNumber')}/>
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
      
      {/* Business History Modal */}
      <Modal show={showHistoryModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Account Statement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Receipts and Payments Ledger:</strong></p>
          <ul>
            {selectedBankAccount?.history?.map((entry, index) => (
              <li key={index}>{entry.date} - {entry.description} - {entry.amount}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* confirm delete bank Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-white text-center">Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedBankAccount && (
            <Form>
                <p><strong>Are you sure you want to remove this account?</strong></p>
                <h2>{selectedBankAccount.accountName}, {selectedBankAccount.accountNumber}</h2>
                <h3>{selectedBankAccount.bankName}, {selectedBankAccount.branchName}</h3>
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

export default DefaultBankAccounts;
