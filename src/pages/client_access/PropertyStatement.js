import { useState, useEffect } from "react";
import { Dropdown, Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle, FaFilePdf, FaFileWord, FaSms } from "react-icons/fa";
import AsyncSelect from 'react-select/async';
import {getCurrentDate} from "../../_utils/formatCurrentDate";
import formatCurrency from "../../_utils/formatCurrency";
import formatDate from "../../_utils/formatDate";
import {getInstitution } from "../../_services/dataServices";
import GlassLoader from "../../components/GlassLoader";
import { getProperties } from '../../_services/propertyServices';
import { getDefaultAccount } from "../../_services/defaultAccountServices";
import { getPropertyStatement } from "../../_services/bulkProcessingServices";
import { useMessageModal } from '../../components/ModalContext';
import printPropertyStatement from "../../_documents_print/printPropertyStatement";
import savePDFPropertyStatement from "../../_documents_pdf/savePDFPropertyStatement";

const PropertyStatementClientView = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showMessageModal } = useMessageModal();
  const [transactions, setTransactions] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState({});
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState({
    bankName: "",
    bankCodeName: "",
    branchName: "",
    sortCode: "",
    swiftCode: "",
    accountName: "",
    accountNumber: "",
  });

  const [filters, setFilters] = useState({
    propertyId: 0,
    startDate: getCurrentDate('input'),
    endDate: getCurrentDate('input'),
  });

  let totalBills = 0;
  let totalReceipts = 0;
  let closingBalance = 0;

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const institution = getInstitution;
  const [properties, setProperties] = useState([]);
  
  const fetchProperties = async () => {
    try {
      const result = await getProperties(); 
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

  const fetchDefaultAccount = async () => {
    try {
      const results = await getDefaultAccount('Property Rates'); 
      setDefaultAccount({
        bankName: results.bankName,
        bankCodeName: results.bankCodeName,
        branchName: results.branchName,
        sortCode: results.sortCode,
        swiftCode: results.swiftCode,
        accountName: results.accountName,
        accountNumber: results.accountNumber,
      });
    } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(err.message || 'Something went wrong.');
    }
  };

  const loadStatement = async () => {
    setLoading(true);
    const result = await getPropertyStatement(filters);
    const list = result.rows || [];
    const property = result.property || {};
    setPropertyDetails(property);
    setTransactions(list);
    setCurrentPage(1);
    setLoading(false);
  };

  useEffect(() => {
    fetchDefaultAccount();
    fetchProperties();
    const user = JSON.parse(sessionStorage.getItem("PaySuiteUserData") || "null");
    if (user) {
      setUserName(user.userName || 'Unknown User');
    }
    const interval = setInterval(() => {
      setDate(getCurrentDate('long'));
      setTime(getCurrentDate('timeShort'));
    }, 1000);

    return () => clearInterval(interval);
  }, []); 

  useEffect(() => {
    loadStatement();
  }, [filters]);

  
  const handleRefresh = () => {
    fetchDefaultAccount();
    fetchProperties();
    loadStatement();
  };
  
  const handleKeyPress = (e) => {
    if (e.key === ' ') {
      setTriggerSearch(true);
    }
  };

  const dateTime = `${date} ${time}`;

  const loadPropertyOptions = (inputText, callback) => {
    if (!triggerSearch || inputText.trim().length < 2) {
      callback([
        {
          propertyId: 0,
          propertyNo: "All",
          firstName: "Properties",
          lastName: "",
        }
      ]);
      return;
    }

    const terms = inputText.toLowerCase().split(/\s+/);

    const filtered = properties.filter(property => {
      const haystack = `${property.propertyNo} ${property.firstName} ${property.lastName}`.toLowerCase();
      return terms.every(term => haystack.includes(term));
    });

    const result = [
        {
          propertyId: 0,
          propertyNo: "All",
          firstName: "Properties",
          lastName: "",
        },
      ...filtered.slice(0, 50)
    ];

    callback(result);
    setTriggerSearch(false);
  };

  const handleSelectChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  
  const totalPages = Math.ceil(transactions.length / recordsPerPage);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleOpenModal = (txn) => {
    setSelectedTxn(txn);
    setShowViewModal(true);
  };
  
  const handleCloseModal = () => {
    setShowViewModal(false);
    handleRefresh();
  };
  
  if (loading)  return (
    <div className="form-container mb-5 position-relative">
      <GlassLoader show={loading} />
    </div>
  );

  if (error) return <div className="text-danger text-center p-4">❌ Error: {error}</div>;

  return (
    <div className="form-container mb-5">
      <h2 className="page-title text-center mb-4">Property Rates Statements</h2>
      <Row className="mb-3">
        <Col lg={4} md={6} xl={4} className="mb-3">
          <AsyncSelect
            name="propertyId"
            cacheOptions
            defaultOptions
            loadOptions={loadPropertyOptions}
            getOptionLabel={(e) => `${e.propertyNo} - ${e.firstName} ${e.lastName}`}
            getOptionValue={(e) => e.propertyId}
            onChange={(selectedOption) => handleSelectChange("propertyId", selectedOption.propertyId)}
            value={properties.find((property) => property.propertyId === filters.propertyId) || {
              propertyId: 0,
              propertyNo: "All",
              firstName: "Properties",
              lastName: "",
            }}
            
            placeholder="Search Properties..."
            onKeyDown={handleKeyPress}
            inputValue={inputValue}
            onInputChange={(value, { action }) => {
              setInputValue(value);
              if (value.endsWith(' ')) {
                setTriggerSearch(true); 
              } else {
                setTriggerSearch(false);
              }
            }}
          />

        </Col>
        <Col xs={6} md={3} lg={4} xl={2} className="mb-3">
          <Form.Control
            min={2025}
            max={date}
            type="date"
            placeholder="Date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
          />
        </Col>
        <Col xs={6} md={3} lg={4} xl={2} className="mb-3">
          <Form.Control
            min={filters.startDate}
            max={date}
            type="date"
            placeholder="Date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
          />
        </Col>
        <Col  xl={4}>
          <div className="d-flex justify-content-end mb-3">
            <Dropdown>
              <Dropdown.Toggle variant="warning" id="dropdown-basic" className="me-2">
                  Printing and Exports
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => printPropertyStatement(institution, defaultAccount, transactions, propertyDetails, date, dateTime, userName)}><FaPrint /> Print Statement</Dropdown.Item>
                <Dropdown.Item onClick={() => savePDFPropertyStatement(institution, defaultAccount, transactions, propertyDetails, date, dateTime, userName)}><FaFilePdf className="text-danger" /> Export Statament To PDF</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button onClick={handleRefresh} variant="primary" className="me-2"><FaRecycle/> Refresh</Button>
          </div>
        </Col>
      </Row>
      <Table striped bordered hover className="mt-2 data-table table">
        <thead className="table-dark">
          <tr>
            <th>TXN ID</th>
            <th>Date</th>
            <th>Details</th>
            <th>Bill</th>
            <th>Receipt</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTransactions.length === 0 && (
            <tr className="text-center">
              <td colSpan="7" className="text-danger">No transactions found</td>
            </tr>
          )}
          {paginatedTransactions.map((txn, index) => (
            closingBalance = txn.balance,
            txn.type === 'Bill' ?
            totalBills += txn.txnAmount
            : txn.type === 'Receipt' ?
            totalReceipts += txn.txnAmount
            :null,
            <tr key={index}>
              <td>{txn.txn}</td>
              <td>{formatDate(txn.txnDate, 'short')}</td>
              <td>{txn.txnComment}</td>
              {
                txn.type === 'Bill' ? 
                <>
                  <td className="text-end">{formatCurrency(txn.txnAmount || 0, 'ZMW', false)}</td>
                  <td className="text-end"></td>
                  <td className="text-end">{formatCurrency(txn.balance || 0, 'ZMW', false)}</td>
                  <td>
                    <Button onClick={() => handleOpenModal(txn)} variant="outline-primary" size="sm" className="me-2" ><FaEye /></Button>
                  </td>
                </>
                : txn.type === 'Receipt' ? 
                <>
                  <td className="text-end"></td>
                  <td className="text-end">{formatCurrency(txn.txnAmount || 0, 'ZMW', false)}</td>
                  <td className="text-end">{formatCurrency(txn.balance || 0, 'ZMW', false)}</td>
                  <td>
                    <Button onClick={() => handleOpenModal(txn)} variant="outline-primary" size="sm" className="me-2" ><FaEye /></Button>
                  </td>
                </>
                :
                <>
                  <td className="text-end"></td>
                  <td className="text-end"></td>
                  <td className="text-end">{formatCurrency(txn.balance || 0, 'ZMW', false)}</td>
                </>
              }
            </tr>
          ))}
        </tbody>
        <tfoot >
          <tr className="table-dark">
            <th></th>
            <th colSpan={2}>Total</th>
            <th className="text-end"> {formatCurrency(totalBills, 'ZMW', true)}</th>
            <th className="text-end"> {formatCurrency(totalReceipts, 'ZMW', true)}</th>
            <th className="text-end"> {formatCurrency(closingBalance, 'ZMW', true)}</th>
            <th></th>
          </tr>
        </tfoot>
      </Table>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button variant="secondary" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button variant="secondary" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</Button>
      </div>

      <Modal show={showViewModal} onHide={handleCloseModal} backdrop="static" keyboard={false}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTxn && (
            <div>
              <hr />
              <h6 className="text-primary">Transaction Info</h6>
              <p><strong>Transaction ID:</strong> {selectedTxn.txn}</p>
              <p><strong>Transaction Type:</strong> {selectedTxn.txnType}</p>
              <p><strong>Payment Method:</strong> {selectedTxn.txnPayType || 'N/A'}</p>
              <p><strong>Amount:</strong> {formatCurrency(selectedTxn.txnAmount, "ZMW", true)}</p>
              <p><strong>Date:</strong> {formatDate(selectedTxn.txnDate, 'long')}</p>
              <p><strong>Comment:</strong> {selectedTxn.txnComment}</p>
              <p><strong>Reference:</strong> {selectedTxn.txnRef}</p>
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

export default PropertyStatementClientView;
