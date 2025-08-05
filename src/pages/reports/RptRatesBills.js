import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle } from "react-icons/fa";
import * as XLSX from "xlsx";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import {getCurrentDate} from "../../_utils/formatCurrentDate";
import formatCurrency from "../../_utils/formatCurrency";
import {getInstitution } from "../../_services/dataServices";
import { fetchBills } from '../../_services/bulkProcessingServices';
import GlassLoader from "../../components/GlassLoader";
import { getClients } from '../../_services/clientServices';
import { getLocations } from "../../_services/locationServices";
import { getTypes } from "../../_services/propertyTypeServices";
import { useMessageModal } from '../../components/ModalContext';

const RatesBills = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentYear = new Date().getFullYear();
  const { showMessageModal } = useMessageModal();
  const currentMonth = new Date().getMonth() + 1;
  const initialPeriod = currentMonth <= 6 ? 1 : 2;
  const [totalAmount, setTotalAmount] = useState(0);

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  let  pageTotal = 0;
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
    const result = await fetchBills(filters);
    const bills = result.rows || [];
    const total = bills.reduce((sum, bill) => {
      const amount = parseFloat(bill?.txnAmount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    setBills(bills);
    setTotalAmount(total);
    setCurrentPage(1);
    setLoading(false);
  };

  useEffect(() => {
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

  const handleChange = (name, value) => {
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
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredBills.length / recordsPerPage);
  const paginatedbills = filteredBills.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredBills);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Banks");
    XLSX.writeFile(workbook, `${institution.name} Property rates bills for ${filters.period +'-'+ filters.year}.xlsx`);
  };

const handlePrint = () => {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>${institution.name} Property Rates Bills for ${filters.period + '-' + filters.year}</title>

      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossorigin="anonymous"
      />
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; color: #000; padding: 20px; }
        img { max-height: 80px; margin-bottom: 10px; }
        h4, p { margin: 0; }
        .table th, .table td { padding: 5px; vertical-align: middle; }
        .table thead th { background-color: #000; color: #fff; }
        tfoot th { background-color: #000; color: #fff; }
        .total-row th, .total-row td { font-weight: bold; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="text-center mb-3">
          <h4>REPUBLIC OF ZAMBIA</h4>
          <img src="${institution.logo}" alt="Institution Logo" />
          <h4>${institution.name}</h4>
          <p>${institution.address}</p>
          <p><strong>Property Rates Bills</strong></p>
          <p class="mt-2">Data Filter:</p>
          <p>
            <strong>
              Search: ${search || "none"} |
              Client ID: ${filters.clientId || "none"} |
              Land Use ID: ${filters.propertyTypeId || "none"} |
              Location ID: ${filters.locationId || "none"} |
              Period: ${filters.period === 1 ? "January - June" : "July - December"} |
              Year: ${filters.year || "none"}
            </strong>
          </p>
          <p>Date Printed: <strong>${dateTime}</strong></p>
        </div>

        <table class="table table-bordered table-sm">
          <thead>
            <tr>
              <th>Stand No.</th>
              <th>Description</th>
              <th>Leaseholder</th>
              <th>Land Use</th>
              <th>Details</th>
              <th class="text-end">Bill</th>
            </tr>
          </thead>
          <tbody>
            ${filteredBills.map(bill => `
              <tr>
                <td>${bill.propertyNo}</td>
                <td>${bill.description}</td>
                <td>${bill.clientName}</td>
                <td>${bill.propertyTypeName}</td>
                <td>${bill.txnComment}</td>
                <td class="text-end">${formatCurrency(bill.txnAmount || 0, 'ZMW', false)}</td>
              </tr>`).join("")}
          </tbody>
        </table>

        <div class="container text-end total-section">
          <table class="table table-bordered">
            <tfoot>
              <tr class="total-row">
                <td colspan="5" class="text-center">Total</td>
                <td>${formatCurrency(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
          <div class="footer mt-3">
            <p>Printed By: ${userName} on ${dateTime}</p>
          </div>
        </div>
    </body>
    </html>
  `);
  doc.close();

  iframe.onload = function () {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };
};

  if (loading)  return (
    <div className="form-container mb-5 position-relative">
      <GlassLoader show={loading} />
    </div>
  );

  if (error) return <div className="text-danger text-center p-4">❌ Error: {error}</div>;

  return (
    <div className="form-container mb-5">
      <h2 className="page-title text-center mb-4">Property Rates Bills</h2>
      <Row className="mb-3">
        <Col md={3} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search bills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <div className="mb-3 justify-content-center d-flex align-items-center gap-2">
            <Button onClick={handleExportXLSX} variant="warning" className="me-2"><FaFileExcel /></Button>
            <Button onClick={handlePrint} variant="primary" className="me-2"><FaPrint/></Button>
            <Button onClick={handleRefresh} variant="primary" className="me-2"><FaRecycle/></Button>
          </div>
        </Col>
        {/* <Col md={3} className="text-end">
          <Button onClick={handleShowNewModal} variant="info" className="hoverable"><FaPlusCircle/> Add </Button>
        </Col> */}
      </Row>
      <Row>
        <Col md={3}>
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
        <Col md={3}>
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
        <Col md={3}>
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
        <Col md={2}>
          <Select
            name="period"
            value={periodOptions.find((opt) => opt.value === filters.period)}
            onChange={(selected) => handleSelectChange("period", selected.value)}
            options={periodOptions}
            placeholder="Select Period"
          />
        </Col>
        <Col md={1}>
          <Form.Control
            type="number"
            placeholder="Year"
            name="year"
            value={filters.year}
            onChange={handleChange}
          />
        </Col>
      </Row>

      <Table striped bordered hover className="data-table table">
        <thead className="table-dark">
          <tr>
            <th>Stand No.</th>
            <th>Description</th>
            <th>Leaseholder</th>
            <th>Land Use</th>
            <th>Details</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedbills.length === 0 && (
            <tr className="text-center">
              <td colSpan="6" className="text-danger">No bills found</td>
            </tr>
          )}
          {paginatedbills.map((bill, index) => (
            pageTotal += bill.txnAmount || 0,
            <tr key={index}>
              <td>{bill.propertyNo}</td>
              <td>{bill.description}</td>
              <td>{bill.clientName}</td>
              <td>{bill.propertyTypeName}</td>
              <td>{bill.txnComment}</td>
              <td className="text-end">{formatCurrency(bill.txnAmount || 0, 'ZMW', false)}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" ><FaEye /></Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot >
          <tr>
            <th colSpan="4"></th>
            <th className="table-dark">Page {currentPage} Total</th>
            <th colSpan="2"  className="table-dark"> {formatCurrency(pageTotal)}</th>
          </tr>
          <tr>
            <th colSpan="4"></th>
            <th className="table-dark">Overall Total</th>
            <th colSpan="2" className="table-dark"> {formatCurrency(totalAmount)}</th>
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

export default RatesBills;
