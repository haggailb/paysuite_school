import { useState, useEffect  } from "react";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaRecycle, FaFileCsv, FaFileExcel, FaPrint } from "react-icons/fa";
import * as XLSX from "xlsx";
import { getInstitution, getClients } from "../../_services/dataServices";
import Select from "react-select"
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getCurrentDate } from '../../_utils/formatCurrentDate';
import formatCurrency from "../../_utils/formatCurrency";
import formatDate from "../../_utils/formatDate";
import { getGroupedCashbookTransactions } from "../../_services/transactionServices";
import GlassLoader from "../../components/GlassLoader";

const CashbookSummary = () => {
    
  const navigate = useNavigate();
  const institution = getInstitution;
  const [clientsData, setClients] = useState([]);
  
  let date = getCurrentDate('long'); 
  const [dateFrom, setDateFrom] = useState(getCurrentDate('input'));
  const [dateTo, setDateTo] = useState(getCurrentDate('input'));

  const maxDate = getCurrentDate('input');
  
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]);
  

  const location = useLocation();
  const { accountKey } = useParams();
  const { accountId, accountName, accountNumber, bankName, branchName, balance, currency } = location.state || {};

  useEffect(() => {
    if (accountId && dateFrom && dateTo) {
      handleRefresh();
    }
  }, [dateFrom, dateTo]); 

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const result = await getGroupedCashbookTransactions(accountId, dateFrom, dateTo);
      setTransactions(result);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };
  
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  
  const filteredTransactions = transactions.filter(transaction =>
    Object.values(transaction).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredTransactions.length / recordsPerPage);
  const paginagedTransactions = filteredTransactions.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleExportCSV = () => {
    const csvContent =
      "Bank Name,Branch Code,Brank Name,Account Name,Account Number,Estimated Balance\n" +
      filteredTransactions
        .map(
          (account) =>
            `${account.bankName},${account.branchCode},${account.branchName},${account.accountName},${account.accountNumber},${account.balanceEstimate}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${accountName} Cashbook.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportXLSX = () => {
    const title = [[`${institution.name}`], [`${accountName} Cashbook Report`], [`Date Range: ${dateFrom} to ${dateTo}`], []];
    const dataSheet = XLSX.utils.json_to_sheet(filteredTransactions, { origin: -1 });
    const worksheet = XLSX.utils.aoa_to_sheet(title);
    XLSX.utils.sheet_add_json(worksheet, filteredTransactions, { origin: -1 });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cashbook");
    XLSX.writeFile(workbook, `${accountName} Cashbook.xlsx`);
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
          <h2>${institution.name}</h2>
          <h3>${institution.address}</h3>
          <h3>Cashbook Summary</h3>
          <table>
              <thead>
                  <tr>
                      <th>Account Code</th>
                      <th>Account Name</th>
                      <th>Budgeted</th>
                      <th>Actual</th>
                      <th>Balance</th>
                  </tr>
              </thead>
              <tbody>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                      
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

  if (error) return (
  <div className="form-container mb-5 position-relative">
    <div className="text-danger text-center p-4">❌ Error: {error}</div>
  </div>
  );

    return (
      <div className="form-container mb-5">
        <h2 className="page-title text-center">Cashbook Summary<br></br> <small>( { accountName } )</small></h2>
        <p className="text-center">ACC: {accountNumber} | Bank : {bankName} - { branchName}</p>
        <Row className="mb-3">
          <Col xs={12} md={6} lg={3} className="mb-3">
            <Row>
              <Col xs={6} className="mb-3">
                <Form.Control
                  name="dateFrom"
                  type="date"
                  placeholder="Select Date"
                  className="my-2"
                  value={dateFrom}
                  onChange={(e) => {setDateFrom(e.target.value);}}
                  max={maxDate}
                />
              </Col>
              <Col xs={6} className="mb-3">
                <Form.Control
                  name="dateTo"
                  type="date"
                  placeholder="Select Date"
                  className="my-2"
                  value={dateTo}
                  onChange={(e) => {setDateTo(e.target.value); handleRefresh();}}
                  max={maxDate}
                />
              </Col>
            </Row>
          </Col>
          <Col md={6}>
            <div className="mb-3 justify-content-center d-flex align-items-center gap-2">
              <Button onClick={handleExportCSV} variant="success" className="me-2"><FaFileCsv /></Button>
              <Button onClick={handleExportXLSX} variant="warning" className="me-2"><FaFileExcel /></Button>
              <Button onClick={handlePrint} variant="primary" className="me-2"><FaPrint/></Button>
              <Button onClick={handleRefresh} className="me-2 outline-primary"><FaRecycle/></Button>
              <Button variant="secondary" onClick={handleClose} className="outline-primary me-2">Close</Button>
            
            </div>
          </Col>
        </Row>

        {/* Clients Table */}
        <div className="table-responsive">
            <Table striped bordered hover>
                <thead className="table-dark">
                    <tr>
                        <th>Account Code</th>
                        <th>Account Name</th>
                        <th>Budgeted</th>
                        <th>Actual</th>
                        <th>Balance</th>
                    </tr>
                </thead>
                <tbody>
                  {paginagedTransactions.length === 0 && (
                    <tr className="text-center">
                      <td colSpan="5" className="text-danger">No transactions found for the selected date range.</td>
                    </tr>
                  )}
                  {paginagedTransactions.map((txn, index) => (
                    <tr
                      key={index}
                      className={String(txn.coaCode).startsWith('1') ? '' : 'table-warning'}
                    >
                      <td>{txn.coaCode}</td>
                      <td>{txn.coaName}</td>
                      <td>{formatCurrency(txn.budgeted || 0, "ZMW", true)}</td>
                      <td>{formatCurrency(txn.achieved || 0, "ZMW", true)}</td>
                      {txn.balance < 0 ? (
                        <td className="text-danger">( {formatCurrency(txn.balance * -1 || 0, "ZMW", true)} )</td>
                      ) : (
                        <td>{formatCurrency(txn.balance || 0, "ZMW", true)}</td>
                      )}
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
    </div>
  );
};

export default CashbookSummary;
