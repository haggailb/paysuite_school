import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaPlusCircle, FaRecycle } from "react-icons/fa";
import formatDate from "../../_utils/formatDate";
import {getCurrentDate} from "../../_utils/formatCurrentDate";
import NewBankAccount from "../../components/new_components/NewBankAccount";
import { getSerials } from "../../_services/receiptServices";
import GlassLoader from "../../components/GlassLoader";
import { getUsers } from '../../_services/authServices';
import { useMessageModal } from '../../components/ModalContext';
import AsyncSelect from 'react-select/async';
import NewReceiptNumbering from "../../components/new_components/NewReceiptNumbering";
  
const ConfigureReceiptNumbering = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const { showMessageModal } = useMessageModal();
  const [showNewModal, setShowNewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serials, setSerials] = useState([]);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [users, setUsers] = useState([]);
  const [triggerUserSearch, setUserTriggerSearch] = useState(false);
  const [inputUserValue, setUserInputValue] = useState('');
  const [filters, setFilters] = useState({
    userId: 0,
    startDate: getCurrentDate('input'),
    endDate: getCurrentDate('input'),
  });
    
  const fetchUsers = async () => {
    try {
      const result = await getUsers(0); 
      setUsers(result.rows);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
    

  const loadReceipts = async () => {
    setLoading(true);
    try {
      const result = await getSerials(filters);
      const list = result.rows || [];
      setSerials(list);
      setCurrentPage(1);
    } catch (error) {
        showMessageModal({
          heading: 'Server Error!',
          message: `${error.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(error.message || 'Something went wrong.');
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
      
  useEffect(() => {
    loadReceipts();
  }, [filters]);

  const handleCloseModal = () => {
    setShowNewModal(false);
    handleRefresh();
  };
  
  const handleShowNewModal = () => setShowNewModal(true);

  const handleRefresh = async () => {
    fetchUsers();
    setFilters({
      userId: 0,
      startDate: getCurrentDate('input'),
      endDate: getCurrentDate('input'),
    });
  };

  const loadUserOptions = (inputText, callback) => {
    if (!triggerUserSearch || inputText.trim().length < 2) {
      callback([
        {
          userId: 0,
          userName: "All Cashiers",
        }
      ]);
      return;
    }

    const terms = inputText.toLowerCase().split(/\s+/);

    const filtered = users.filter(user => {
      const haystack = `${user.userName} ${user.email}`.toLowerCase();
      return terms.every(term => haystack.includes(term));
    });

    const result = [
      {
        userId: 0,
        userName: "All Cashiers",
      },
      ...filtered.slice(0, 50)
    ];

    callback(result);
    setUserTriggerSearch(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSelectChange = (field, selectedOption) => {
    setFilters((prev) => ({
      ...prev,
      [field]: selectedOption.userId
    }));
  };

  const handleUserKeyPress = (e) => {
    if (e.key === ' ') {
      setUserTriggerSearch(true);
    }
  };

  const filteredSerials = serials.filter(bankAccount =>
    Object.values(bankAccount).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredSerials.length / recordsPerPage);
  const paginatedSerials = filteredSerials.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

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
      <h2 className="page-title text-center mb-4">Receipt Number Configuration</h2>
      <Row className="mb-3">
        <Col md={2} className="mb-3 mt-4">
          <Form.Control
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col sm={6} md={6} lg={4}  xl={3} className="mb-3">
          <Form.Group className="mb-2">
            <Form.Label>Cashier Name</Form.Label>
            <AsyncSelect
              name="userId"
              cacheOptions
              defaultOptions
              loadOptions={loadUserOptions}
              getOptionLabel={(e) => `${e.userName}`}
              getOptionValue={(e) => e.userId}
              onChange={(selectedOption) => handleSelectChange("userId", selectedOption)}
              value={users.find((user) => user.userId === filters.userId) || {
                userId: 0,
                userName: "All Cashiers",
              }}
              
              placeholder="Search Cashiers..."
              onKeyDown={handleUserKeyPress}
              inputValue={inputUserValue}
              onInputChange={(value) => {
                setUserInputValue(value);
                setUserTriggerSearch(false);
              }}
            />
          </Form.Group>
        </Col>
        <Col xs={6}  md={6} lg={2} xl={2} className="mb-3">
          <Form.Group className="mb-2">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              min={2025}
              max={date}
              type="date"
              placeholder="Date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col xs={6} md={6} lg={2} xl={2} className="mb-3">
          <Form.Group className="mb-2">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              min={filters.startDate}
              max={date}
              type="date"
              placeholder="Date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col xl={3} className="mt-xl-3">
          <Button onClick={handleRefresh} variant="primary" className="me-2"><FaRecycle/> </Button>
          <Button onClick={handleShowNewModal} variant="info" className="hoverable"><FaPlusCircle/> Add </Button>
        </Col>
      </Row>
      <Table striped bordered hover className="data-table">
        <thead className="table-dark">
          <tr>
            <th>User Name</th>
            <th>Last Receipt</th>
            <th>Comment</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {paginatedSerials.length === 0 && (
            <tr className="text-center">
              <td colSpan="4" className="text-danger">No Receipts Found</td>
            </tr>
          )}
          {paginatedSerials.map((serial, index) => (
            <tr key={index}>
              <td>{serial.userName}</td>
              <td>{serial.lastReceiptNo}</td>
              <td>{serial.comment}</td>
              <td>{formatDate(serial.dateUpdated, 'short')}</td>
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
          <Modal.Title className="text-center">Register New Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <NewReceiptNumbering />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ConfigureReceiptNumbering;
