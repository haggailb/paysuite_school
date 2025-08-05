import { useState, useEffect } from "react";
import { Dropdown, ButtonGroup, Button, Table, Form, Row, Col, Modal, Card } from "react-bootstrap";
import { FaEye, FaEdit, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle, FaHistory, FaReceipt, FaFilePdf, FaFileWord, FaSms } from "react-icons/fa";
import * as XLSX from "xlsx";
import Select from "react-select"
import AsyncSelect from 'react-select/async';
import {getCurrentDate} from "../../_utils/formatCurrentDate";
import formatCurrency from "../../_utils/formatCurrency";
import formatMobileNumber from "../../_utils/formatMobileNumber"
import { getInstitution } from "../../_services/dataServices";
import { getProperties } from '../../_services/propertyServices';
import GlassLoader from "../../components/GlassLoader";
import { useMessageModal } from '../../components/ModalContext';
import { getClients } from '../../_services/clientServices';
import { getLocations } from "../../_services/locationServices";
import { getLeases } from "../../_services/leaseServices";
import formatDate from "../../_utils/formatDate";
import NewLease from "../../components/new_components/NewLease";
import { terminateLease } from "../../_services/leaseServices";
  
  const date = getCurrentDate('long'); 

const PropertyLeases = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showMessageModal } = useMessageModal();

  const [inputValue, setInputValue] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === ' ') {
      setTriggerSearch(true);
    }
  };

  const loadClientOptions = (inputText, callback) => {
    if (!triggerSearch || inputText.trim().length < 2) {
      callback([]);
      return;
    }

    const terms = inputText.toLowerCase().split(/\s+/);

    const filtered = clients.filter(client => {
      const haystack = `${client.firstName} ${client.lastName} ${client.nationalId} ${client.mobileNumber}`.toLowerCase();
      return terms.every(term => haystack.includes(term));
    });

    callback(filtered.slice(0, 50)); // limit results to prevent UI overload
    setTriggerSearch(false);
  };

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  
  const institution = getInstitution;
  const [properties, setProperties] = useState([]);
  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const trueFalse = {choice: "True", choice:'False'};
  const [leases, setLeases] = useState([]);

  const fetchLeases = async (leaseState) => {
    try {
      const result = await getLeases(leaseState); 
      setLeases(result.rows);
    } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(err.message || 'Something went wrong.');
    } 
  };

  const fetchProperties = async () => {
    try {
      const result = await getProperties('rentals'); 
      setProperties(result.rows);
    } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(err.message || 'Something went wrong.');
    } 
  };

  const fetchClients = async () => {
    try {
      const clientResults = await getClients(); 
      setClients(clientResults.rows);
    } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(err.message || 'Something went wrong.');
    }
  };

  const fetchLocations = async () => {
    try {
      const locationResults = await getLocations(); 
      setLocations(locationResults.rows);
    } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(err.message || 'Something went wrong.');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchLeases(1);
    fetchClients();
    fetchLocations();
    fetchProperties();
    setLoading(false);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchLeases(1);
    fetchClients();
    fetchLocations();
    fetchProperties();
    setLoading(false);
  };

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLease, setSelectedLease] = useState(null);

  const handleOpenModal = (lease, modalType) => {
    setSelectedLease(lease);
    if (modalType === "terminate") setShowTerminateModal(true);
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
    setShowTerminateModal(false);
    setSelectedLease(null);
    handleRefresh();
  };
  
  const handleShowNewModal = () => setShowNewModal(true);


  const filteredLeases = leases.filter(lease => {
      const propertyValues = Object.values(lease).join(' ').toLowerCase();
      return search
          .toLowerCase()
          .split(/\s+/) // split on any whitespace
          .every(word => propertyValues.includes(word));
  });
  
  const totalPages = Math.ceil(filteredLeases.length / recordsPerPage);
  const paginatedLeases = filteredLeases.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleTerminate = async () => {
    try {
      const result = terminateLease(selectedLease.leaseId);
      showMessageModal({
        heading: 'Success!',
        message: `Lease terminated successfully`,
        messageType: 'success',
      });
    } catch (error) {
      showMessageModal({
        heading: 'Error!',
        message: `${error.message}`,
        messageType: 'error',
      });
      console.error("❌ Error perform log out: ", error.message);
    }
  };
  
  if (loading)  return (
    <div className="form-container mb-5 position-relative">
      <GlassLoader show={loading} />
    </div>
  );

  if (error) return <div className="text-danger text-center p-4">❌ Error: {error}</div>;

  return (
    <div className="form-container mb-5">
      <h2 className="page-title text-center mb-4">Property Lease Agreements</h2>
      <Row className="">
        <Col sm={4} lg={4} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search lease..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col sm={8} >
          {/* Visible on small screens */}
          <div className="d-flex justify-content-end mb-3">
            <Dropdown>
              <Dropdown.Toggle variant="warning" id="dropdown-basic" className="me-2">
                  Printing and Exports
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => {}}><FaPrint /> Print List</Dropdown.Item>
                <Dropdown.Item onClick={() => {}}><FaFileExcel className="text-success" /> Export List To Excel</Dropdown.Item>
                <Dropdown.Item onClick={() => {}}><FaFilePdf className="text-danger" />  Export List To PDF</Dropdown.Item>
                <Dropdown.Item onClick={() => {}}><FaFileWord />  Export List To Word</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button onClick={handleRefresh} variant="primary" className="me-2"><FaRecycle/> Refresh</Button>
            <Button onClick={handleShowNewModal} variant="info" className="hoverable"><FaPlusCircle/> Add </Button>
          </div>
        </Col>
      </Row>
      <Table striped bordered hover className="data-table table">
        <thead className="table-dark">
          <tr>
            <th>Stand No.</th>
            <th>Description</th>
            <th>Client Name </th>
            <th>Payment Freq. </th>
            <th>Lease Amount </th>
            <th>Balance </th>
            <th>Lease Expiry </th>
            <th>Actions </th>
          </tr>
        </thead>
        <tbody>
          {paginatedLeases.length === 0 && (
            <tr className="text-center">
              <td colSpan="10" className="text-danger">No property leases agreements found.</td>
            </tr>
          )}
          {paginatedLeases.map((lease, index) => (
            <tr key={index}>
              <td>{lease.propertyNo}</td>
              <td>{lease.description}</td>
              <td>{lease.clientName}</td>
              <td>{lease.billing}</td>
              <td>{formatCurrency(lease.lease_amount, 'ZMW', true)}</td>
              <td>{formatCurrency(0, 'ZMW', true)}</td>
              <td>{formatDate(lease.expiry_date, 'short')}</td>
              <td>
                <Dropdown as={ButtonGroup} className="text-white">
                  <Button variant="outline-secondary" size="sm">
                    Actions
                  </Button>
                  <Dropdown.Toggle split variant="outline-secondary" size="sm" id={`dropdown-split-${index}`} />
                  <Dropdown.Menu>
                    <h6 className="text-white mb-0 text-center">{lease.propertyNo}</h6>
                    <Dropdown.Item onClick={() => handleOpenModal(lease, 'terminate')}>
                      <FaBan className="me-2 text-danger" /> Terminate
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleOpenModal(lease, "view")}>
                      <FaEye className="me-2" /> View
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
          <Modal.Title className="text-center">New Lease Agreement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <NewLease />
        </Modal.Body>
      </Modal>

      <Modal show={showTerminateModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-danger">
          <Modal.Title className="text-center text-white">Terminate Lease</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Card>
            <Card.Header>
              <h2 className="text-danger">Are you sure you want to terminate this lease for <br></br> { selectedLease ? selectedLease.clientName : null}? </h2>
            </Card.Header>
              <Card.Body>
                <Row>
                  <Col xs={6}>
                    <Button className="w-100" variant="secondary" onClick={handleCloseModal}>No</Button>
                  </Col> 
                  <Col xs={6}>
                    <Button className="w-100 bg-danger" variant="secondary" onClick={handleTerminate}>Yes</Button>
                  </Col> 
                </Row>
              </Card.Body>
          </Card> 
        </Modal.Body>
      </Modal>

      {/* View bank Modal */}
      <Modal size="lg" show={showViewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary">
          <Modal.Title>Property Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLease && (
            <>
              <Row>
                <Col md={6}>
                  <div className="border p-2">
                    <h4 className="page-title">Client Details</h4>
                    <p><strong>Property ID:</strong> {selectedLease.clientId}</p>
                    <p><strong>Property ID:</strong> {selectedLease.nationalId}</p>
                    <p><strong>Stand No. :</strong> {selectedLease.clientName}</p>
                    <p><strong>Description :</strong> {formatMobileNumber(selectedLease.mobileNumber)}</p>
                    <p><strong>Property Type :</strong> {selectedLease.email}</p>
                    <p><strong>Location :</strong> {selectedLease.physicalAddress}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="border p-2">
                    <h4 className="page-title">Property Details</h4>
                    <p><strong>Stand Number:</strong> {selectedLease.propertyNo}</p>
                    <p><strong>Size (Square Meters):</strong> {selectedLease.land_extent}</p>
                    <p><strong>Location:</strong> {selectedLease.locationName}</p>
                    <p><strong>Zone:</strong> {selectedLease.zoneName}</p>
                  </div>
                </Col>
              </Row>
              <hr></hr>
              <div>
                <h4 className="page-title">Lease Details</h4>
                <p><strong>Start Date:</strong> {formatDate(selectedLease.lease_date, 'short')}</p>
                <p><strong>Expiry Date:</strong> {formatDate(selectedLease.expiry_date, 'short')}</p>
                <p><strong>Lease Amount:</strong> {formatCurrency(selectedLease.lease_amount, 'ZMW', true)}</p>
                <p><strong>Billing Frequency:</strong> {selectedLease.billing}</p>
                <p><strong>Other Conditions:</strong> {selectedLease.conditions}</p>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PropertyLeases;
