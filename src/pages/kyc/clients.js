import { useState, useEffect  } from "react";
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint, FaBars } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import * as XLSX from "xlsx";
import NewClient from "../../components/new_components/NewClient";
import { getInstitution } from "../../_services/dataServices";
import { updateClientField, getClients } from '../../_services/clientServices';
import GlassLoader from "../../components/GlassLoader";
import { useMessageModal } from '../../components/ModalContext';
import {getCurrentDate} from "../../_utils/formatCurrentDate";

    const date = getCurrentDate('long'); 
const Clients = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showMessageModal } = useMessageModal();

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  
  const institution = getInstitution;
  const [clientsData, setClients] = useState([]);
    const fetchClients = async () => {
      try {
        setLoading(true);
        const result = await getClients(); 
        setClients(result.rows);
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
    fetchClients();
  }, []);

    
  const handleShowNewModal = () => setShowNewModal(true);

    const handleViewClient = (client) => {
        setSelectedClient(client);
        setShowViewModal(true);
    };

    const handleEditClient = (client) => {
        setSelectedClient(client);
        setShowEditModal(true);
    };

    const handleHistoryClient = (client) => {
        setSelectedClient(client);
        setShowHistoryModal(true);
    };

    const handleCloseModal = () => {
        setShowViewModal(false);
        setShowEditModal(false);
        setShowHistoryModal(false);
        setShowNewModal(false);
          handleRefresh();
    };
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;

    const filteredClients = clientsData.filter(client => {
        const clientValues = Object.values(client).join(' ').toLowerCase();
        return search
            .toLowerCase()
            .split(/\s+/) // split on any whitespace
            .every(word => clientValues.includes(word));
    });

    const totalPages = Math.ceil(filteredClients.length / recordsPerPage);
    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * recordsPerPage,
        currentPage * recordsPerPage
    );

    const handleRefresh = () => {
      fetchClients();
    };
    
    const handleFieldUpdate = async (e, clientId, fieldName, newValue) => {
      e.preventDefault();
      setLoading(true);
        try {
          const result = await updateClientField(clientId, fieldName, newValue);
          showMessageModal({
            heading: 'Success',
            message: `${result.message || 'Update Successful'}`,
            messageType: 'success',
          });
          handleRefresh();
        } catch (err) {
            showMessageModal({
              heading: 'Server Error!',
              message: `Error: ${err.message || 'An error occured while performing update.'}`,
              messageType: 'error',
            });
        }
        setLoading(false);
    };
  
    const onFieldKeyDown = (fieldName) => (e) => {
      if (e.key === 'Enter') {
        handleFieldUpdate(e, selectedClient.clientId, fieldName, e.target.value);
      }
    };
    
    const handleExportCSV = () => {
        const csvContent =
            "First Name,Last Name,National ID,Phone,Email,Address,Business Name,Category\n" +
            filteredClients
                .map(
                    (client) =>
                        `${client.firstName},${client.lastName},${client.nationalId},${client.mobileNumber},${client.email},${client.address},${client.businessName},${client.clientCategory}`
                )
                .join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `${institution.name} Clients List.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportXLSX = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredClients);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
        XLSX.writeFile(workbook, `${institution.name} Clients List.xlsx`);
    };

    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>Clients List</title>
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
                <h3 style="margin: 0">Clients List</h3>
                <p> Data Filter: <strong>${search || "none"}</strong> Date Printed: <strong>${date}</strong></p>
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>National ID</th>
                            <th>Phone</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredClients
                            .map(
                                (client) => `
                            <tr style="padding: 1px; line-height: 1; font-size: 12px;">
                                <td>${client.firstName}</td>
                                <td>${client.lastName}</td>
                                <td>${client.nationalId}</td>
                                <td>+${client.mobileNumber}</td>
                                <td>${client.email}</td>
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
            <h2 className="page-title text-center">Clients List</h2>
            <Row>
                <Col md={3} className="mb-3">
                    {/* Search Input */}
                    <Form.Control
                        type="text"
                        placeholder="Search clients..."
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

            {/* Clients Table */}
            <div className="table-responsive">
                <Table striped bordered hover className="table" >
                  <thead className="table-dark">
                      <tr>
                          <th>Client Name</th>
                          <th>National ID</th>
                          <th>Phone</th>
                          <th>Email</th>  
                          <th>Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                    {paginatedClients.length === 0 && (
                      <tr className="text-center">
                        <td colSpan="5" className="text-danger">No client profiles found.</td>
                      </tr>
                    )}
                    {paginatedClients.map((client, index) => (
                      <tr key={index}>
                        <td>{client.firstName} {client.lastName}</td>
                        <td>{client.nationalId}</td>
                        <td>+{client.mobileNumber}</td>
                        <td>{client.email}</td>
                        <td>
                          <Dropdown as={ButtonGroup}>
                            <Button variant="outline-secondary" size="sm">
                              Actions
                            </Button>
                            <Dropdown.Toggle split variant="outline-secondary" size="sm" id={`dropdown-split-${index}`} />

                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleViewClient(client)}>
                                <FaEye className="me-2" /> View
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleEditClient(client)}>
                                <FaEdit className="me-2" /> Edit
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center">
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
                  <NewClient />
                </Modal.Body>
            </Modal>
            
            {/* View Modal */}
            <Modal show={showViewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
                <Modal.Header closeButton className="bg-primary">
                    <Modal.Title>Client Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedClient && (
                        <>
                            <p><strong>Client ID:</strong> {selectedClient.clientId}</p>
                            <p><strong>Name:</strong> {selectedClient.firstName} {selectedClient.lastName}</p>
                            <p><strong>National ID:</strong> {selectedClient.nationalId}</p>
                            <p><strong>Phone:</strong> +{selectedClient.mobileNumber}</p>
                            <p><strong>Email:</strong> {selectedClient.email}</p>
                            <p><strong>Address:</strong> {selectedClient.physicalAddress}</p>
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
                  <i className="text-success text-center">Press Enter to submit changes</i>
                    {selectedClient && (
                        <Form>
                        <Row>
                          <Col md={6}>
                            <Form.Group controlId="clientId" aria-required className="mb-3">
                                <Form.Label>Client ID</Form.Label>
                                <Form.Control
                                  type="text"
                                  defaultValue={selectedClient.clientId}
                                  disabled
                                />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="nationalId" aria-required className="mb-3">
                                <Form.Label>National ID</Form.Label>
                                <Form.Control
                                  name="nationalId"
                                  type="text"
                                  defaultValue={selectedClient.nationalId}
                                  onKeyDown={onFieldKeyDown('nationalId')}
                                  inputMode="text"
                                  enterKeyHint="enter"
                                />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <Form.Group controlId="firstName" aria-required className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                  name="firstName"
                                    type="text"
                                    onKeyDown={onFieldKeyDown('firstName')}
                                    inputMode="text"
                                    enterKeyHint="enter"
                                    defaultValue={selectedClient.firstName}
                                />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId="lastName" aria-required className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                  name="lastName"
                                  type="text"
                                  defaultValue={selectedClient.lastName}
                                  onKeyDown={onFieldKeyDown('lastName')}
                                  inputMode="text"
                                  enterKeyHint="enter"
                                />
                            </Form.Group>
                          </Col>
                        </Row>
                        
                          <Form.Group controlId="mobileNumber" aria-required className="mb-3">
                              <Form.Label>Mobile Number</Form.Label>
                              <Form.Control
                                  name="mobileNumber"
                                  type="text"
                                  defaultValue={selectedClient.mobileNumber}
                                  onKeyDown={onFieldKeyDown('mobileNumber')}
                                  inputMode="text"
                                  enterKeyHint="enter"
                              />
                          </Form.Group>
                          <Form.Group controlId="email" aria-required className="mb-3">
                              <Form.Label>Email Address</Form.Label>
                              <Form.Control
                                name="email"
                                type="email"
                                defaultValue={selectedClient.email}
                                onKeyDown={onFieldKeyDown('email')}
                                inputMode="text"
                                enterKeyHint="enter"
                              />
                          </Form.Group>
                          <Form.Group controlId="physicalAddress">
                              <Form.Label>Physical Address</Form.Label>
                              <Form.Control
                                name="physicalAddress"
                                type="text"
                                defaultValue={selectedClient.physicalAddress}
                                onKeyDown={onFieldKeyDown('physicalAddress')}
                                inputMode="text"
                                enterKeyHint="enter"
                              />
                          </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
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

export default Clients;
