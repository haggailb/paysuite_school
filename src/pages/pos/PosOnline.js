import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle, FaHistory } from "react-icons/fa";
import * as XLSX from "xlsx";
import Select from "react-select"
import CurrentDate from "../../_utils/formatCurrentDate";
import formatCurrency from "../../_utils/formatCurrency";
import {getInstitution, getOnlineRecepts} from "../../_services/dataServices";
  
  const today = <CurrentDate />;

const RentalProperties = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    setOnlineReceipts(getOnlineRecepts());
  }, []);
    
  const [receipts, setOnlineReceipts] = useState([]);
  const institution = getInstitution;

  const [showViewModal, setShowViewModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const handleOpenModal = (receipt, modalType) => {
    setSelectedReceipt(receipt);
    if (modalType === "view") setShowViewModal(true);
    if (modalType === "print") setShowPrintModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setShowPrintModal(false);
    setSelectedReceipt(null);
  };
  
  const handleRefresh = () => {
    setOnlineReceipts(getOnlineRecepts());
  };

  const filteredReceipts = receipts.filter(receipt =>
    Object.values(receipt).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredReceipts.length / recordsPerPage);
  const paginatedReceipts = filteredReceipts.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleExportCSV = () => {
    const csvContent =
    "id,client,naration,amount due,amount paid,balance,bank,reference,date\n" +
      filteredReceipts
        .map(
          (receipt) =>
            `${receipt.id},${receipt.client},${receipt.naration},${receipt.due},${receipt.paid},${receipt.balance},${receipt.bank},${receipt.reference},${receipt.date}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { receipt: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${institution.name} Registered receipts.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredReceipts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "receipts");
    XLSX.writeFile(workbook, `${institution.name} Registered receipts.xlsx`);
  };
  
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>${institution.name} Registered receipts</title>
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
                <h3>Registered receipts</h3>
                <p> Data Filter: <strong>${search}</strong> Date Printed: <strong>${today}</strong></p>
                <table>
                    <thead>
                        <tr>
                            <th>TXN.</th>
                            <th>TXN REF.</th>
                            <th>Client </th>
                            <th>Naration </th>
                            <th>Amount Due </th>
                            <th>Amount Paid </th>
                            <th>Balance </th>
                            <th>Bank (SqM) </th>
                            <th>Date </th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredReceipts
                            .map(
                                (receipt) => `
                            <tr>
                                <td>${receipt.id}</td>
                                <td>${receipt.reference}</td>
                                <td>${receipt.client}</td>
                                <td>${receipt.naration}</td>
                                <td>${formatCurrency(receipt.due, "ZMW", true)}</td>
                                <td>${formatCurrency(receipt.paid, "ZMW", true)}</td>
                                <td>${formatCurrency(receipt.balance, "ZMW", true)}</td>
                                <td>${receipt.bank}</td>
                                <td>${receipt.date}</td>
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
      <h2 className="page-title text-center mb-4">Online Receipts</h2>
      <Row className="mb-3">
        <Col md={3} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search receipts..."
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
      <Table striped bordered hover className="data-table">
        <thead className="table-dark">
          <tr>
            <th>TXN.</th>
            <th>Client </th>
            <th>Naration </th>
            <th>Amount Due </th>
            <th>Amount Paid </th>
            <th>Balance </th>
            <th>Bank (SqM) </th>
            <th>Date </th>
            <th>Actions </th>
          </tr>
        </thead>
        <tbody>
          {paginatedReceipts.map((receipt, index) => (
            <tr key={index}>
            <td>{receipt.id}</td>
            <td>{receipt.client}</td>
            <td>{receipt.naration}</td>
            <td>{formatCurrency(receipt.due, "ZMW", true)}</td>
            <td>{formatCurrency(receipt.paid, "ZMW", true)}</td>
            <td>{formatCurrency(receipt.balance, "ZMW", true)}</td>
            <td>{receipt.bank}</td>
            <td>{receipt.date}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(receipt, "view")}><FaEye /></Button>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleOpenModal(receipt, "print")}><FaPrint /></Button>
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

      {/* View bank Modal */}
      <Modal show={showViewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Property Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReceipt && (
            <div className="border p-2">
              <p><strong>TXN ID:</strong> {selectedReceipt.id}</p>
              <p><strong>TXN Reference:</strong> {selectedReceipt.reference}</p>
              <p><strong>Date. :</strong> {selectedReceipt.date}</p>
              <p><strong>Client Name :</strong> {selectedReceipt.client}</p>
              <p><strong>Naration:</strong> {selectedReceipt.naration}</p>
              <p><strong>Amount Due :</strong> {formatCurrency(selectedReceipt.due, "ZMW")}</p>
              <p><strong>Amount Due :</strong> {formatCurrency(selectedReceipt.paid, "ZMW")}</p>
              <p><strong>Balance Due :</strong> {formatCurrency(selectedReceipt.balance, "ZMW")}</p>
              <p><strong>Bank:</strong> {selectedReceipt.bank}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* confirm delete bank Modal */}
      <Modal show={showPrintModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title className="text-white text-center">Print Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedReceipt && (
            <Form>
                <p><strong>Are you sure you want to print this receipt?</strong></p>
                <h2>{formatCurrency(selectedReceipt.paid,"ZMW")}, {selectedReceipt.naration} <br></br> {selectedReceipt.client}</h2>
                <Row className="mt-5">
                <Col md={6}>
                    <Button variant="secondary" className="shadow" onClick={handleCloseModal}>No</Button>
                </Col> 
                <Col md={6}>
                    <Button className="bg-primary hoverable" >Yes</Button>
                </Col> 
                </Row>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RentalProperties;
