import { useState, useEffect } from "react";
import { Dropdown, Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle, FaFilePdf, FaFileWord, FaSms, FaFunnelDollar } from "react-icons/fa";
import AsyncSelect from 'react-select/async';
import {getCurrentDate} from "../../_utils/formatCurrentDate";
import formatCurrency from "../../_utils/formatCurrency";
import formatDate from "../../_utils/formatDate";
import {getInstitution } from "../../_services/dataServices";
import GlassLoader from "../../components/GlassLoader";
import { getReceipts, getReceipt } from "../../_services/receiptServices";
import { useMessageModal } from '../../components/ModalContext';
import { getAllCOAs } from '../../_services/coaServices';
import { getUsers } from '../../_services/authServices';
import printBillableReceipt from "../../_documents_print/printBillableReceipt";
import { getProperty } from "../../_services/propertyServices";
import printReceiptsList from "../../_documents_print/printReceiptsList";
import exportReceiptToExcel from "../../_documents_xlsx/receiptsListXLSX";
import exportReceiptsToPDF from "../../_documents_pdf/exportReceiptsToPDF";
import '../../components/styles/filters-dropdown.css';

const ReceiptsLedger = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showMessageModal } = useMessageModal();
  const [receipts, setReceipts] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const [filters, setFilters] = useState({
    coaId: 0,
    userId: 0,
    coaCode:'',
    userName:'',
    startDate: getCurrentDate('input'),
    endDate: getCurrentDate('input'),
  });

  let totalBills = 0;
  let totalReceipts = 0;

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const [inputValue, setInputValue] = useState('');
  const [inputUserValue, setUserInputValue] = useState('');
  const [userName, setUserName] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [triggerUserSearch, setUserTriggerSearch] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const institution = getInstitution;
  const [coaList, setCoas] = useState([]);
  const [users, setUsers] = useState([]);
  
  const fetchCOAs = async () => {
    try {
      const result = await getAllCOAs(1);
      setCoas(result.rows);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  
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
      const result = await getReceipts(filters);
      const list = result.rows || [];
      setReceipts(list);
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
    fetchCOAs();
    fetchUsers();
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
    loadReceipts();
  }, [filters]);

  
  const handleRefresh = () => {
    fetchCOAs();
    fetchUsers();
    loadReceipts();
    setFilters({
      coaId: 0,
      userId: 0,
      coaCode:'',
      userName:'',
      startDate: getCurrentDate('input'),
      endDate: getCurrentDate('input'),
    });
  };
  
  const handleKeyPress = (e) => {
    if (e.key === ' ') {
      setTriggerSearch(true);
    }
  };

  const handleUserKeyPress = (e) => {
    if (e.key === ' ') {
      setUserTriggerSearch(true);
    }
  };

  const dateTime = `${date} ${time}`;

  const LoadAccountOptions = (inputText, callback) => {
    if (!triggerSearch || inputText.trim().length < 2) {
      callback([
        {
          coaId: 0,
          coaCode: 0,
          coaName: "All Accounts",
        }
      ]);
      return;
    }

    const terms = inputText.toLowerCase().split(/\s+/);

    const filtered = coaList.filter(coa => {
      const haystack = `${coa.coaCode} ${coa.coaName}`.toLowerCase();
      return terms.every(term => haystack.includes(term));
    });

    const result = [
      {
        coaId: 0,
        coaCode: 0,
        coaName: "All Accounts",
      },
      ...filtered.slice(0, 50)
    ];

    callback(result);
    setTriggerSearch(false);
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

  const handleSelectChange = (field, selectedOption) => {
    if (field === 'coaId') {
      setFilters((prev) => ({
        ...prev,
        [field]: selectedOption.coaId, 'coaCode': `${selectedOption.coaCode} - ${selectedOption.coaName}`
      }));
    }else if (field === 'userId'){
      setFilters((prev) => ({
        ...prev,
        [field]: selectedOption.userId, 'userName': selectedOption.userName
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  
  const totalPages = Math.ceil(receipts.length / recordsPerPage);
  const paginatedReceipts = receipts.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleOpenModal = (txn) => {
    setSelectedTxn(txn);
    setShowViewModal(true);
  };
  
  const handleCloseModal = () => {
    setShowViewModal(false);
    // selectedTxn(null);
  };
  
  const handlePrintReceipt = async (receiptNo) => {
    try {
      const result = await getReceipt(receiptNo); 
      if (!result.success) {
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${result.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
        return;
      }
      
      if (result.receipt.propertyId) {
        const property = await getProperty(result.receipt.propertyId); 
        printBillableReceipt(result.receipt, property, institution)
      }
    } catch (err) {
      showMessageModal({
        heading: 'Server Error!',
        message: `Error: ${err.message || 'Something went wrong.'}`,
        messageType: 'error',
      });
    }
  };

  if (loading)  return (
    <div className="form-container mb-5 position-relative">
      <GlassLoader show={loading} />
    </div>
  );

  if (error) return <div className="text-danger text-center p-4">❌ Error: {error}</div>;

  return (
    <div className="form-container">
      <h2 className="page-title text-center mb-4">Receipts Ledger</h2>
      <Row className="mb-3">
        <Col sm={6} md={6} lg={4} xl={3} className="mb-3">
          <Form.Group>
            <Form.Label>Item</Form.Label>
            <AsyncSelect
              name="coaId"
              cacheOptions
              defaultOptions
              loadOptions={LoadAccountOptions}
              getOptionLabel={(e) => `${e.coaCode} - ${e.coaName}`}
              getOptionValue={(e) => e.coaId}
              onChange={(selectedOption) => handleSelectChange("coaId", selectedOption)}
              value={coaList.find((coa) => coa.coaId === filters.coaId) || 
                {
                  coaId: 0,
                  coaCode: 0,
                  coaName: "All Accounts",
                }}
              placeholder="Search Accounts..."
              onKeyDown={handleKeyPress}
              inputValue={inputValue}
              onInputChange={(value) => {
                setInputValue(value);
                setTriggerSearch(false);
              }}
            />
          </Form.Group>
        </Col>
        <Col sm={6} md={6} lg={4}  xl={2} className="mb-3">
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
          <div className="d-flex justify-content-end mb-3">
            <Button onClick={handleRefresh} variant="primary" className="me-2"><FaRecycle/> </Button>
            <Dropdown>
              <Dropdown.Toggle variant="warning" id="dropdown-basic" className="me-2">
                  Printing and Exports
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => printReceiptsList(institution, paginatedReceipts, filters, totalReceipts, userName, dateTime ) }><FaPrint /> Print Ledger</Dropdown.Item>
                <Dropdown.Item onClick={() => exportReceiptsToPDF(institution, paginatedReceipts, filters, totalReceipts, dateTime, userName)}><FaFilePdf className="text-danger" /> Export Ledger To PDF</Dropdown.Item>
                <Dropdown.Item onClick={() => exportReceiptToExcel(institution, paginatedReceipts, filters, dateTime) }><FaFileExcel className="text-success" /> Export List To Excel</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>
      </Row>
      <Table striped bordered hover className="mt-2 data-table table">
        <thead className="table-dark">
          <tr>
            <th>Receipt No.</th>
            <th>Date</th>
            <th>Client Name</th>
            <th>Details</th>
            <th>Account</th>
            <th>Due</th>
            <th>Amount</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedReceipts.length === 0 && (
            <tr className="text-center">
              <td colSpan="8" className="text-danger">No receipts found</td>
            </tr>
          )}
          {paginatedReceipts.map((txn, index) => (
            totalReceipts += txn.txnAmount,
            <tr key={index}>
              <td>{txn.receiptNo}</td>
              <td>{formatDate(txn.txnDate, 'short')}</td>
              <td>{txn.clientName}</td>
              <td>{txn.txnComment}</td>
              <td>{txn.coaCode} - {txn.coaName}</td>
              { txn.amountDue < 0 ? 
                <td className="text-end bg-success">( {formatCurrency(txn.amountDue *-1 || 0, 'ZMW', true)} )</td>
                :
                <td className="text-end">{formatCurrency(txn.amountDue || 0, 'ZMW', true)}</td>
              }
              <td className="text-end">{formatCurrency(txn.txnAmount || 0, 'ZMW', true)}</td>
              { txn.balance < 0 ? 
                <td className="text-end bg-success">( {formatCurrency(txn.balance *-1 || 0, 'ZMW', true)} )</td>
                :
                <td className="text-end">{formatCurrency(txn.balance || 0, 'ZMW', true)}</td>
              }
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="warning" id="dropdown-basic" className="me-2">
                      Actions
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleOpenModal(txn)} variant="outline-primary" size="sm" className="me-2" ><FaEye /> View Details</Dropdown.Item>
                    <Dropdown.Item onClick={() => handlePrintReceipt(txn.receiptNo)} variant="outline-primary" size="sm" className="me-2" ><FaPrint /> Print Receipt</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot >
          <tr>
            <th colSpan={4} ></th>
            <th colSpan={2} className="text-end table-dark">Total</th>
            <th className="text-end table-dark"> {formatCurrency(totalReceipts, 'ZMW', true)}</th>
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
          <Modal.Title>Receipt Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTxn && (
            <div>
              <h6 className="text-primary">Client Info</h6>
              <p className="my-0"><strong>Client ID:</strong> {selectedTxn.clientId}</p>
              <p className="my-0"><strong>Client Name:</strong> {selectedTxn.clientName}</p>
              <p className="my-0"><strong>National ID:</strong> {selectedTxn.nationalId}</p>
              <p className="my-0"><strong>Contact:</strong> {selectedTxn.mobileNumber}</p>
              <p className="my-0"><strong>Email:</strong> {selectedTxn.email}</p>
              <p className="my-0"><strong>Physical Address:</strong> {selectedTxn.physicalAddress}</p>
              <hr />
              <h6 className="text-primary">Transaction Info</h6>
              <p className="my-0"><strong>Transaction ID:</strong> {selectedTxn.txn}</p>
              <p className="my-0"><strong>Receipt Number:</strong> {selectedTxn.receiptNo}</p>
              <p className="my-0"><strong>Account:</strong> {selectedTxn.coaCode} - {selectedTxn.coaName}</p>
              <p className="my-0"><strong>Details:</strong> {selectedTxn.txnComment}</p>
              <p className="my-0"><strong>Reference:</strong> {selectedTxn.txnRef}</p>
              <p className="my-0"><strong>Date:</strong> {formatDate(selectedTxn.txnDate, 'short')}</p>
              <hr />
              <h6 className="text-primary">Payment Info</h6>
              <p className="my-0"><strong>Payment Method:</strong> {selectedTxn.txnPayType}</p>
              <p className="my-0"><strong>Amount Due:</strong> {formatCurrency(selectedTxn.amountDue, "ZMW", true)}</p>
              <p className="my-0"><strong>Amount Paid:</strong> {formatCurrency(selectedTxn.txnAmount, "ZMW", true)}</p>
              <p className="my-0"><strong>Closing Balance:</strong> {formatCurrency(selectedTxn.balance, "ZMW", true)}</p>
              <p className="my-0"><strong>Bank Name:</strong> {selectedTxn.bankName} - {selectedTxn.branchName}</p>
              <p className="my-0"><strong>Account Name:</strong> {selectedTxn.accountName}</p>
              <hr />
              <h6 className="text-primary">User Info</h6>
              <p className="my-0"><strong>User ID:</strong> {selectedTxn.userId}</p>
              <p className="my-0"><strong>User Name:</strong> {selectedTxn.userName}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default ReceiptsLedger;
