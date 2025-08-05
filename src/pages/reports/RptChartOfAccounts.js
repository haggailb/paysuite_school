import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle } from "react-icons/fa";
import * as XLSX from "xlsx";
import {getCurrentDate} from "../../_utils/formatCurrentDate";
import formatCurrency from "../../_utils/formatCurrency";
import {getInstitution } from "../../_services/dataServices";
import { getAllCOAs } from '../../_services/coaServices';
import GlassLoader from "../../components/GlassLoader";
import { useParams, useLocation  } from "react-router-dom";

const date = getCurrentDate('long'); 
// const today = <CurrentDate format="long" />;

const ChartOfAccounts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  let coaType = null;
  
  const location = useLocation();
  const { accountType } = useParams();

  if (accountType === "income") {coaType = 1} else
  if (accountType === "expenditure") {coaType = 2} else
  {setError("Invalid account type");}

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const institution = getInstitution;
  const [coaList, setCoas] = useState([]);

  useEffect(() => {
    const fetchCOAs = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      let type = null;
      if (accountType === "income") type = 1;
      else if (accountType === "expenditure") type = 2;
      else {
        setError("Invalid account type");
        setLoading(false);
        return;
      }
  
      try {
        const result = await getAllCOAs(type);
        setCoas(result.rows);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCOAs();
  }, [accountType]); // 👈 will re-run when accountType changes
  
  const [selectedCOA, setselectedCOA] = useState(null);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
  
      let type = null;
      if (accountType === "income") type = 1;
      else if (accountType === "expenditure") type = 2;
      else {
        setError("Invalid account type");
        setLoading(false);
        return;
      }
  
      const result = await getAllCOAs(type);
      setCoas(result.rows); 
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  
  
  const filteredCOAs = coaList.filter(coa =>
    Object.values(coa).some(value =>
      value.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredCOAs.length / recordsPerPage);
  const paginatedCOAs = filteredCOAs.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handleExportCSV = () => {
    const csvContent =
      "Bank ID,Bank Name,Bank Code Name\n" +
      filteredCOAs
        .map(
          (coa) =>
            `${coa.coaId},${coa.coaName},${coa.coaCodeName}`
        )
        .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${institution.name} Registered Banks.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredCOAs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Banks");
    XLSX.writeFile(workbook, `${institution.name} Registered Banks.xlsx`);
  };

    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
            <head>
                <title>${institution.name} Registered Banks</title>
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
                <h3 style="margin: 0">Chart of Account (${accountType})</h3>
                <p> Data Filter: <strong>${search || "none"}</strong> Date Printed: <strong>${date}</strong></p>
                <table>
                    <thead>
                        <tr>
                          <th>Code</th>
                          <th>Account Name</th>
                          <th>Budgeted</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredCOAs
                            .map(
                                (coa) => `
                            <tr style="padding: 1px; line-height: 1; font-size: 12px;">
                              <td>${coa.coaCode}</td>
                              <td>${coa.coaName}</td>
                              <td>${formatCurrency(coa.coaEstimate || 0)}</td>
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
      <h2 className="page-title text-center mb-4">Chart of Account <br></br><small>( {accountType })</small> </h2>
      <Row className="mb-3">
        <Col md={3} className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search Accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <div className="mb-3 justify-content-center d-flex align-items-center gap-2">
            <Button onClick={handleExportCSV} variant="success" className="me-2"><FaFileCsv /></Button>
            <Button onClick={handleExportXLSX} variant="warning" className="me-2"><FaFileExcel /></Button>
            <Button onClick={handlePrint} variant="primary" className="me-2"><FaPrint/></Button>
            <Button onClick={handleRefresh} variant="primary" className="me-2"><FaRecycle/></Button>
          </div>
        </Col>
        {/* <Col md={3} className="text-end">
          <Button onClick={handleShowNewModal} variant="info" className="hoverable"><FaPlusCircle/> Add </Button>
        </Col> */}
      </Row>
      <Table striped bordered hover className="data-table">
        <thead className="table-dark">
          <tr>
            {/* <th>Group Code</th>
            <th>Sub-group</th> */}
            <th>Code</th>
            <th>Account Name</th>
            <th>Budgeted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCOAs.length === 0 && (
            <tr className="text-center">
              <td colSpan="4" className="text-danger">No accounts found</td>
            </tr>
          )}
          {paginatedCOAs.map((coa, index) => (
            <tr key={index}>
              {/* <td>{coa.coaGroup}</td>
              <td>{coa.coaSubGroup}</td> */}
              <td>{coa.coaCode}</td>
              <td>{coa.coaName}</td>
              <td>{formatCurrency(coa.coaEstimate || 0)}</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" ><FaEye /></Button>
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
      
    </div>
  );
};

export default ChartOfAccounts;
