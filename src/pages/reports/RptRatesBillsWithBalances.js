import { useState, useEffect } from "react";
import { Dropdown, Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle, FaFilePdf, FaFileWord, FaSms } from "react-icons/fa";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import {getCurrentDate} from "../../_utils/formatCurrentDate";
import formatCurrency from "../../_utils/formatCurrency";
import formatMobileNumber from "../../_utils/formatMobileNumber";
import {getInstitution } from "../../_services/dataServices";
import { fetchBillsWithBalances } from '../../_services/bulkProcessingServices';
import GlassLoader from "../../components/GlassLoader";
import { getClients } from '../../_services/clientServices';
import { getLocations } from "../../_services/locationServices";
import { getTypes } from "../../_services/propertyTypeServices";
import { getDefaultAccount } from "../../_services/defaultAccountServices";
import { useMessageModal } from '../../components/ModalContext';
import { sendMultipleSMS } from "../../_services/sendSMS";
import printBills from '../../_documents_print/printBill';
import printBillsList from '../../_documents_print/printBillsList';
import savePDFSingBills from '../../_documents_pdf/savePDFSingleBills';
import savePDFBillsList from '../../_documents_pdf/savePDFBillsList';
import exportXLSX from "../../_documents_xlsx/billsListXLSX";
import exportBillsWord from "../../_documents_word/billsListWord"
import { isValidMobileNumber } from '../../_utils/validators';

