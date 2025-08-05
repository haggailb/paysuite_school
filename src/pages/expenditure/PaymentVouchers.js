import { useState, useEffect  } from "react";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint } from "react-icons/fa";
import * as XLSX from "xlsx";
// import NewClient from "../components/new_components/NewClient";
import { getInstitution, getPayments } from "../../_services/dataServices";
import formatCurrency from "../../_utils/formatCurrency";

const PaymentVouchers = () => {
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedClient, setSelectedPayment] = useState(null);
    const [showNewModal, setShowNewModal] = useState(false);
    
    const institution = getInstitution;
      const [paymentsData, setPayments] = useState([]);
      useEffect(() => {
        setPayments(getPayments());
      }, []);

    
  const handleShowNewModal = () => setShowNewModal(true);

    const handleViewClient = (payment) => {
        setSelectedPayment(payment);
        setShowViewModal(true);
    };

    const handleEditClient = (payment) => {
        setSelectedPayment(payment);
        setShowEditModal(true);
    };

    const handleHistoryClient = (payment) => {
        setSelectedPayment(payment);
        setShowHistoryModal(true);
    };

    const handleCloseModal = () => {
        setShowViewModal(false);
        setShowEditModal(false);
        setShowHistoryModal(false);
        setShowNewModal(false);
    };
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    
    const filteredPayments = paymentsData.filter(payment =>
        Object.values(payment).some(value =>
            value.toString().toLowerCase().includes(search.toLowerCase())
        )
    );

    const totalPages = Math.ceil(filteredPayments.length / recordsPerPage);
    const paginatedPayments = filteredPayments.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    const handleRefresh = () => {
      setPayments(getPayments());
    };

    const handleExportCSV = () => {
        const csvContent =
            "PV Number,Beneficiary,Naration,Reference, Due, Paid,Balance,Date\n" +
            filteredPayments
                .map(
                    (payment) =>
                        `${payment.pvNo},${payment.beneficiary},${payment.naration},${payment.reference},${payment.amountDue},${payment.amountPaid},${payment.balance},${payment.date}`
                )
                .join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `${institution.name} Paymens List.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportXLSX = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredPayments);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
        XLSX.writeFile(workbook, `${institution.name} Paymens List.xlsx`);
    };

    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>Paymens List</title>
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
                <h3>Paymens List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>PV Number</th>
                            <th>Beneficiary</th>
                            <th>Naration</th>
                            <th>Reference</th>
                            <th>Amount Due</th>
                            <th>Amount Paid</th>
                            <th>Balance</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredPayments
                            .map(
                                (payment) => `
                            <tr>
                                <td>${payment.pvNo}</td>
                                <td>${payment.beneficiary}</td>
                                <td>${payment.naration}</td>
                                <td>${payment.reference}</td>
                                <td>${formatCurrency(payment.amountDue,"ZMW",true)}</td>
                                <td>${formatCurrency(payment.amountPaid,"ZMW",true)}</td>
                                <td>${formatCurrency(payment.balance,"ZMW",true)}</td>
                                <td>${payment.date}</td>
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
            <h2 className="page-title text-center mb-4 mb-3">Payment Vouchers</h2>
            <Row className="mb-3">
                <Col md={3} className="mb-3">
                    {/* Search Input */}
                    <Form.Control
                        type="text"
                        placeholder="Search payments..."
                        className="my-2"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </Col>
                <Col md={6}>
                    {/* Action Buttons */}
                    <div className="mb-3 justify-content-center d-flex align-items-center gap-2">
                        <Button onClick={handleExportCSV} variant="success" className="me-2"><FaFileCsv /></Button>
                        <Button onClick={handleExportXLSX} variant="warning" className="me-2"><FaFileExcel /></Button>
                        <Button onClick={handlePrint} variant="primary" className="me-2"><FaPrint/></Button>
                        <Button onClick={handleRefresh} className="me-2 outline-primary"><FaRecycle/></Button>
                    </div>
                </Col>
                <Col md={3} className="mb-3 text-end">
                    <Button onClick={handleShowNewModal} variant="info" className="hoverable"><FaPlusCircle/> Add </Button>
                </Col>
            </Row>

            {/* Payments Table */}
            <div className="table-responsive">
                <Table striped bordered hover>
                    <thead className="table-dark">
                        <tr>
                          <th>PVN</th>
                          <th>Beneficiary</th>
                          <th>Naration</th>
                          <th>Reference</th>
                          <th>Due</th>
                          <th>Paid</th>
                          <th>Balance</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPayments.map((payment, index) => (
                            <tr key={index}>
                              <td>{payment.pvNo}</td>
                              <td>{payment.beneficiary}</td>
                              <td>{payment.naration}</td>
                              <td>{payment.reference}</td>
                              <td>{formatCurrency(payment.amountDue,"ZMW",true)}</td>
                              <td>{formatCurrency(payment.amountPaid,"ZMW",true)}</td>
                              <td>{formatCurrency(payment.balance,"ZMW",true)}</td>
                              <td>{payment.date}</td>
                              <td>
                                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleViewClient(payment)}>
                                  <FaEye size={16} />
                                </button>
                                <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleEditClient(payment)}>
                                  <FaEdit size={16} />
                                </button>
                                <button className="btn btn-sm btn-outline-primary" onClick={() => handleHistoryClient(payment)}>
                                  <FaHistory size={16} />
                                </button>
                              </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <Button
                    variant="secondary"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button
                    variant="secondary"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>

            <Modal size="lg" show={showNewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
                <Modal.Header closeButton className="bg-primary">
                <Modal.Title className="text-center">Register New Client</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <NewClient /> */}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" className="hoverable" onClick={handleCloseModal}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            
            {/* View Modal */}
            <Modal show={showViewModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="bg-primary">
                    <Modal.Title>Client Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedClient && (
                        <>
                            <p><strong>Client ID:</strong> {selectedClient.paymentID}</p>
                            <p><strong>Name:</strong> {selectedClient.firstName} {selectedClient.lastName}</p>
                            <p><strong>National ID:</strong> {selectedClient.nationalId}</p>
                            <p><strong>Phone:</strong> {selectedClient.phoneNumber}</p>
                            <p><strong>Email:</strong> {selectedClient.email}</p>
                            <p><strong>Address:</strong> {selectedClient.address}</p>
                            <p><strong>Business Name:</strong> {selectedClient.businessName}</p>
                            <p><strong>Client Category:</strong> {selectedClient.paymentCategory}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={handleCloseModal} backdrop="static" keyboard={false}  >
                <Modal.Header closeButton className="bg-primary">
                    <Modal.Title>Edit Client Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedClient && (
                        <Form>
                        <Row>
                          <Col md={6}>
                            <Form.Group controlId="paymentId" aria-required className="mb-3">
                                <Form.Label>Client ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={selectedClient.paymentID}
                                    disabled
                                />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="nationalId" aria-required className="mb-3">
                                <Form.Label>National ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={selectedClient.nationalId}
                                />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <Form.Group controlId="firstName" aria-required className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={selectedClient.firstName}
                                />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="lastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    defaultValue={selectedClient.lastName}
                                />
                            </Form.Group>
                          </Col>
                        </Row>
                        
                          <Form.Group controlId="phone" aria-required className="mb-3">
                              <Form.Label>Mobile Number</Form.Label>
                              <Form.Control
                                  type="text"
                                  defaultValue={selectedClient.phoneNumber}
                              />
                          </Form.Group>
                          <Form.Group controlId="editLastName">
                              <Form.Label>Email Address</Form.Label>
                              <Form.Control
                                  type="email"
                                  defaultValue={selectedClient.email}
                              />
                          </Form.Group>
                          <Form.Group controlId="editLastName">
                              <Form.Label>Physical Address</Form.Label>
                              <Form.Control
                                  type="text"
                                  defaultValue={selectedClient.address}
                              />
                          </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="hoverable" variant="secondary" onClick={handleCloseModal}>Close</Button>
                    <Button className="hoverable bg-primary" onClick={handleCloseModal}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            {/* History Modal */}
            <Modal show={showHistoryModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="bg-primary">
                    <Modal.Title>Client Payment History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedClient && (
                        <div>
                            {/* Example list of payments */}
                            <h5>Bill and Payment History:</h5>
                            <ul>
                                <li>Payment of ZMW200 for Business Registration - 01/01/2023</li>
                                <li>Payment of ZMW50 for Business Renewal - 30/01/2024</li>
                                {/* Add more items here */}
                            </ul>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PaymentVouchers;
