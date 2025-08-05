import { useState, useEffect  } from "react";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint } from "react-icons/fa";
import * as XLSX from "xlsx";
import { getInstitution } from "../../_services/dataServices";
import formatMobileNumber from "../../_utils/formatMobileNumber"
import EditSupplier from "../../components/edit_components/EditSupplier";
import SupplierHistory from "../../components/history_components/SupplierHistory";
import NewSupplier from "../../components/new_components/NewSupplier";
import { getSuppliers } from "../../_services/supplierServices";
import GlassLoader from "../../components/GlassLoader";
import { useMessageModal } from '../../components/ModalContext';
import { getCurrentDate } from "../../_utils/formatCurrentDate";

const date = getCurrentDate('long'); 

const Suppliers = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showMessageModal } = useMessageModal();

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedSupplier, setSelectedClient] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  
  const institution = getInstitution;
  const [suppliersData, setSuppliers] = useState([]);
  
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const result = await getSuppliers(); 
      setSuppliers(result.rows);
    } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
    
  useEffect(() => {
    fetchSuppliers();
  }, []);

  
  const handleShowNewModal = () => setShowNewModal(true);

    const handleViewClient = (supplier) => {
        setSelectedClient(supplier);
        setShowViewModal(true);
    };

    const handleEditClient = (supplier) => {
        setSelectedClient(supplier);
        setShowEditModal(true);
    };

    const handleHistoryClient = (supplier) => {
        setSelectedClient(supplier);
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
    
    const filteredSuppliers = suppliersData.filter(supplier => {
        const supplierValues = Object.values(supplier).join(' ').toLowerCase();
        return search
            .toLowerCase()
            .split(/\s+/) // split on any whitespace
            .every(word => supplierValues.includes(word));
    });


    const totalPages = Math.ceil(filteredSuppliers.length / recordsPerPage);
    const paginatedSuppliers = filteredSuppliers.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    const handleRefresh = () => {
      fetchSuppliers();
    };

    const handleExportCSV = () => {
        const csvContent =
            "Company Name,contact person,mobile,email,address,tpin,registration number,bank,branch,account number,swift code, sort code,\n" +
            filteredSuppliers
                .map(
                    (supplier) =>
                        `${supplier.bName},${supplier.contactPerson},${supplier.mobileNumber},${supplier.email},${supplier.physicalAddress},${supplier.tpin},${supplier.brn},${supplier.bankName},${supplier.branchName},${supplier.accountNumber},${supplier.swiftCode},${supplier.sortCode}`
                )
                .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `${institution.name} Suppliers List.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportXLSX = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredSuppliers);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Suppliers");
        XLSX.writeFile(workbook, `${institution.name} Suppliers List.xlsx`);
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
                <h3 style="margin: 0">Suppliers List</h3>
                <p> Data Filter: <strong>${search || "none"}</strong> Date Printed: <strong>${date}</strong></p>
                <table>
                    <thead>
                        <tr>
                            <th>Supplier Name</th>
                            <th>Contact Person</th>
                            <th>Address</th>
                            <th>Mobile</th>
                            <th>Email</th>
                            <th>TPIN</th>
                            <th>BRN</th>
                            <th>Bank - Branch</th>
                            <th>Account</th>
                            <th>Swift Code</th>
                            <th>Sort Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredSuppliers
                            .map(
                                (supplier) => `
                            <tr style="padding: 1px; line-height: 1; font-size: 12px;">
                                <td>${supplier.bName}</td>
                                <td>${supplier.contactPerson}</td>
                                <td>${supplier.physicalAddress}</td>
                                <td>${supplier.mobileNumber}</td>
                                <td>${supplier.email}</td>
                                <td>${supplier.tpin}</td>
                                <td>${supplier.brn}</td>
                                <td>${supplier.bankName} - ${supplier.branchName}</td>
                                <td>${supplier.accountNumber}</td>
                                <td>${supplier.swiftCode}</td>
                                <td>${supplier.sortCode}</td>
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
            <h2 className="page-title text-center mb-4 mb-3">Registered Suppliers</h2>
            <Row className="mb-3">
                <Col md={3} className="mb-3">
                    {/* Search Input */}
                    <Form.Control
                        type="text"
                        placeholder="Search suppliers..."
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

            {/* Suppliers Table */}
            <div className="table-responsive">
                <Table striped bordered hover>
                    <thead className="table-dark">
                        <tr>
                          <th>Business Name</th>
                          <th>Contact Person</th>
                          <th>Address</th>
                          <th>Mobile</th>
                          <th>Email</th>
                          <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                      {paginatedSuppliers.length === 0 && (
                        <tr className="text-center">
                          <td colSpan="6" className="text-danger">No supplier profiles found.</td>
                        </tr>
                      )}
                        {paginatedSuppliers.map((supplier, index) => (
                            <tr key={index}>
                                <td>{supplier.bName}</td>
                                <td>{supplier.contactPerson}</td>
                                <td>{supplier.physicalAddress}</td>
                                <td>{formatMobileNumber(supplier.mobileNumber)}</td>
                                <td>{supplier.email}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleViewClient(supplier)}>
                                        <FaEye size={16} />
                                    </button>
                                    <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleEditClient(supplier)}>
                                        <FaEdit size={16} />
                                    </button>
                                    {/* <button className="btn btn-sm btn-outline-primary" onClick={() => handleHistoryClient(supplier)}>
                                        <FaHistory size={16} />
                                    </button> */}
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
                <Modal.Title className="text-center">Register New Supplier</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NewSupplier />
                </Modal.Body>
            </Modal>
            
            {/* View Modal */}
            <Modal show={showViewModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="bg-primary">
                    <Modal.Title>Client Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedSupplier && (
                    <>
                      <p><strong>Supplier ID:</strong> {selectedSupplier.supplierId}</p>
                      <p><strong>Business Name:</strong> {selectedSupplier.bName}</p>
                      <p><strong>Address:</strong> {selectedSupplier.physicalAddress}</p>
                      <p><strong>Phone:</strong> {formatMobileNumber(selectedSupplier.mobileNumber)}</p>
                      <p><strong>Email:</strong> {selectedSupplier.email}</p>
                      <p><strong>TPIN:</strong> {selectedSupplier.tpin}</p>
                      <p><strong>BRN:</strong> {selectedSupplier.brn}</p>
                      <p><strong>Bank Name:</strong> {selectedSupplier.bankName}</p>
                      <p><strong>Branch:</strong> {selectedSupplier.branchName}</p>
                      <p><strong>Account Number:</strong> {selectedSupplier.accountNumber}</p>
                      <p><strong>Swift Code:</strong> {selectedSupplier.swiftCode}</p>
                      <p><strong>Sort Code:</strong> {selectedSupplier.sortCode}</p>
                    </>
                  )}
                </Modal.Body>
            </Modal>

            {/* Edit Modal */}
            <Modal size="lg" show={showEditModal} onHide={handleCloseModal} backdrop="static" keyboard={false}  >
                <Modal.Header closeButton className="bg-primary">
                    <Modal.Title>Edit Supplier Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <EditSupplier supplier={selectedSupplier} />
                </Modal.Body>
            </Modal>

            {/* History Modal */}
            <Modal size="lg" show={showHistoryModal} onHide={handleCloseModal}>
                <Modal.Header closeButton className="bg-primary">
                    <Modal.Title>Supplier Payment History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <SupplierHistory supplier={selectedSupplier} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Suppliers;