const RatesBillsWithBalances = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentYear = new Date().getFullYear();
  const { showMessageModal } = useMessageModal();
  const currentMonth = new Date().getMonth() + 1;
  const initialPeriod = currentMonth <= 6 ? 1 : 2;
  const [totalBF, setTotalBF] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCB, setTotalCB] = useState(0);
  const [defaultAccount, setDefaultAccount] = useState({
    bankName: "",
    bankCodeName: "",
    branchName: "",
    sortCode: "",
    swiftCode: "",
    accountName: "",
    accountNumber: "",
  });

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const failed = [];
  const sent = [];

  let  pageBfTotal = 0;
  let  pageCBtoal = 0;
  let  pageABtotal = 0;
  let  pageBillTotal = 0;
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);

  const [filters, setFilters] = useState({
    clientId: 0,
    locationId: 0,
    propertyTypeId: 0,
    period: initialPeriod,
    year: currentYear
  });

  const periodOptions = [
    { label: "All Periods", value: 0 },
    { label: "January to June", value: 1 },
    { label: "July to December", value: 2 },
  ];


  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const institution = getInstitution;
  const [bills, setBills] = useState([]);
  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

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

  const fetchTypes = async () => {
    try {
      const typeResults = await getTypes(); 
      setPropertyTypes(typeResults.rows);
    } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(err.message || 'Something went wrong.');
    }
  };

  const loadBills = async () => {
    setLoading(true);
    const result = await fetchBillsWithBalances(filters);
    const bills = result.rows || [];
    const total = bills.reduce((sum, bill) => {
      const amount = parseFloat(bill?.currentBill);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    const totalBF = bills.reduce((sum, bill) => {
      const bf = parseFloat(bill?.broughtForward);
      return sum + (isNaN(bf) ? 0 : bf);
    }, 0);
    const totalCB = bills.reduce((sum, bill) => {
      const cb = parseFloat(bill?.closingBalance);
      return sum + (isNaN(cb) ? 0 : cb);
    }, 0);

    setBills(bills);
    setTotalAmount(total);
    setTotalBF(totalBF);
    setTotalCB(totalCB);
    setCurrentPage(1);
    setLoading(false);
  };

  useEffect(() => {
    fetchDefaultAccount();
    loadBills();
    fetchTypes();
    fetchLocations();
    fetchClients();
    const user = JSON.parse(sessionStorage.getItem("PaySuiteUserData") || "null");
    if (user) {
      setUserName(user.userName || 'Unknown User');
    }
      const interval = setInterval(() => {
        setDate(getCurrentDate('long'));
        setTime(getCurrentDate('timeShort'));
      }, 1000); // updates every 1 second

      return () => clearInterval(interval);
  }, []); 

  useEffect(() => {
    loadBills();
  }, [filters]);

  
  const handleRefresh = () => {
    fetchDefaultAccount();
    loadBills();
    fetchTypes();
    fetchLocations();
    fetchClients();
  };
  
const handleKeyPress = (e) => {
  if (e.key === ' ') {
    setTriggerSearch(true);
  }
};

  const dateTime = `${date} ${time}`;
const loadClientOptions = (inputText, callback) => {
  if (!triggerSearch || inputText.trim().length < 2) {
    callback([
      {
        clientId: 0,
        firstName: "All",
        lastName: "Clients",
        nationalId: "",
        mobileNumber: ""
      }
    ]);
    return;
  }

  const terms = inputText.toLowerCase().split(/\s+/);

  const filtered = clients.filter(client => {
    const haystack = `${client.firstName} ${client.lastName} ${client.nationalId} ${client.mobileNumber}`.toLowerCase();
    return terms.every(term => haystack.includes(term));
  });

  const result = [
    {
      clientId: 0,
      firstName: "All",
      lastName: "Clients",
      nationalId: "",
      mobileNumber: ""
    },
    ...filtered.slice(0, 50)
  ];

  callback(result);
  setTriggerSearch(false);
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredBills = bills.filter(bill =>
    Object.values(bill).some(value =>
      value != null && value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalBroughtForward = filteredBills.reduce((sum, bill) => sum + (bill.broughtForward || 0), 0);
  const totalCurrentBill = filteredBills.reduce((sum, bill) => sum + (bill.currentBill || 0), 0);
  const totalBalanceAfterBilling = filteredBills.reduce((sum, bill) => sum + (bill.balanceAfterBilling || 0), 0);
  const totalClosingBalance = filteredBills.reduce((sum, bill) => sum + (bill.closingBalance || 0), 0);


  const totalPages = Math.ceil(filteredBills.length / recordsPerPage);
  const paginatedbills = filteredBills.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const messageTemplate = "Dear Customer, Property Rates bill for Stand No.: ${propertyNo} is ${currentBill} with closing balance ${closingBalance}. Please settle your outstanding balance!";
 
  async function sendSmsToClients(bills, baseMessage) {
    const validClients = bills.filter(bill => bill.mobileNumber && isValidMobileNumber(bill.mobileNumber));
    const senderId = 'KTCRates';

    // Construct messages for each client
    const messages = validClients.map(client => {
      const personalizedMessage = baseMessage
        .replace("${propertyNo}", client.propertyNo || "-- error --")
        .replace("${currentBill}", formatCurrency(client.currentBill || 0, 'ZMW', false))
        .replace("${closingBalance}", formatCurrency(client.closingBalance || 0, 'ZMW', false));

      return {
        number: client.mobileNumber,
        message: personalizedMessage,
        senderId: senderId
      };
    });

    // Send messages
    const sendTasks = messages.map((messageData) => {
      return sendMultipleSMS([messageData])  // We pass an array with a single message object
        .then(response => {
          if (response && response.success) {
            sent.push(`Message successfully sent to ${messageData.number}`);
          } else {
            failed.push(`Failed to send message to ${messageData.number}: ${response.message}`);
          }
        })
        .catch(err => {
          failed.push(`Error sending to ${messageData.number}: ${err.message}`);
        });
    });

    // Wait for all SMS tasks to complete
    await Promise.all(sendTasks);

    // Output the results
    if (failed.length > 0) {
      console.error("Some messages failed to send:", failed);
    }
    if (sent.length > 0) {
      console.log("Successfully sent messages:", sent);
    }
  }


  if (loading)  return (
    <div className="form-container mb-5 position-relative">
      <GlassLoader show={loading} />
    </div>
  );

  if (error) return <div className="text-danger text-center p-4">❌ Error: {error}</div>;

  return (
    <div className="form-container mb-5">
      <h2 className="page-title text-center mb-4">Property Rates Bills With Balances</h2>
      <Row className="mb-3">
        <Col xs={8} lg={4} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search bills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col xs={8} >
          {/* Visible on small screens */}
          <div className="d-flex justify-content-end mb-3">
            <Dropdown>
              <Dropdown.Toggle variant="warning" id="dropdown-basic" className="me-2">
                  Printing and Exports
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => printBillsList(institution, filteredBills, filters, search, totalAmount, userName, dateTime)}><FaPrint /> Print Bills List</Dropdown.Item>
                <Dropdown.Item onClick={() => printBills(institution, filteredBills, defaultAccount, date, dateTime, userName)}><FaPrint /> Print Individual Bills</Dropdown.Item>
                <Dropdown.Item onClick={() => exportXLSX(institution, filteredBills, filters, search, dateTime)}><FaFileExcel className="text-success" /> Export List To Excel</Dropdown.Item>
                <Dropdown.Item onClick={() => savePDFBillsList(institution, filteredBills, dateTime, search, filters,totalBroughtForward, totalCurrentBill, totalBalanceAfterBilling, totalClosingBalance)}><FaFilePdf className="text-danger" />  Export List To PDF</Dropdown.Item>
                <Dropdown.Item onClick={() => savePDFSingBills(institution, filteredBills, defaultAccount, date, dateTime, userName, filters)}><FaFilePdf className="text-danger" /> Export Idividual Bills To PDF</Dropdown.Item>
                <Dropdown.Item onClick={() => exportBillsWord(institution, filteredBills, search, filters, dateTime)}><FaFileWord />  Export List To Word</Dropdown.Item>
                <Dropdown.Item onClick={() => sendSmsToClients(filteredBills, messageTemplate)}><FaSms /> Send SMSs To Clients</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button onClick={handleRefresh} variant="primary" className="me-2"><FaRecycle/> Refresh</Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm={6} lg={3}>
          <Form.Group className="mb-3">
            <AsyncSelect
              name="clientId"
              cacheOptions
              defaultOptions
              loadOptions={loadClientOptions}
              getOptionLabel={(e) => `${e.firstName} ${e.lastName} - ${e.nationalId} - ${e.mobileNumber}`}
              getOptionValue={(e) => e.clientId}
              onChange={(selectedOption) => handleSelectChange("clientId", selectedOption.clientId)}
              value={clients.find((client) => client.clientId === filters.clientId) || {
                clientId: 0,
                firstName: "All",
                lastName: "Clients",
                nationalId: "",
                mobileNumber: ""
              }}
              
              placeholder="Search Clients..."
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

          </Form.Group>
        </Col>
        <Col sm={6} lg={3}>
          <Form.Group className="mb-3">
            <Select
              name="propertyTypeId"
              required
              options={[{ propertyTypeId: 0, propertyTypeName: "All Types" }, ...propertyTypes]}
              getOptionLabel={(e) => e.propertyTypeName}
              getOptionValue={(e) => e.propertyTypeId}
              onChange={(selectedOption) => handleSelectChange("propertyTypeId", selectedOption.propertyTypeId)}
              value={propertyTypes.find((types) => types.propertyTypeId === filters.propertyTypeId) || { propertyTypeId: 0, propertyTypeName: "All Types" }}
              placeholder="Select Location"
            />
          </Form.Group>
        </Col>
        <Col sm={4} lg={3}>
          <Select
            name="locationId"
            required
            options={[{ locationId: 0, locationName: "All Locations" }, ...locations]}
            getOptionLabel={(e) => e.locationName}
            getOptionValue={(e) => e.locationId}
            onChange={(selectedOption) => handleSelectChange("locationId", selectedOption.locationId)}
            value={locations.find((loc) => loc.locationId === filters.locationId) || { locationId: 0, locationName: "All Locations" }}
            placeholder="Select Location"
          />
        </Col>
        <Col sm={4} lg={2}>
          <Select
            name="period"
            value={periodOptions.find((opt) => opt.value === filters.period)}
            onChange={(selected) => handleSelectChange("period", selected.value)}
            options={periodOptions}
            placeholder="Select Period"
          />
        </Col>
        <Col sm={4} lg={1}>
          <Form.Control
            min={2025}
            max={currentYear}
            type="number"
            placeholder="Year"
            name="year"
            value={filters.year}
            onChange={handleChange}
          />
        </Col>
      </Row>

      <Table striped bordered hover className="mt-2 data-table table">
        <thead className="table-dark">
          <tr>
            <th>Stand No.</th>
            <th>Leaseholder</th>
            <th>Land Use</th>
            <th>Details</th>
            <th>B/F</th>
            <th>Bill</th>
            <th>Balance</th>
            <th>C/B</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedbills.length === 0 && (
            <tr className="text-center">
              <td colSpan="8" className="text-danger">No bills found</td>
            </tr>
          )}
          {paginatedbills.map((bill, index) => (
            pageBfTotal += bill.broughtForward || 0,
            pageBillTotal += bill.currentBill || 0,
            pageABtotal += bill.balanceAfterBilling || 0,
            pageCBtoal += bill.closingBalance || 0,
            <tr key={index}>
              <td>{bill.propertyNo}</td>
              <td>{bill.clientName}</td>
              <td>{bill.propertyTypeName}</td>
              <td>{bill.txnComment}</td>
              <td className="text-end">{formatCurrency(bill.broughtForward || 0, 'ZMW', false)}</td>
              <td className="text-end">{formatCurrency(bill.currentBill || 0, 'ZMW', false)}</td>
              <td className="text-end">{formatCurrency(bill.balanceAfterBilling || 0, 'ZMW', false)}</td>
              <td className="text-end">{formatCurrency(bill.closingBalance || 0, 'ZMW', false)}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" ><FaEye /></Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot >
          <tr>
            <th colSpan="3"></th>
            <th className="table-dark">Page {currentPage} Total</th>
            <th className="table-dark"> {formatCurrency(pageBfTotal)}</th>
            <th className="table-dark"> {formatCurrency(pageBillTotal)}</th>
            <th className="table-dark"> {formatCurrency(pageABtotal)}</th>
            <th colSpan="2"  className="table-dark"> {formatCurrency(pageCBtoal)}</th>
          </tr>
          <tr>
            <th colSpan="3"></th>
            <th className="table-dark">Overall Total</th>
            <th className="table-dark"> {formatCurrency(totalBF)}</th>
            <th className="table-dark"> {formatCurrency(totalAmount)}</th>
            <th className="table-dark"> {formatCurrency(totalAmount)}</th>
            <th colSpan="2" className="table-dark"> {formatCurrency(totalCB)}</th>
          </tr>
        </tfoot>
      </Table>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button variant="secondary" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button variant="secondary" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</Button>
      </div>
      
    </div>
  );
};

export default RatesBillsWithBalances;
