import { useState, useEffect } from "react";
import { Table, Container, Button, Card, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle, FaHistory, FaBuilding, FaAnchor, FaLink, FaAngleDoubleRight, FaTrash, FaTrashAlt, FaTrashRestoreAlt, FaRegTrashAlt } from "react-icons/fa";
import Select from "react-select"
import {getCurrentDate} from "../../_utils/formatCurrentDate";
import { getIncomeCOA } from "../../_services/dataServices";
import { useNavigate, useParams, useLocation  } from "react-router-dom";
import formatCurrency from "../../_utils/formatCurrency";
import { getAllCOAs } from '../../_services/coaServices';
import { saveTransaction } from "../../_services/transactionServices";
import GlassLoader from "../../components/GlassLoader";

  
const ExpenseJournal = () => {
  const [validated, setValidated] = useState(false);
  
  const user = JSON.parse(sessionStorage.getItem("PaySuiteUserData") || "null");

  let date = getCurrentDate('long'); 
  let dbDate = getCurrentDate('input'); 
  let timeStamp = getCurrentDate('timeStamp'); 
  
  const location = useLocation();
  const { accountKey } = useParams();
  const { accountId, accountName, accountNumber, bankName, branchName, balance, currency } = location.state || {};

  const [newTransaction, setNewTransaction] = useState({
    coaId: 0,
    accountId: accountId,
    userId: user.userId,
    clientName: "",
    txnAmount: 0,
    txnComment: "",
    txnRef: "",
    txnType: 2,
    txnPayType: "",
    txnDate: dbDate,
    txnStamp: timeStamp,
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const paymentOptions = () => [
    { option: "Funds Transfer" },
    { option: "Cash Deposit" }
  ];

  const [coaList, setCoas] = useState([]);
  
  useEffect(() => {
    date = getCurrentDate('long'); 
    dbDate = getCurrentDate('input'); 
    timeStamp = getCurrentDate('timeStamp'); 
    setOptions(paymentOptions());

    const fetchCOAs = async () => {
      setLoading(true);
  
      try {
        const result = await getAllCOAs(2);
        setCoas(result.rows);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchCOAs();
  }, []); 
  
  const handleRefresh = async () => {
    date = getCurrentDate('long'); 
    dbDate = getCurrentDate('input'); 
    timeStamp = getCurrentDate('timeStamp'); 
    setNewTransaction({
      coaId: 0,
      userId: user.userId,
      accountId: accountId,
      clientName: "",
      txnAmount: 0,
      txnComment: "",
      txnRef: "",
      txnType: 2,
      txnPayType: "",
      txnDate: dbDate,
      txnStamp: timeStamp,
    });
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = await getAllCOAs(2);
      setCoas(result.rows); 
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  
  const [options, setOptions] = useState([]);

  const itemList = options;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
  
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
  
    setValidated(true);
  
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const result = await saveTransaction(newTransaction);
      alert(`✅ Transaction saved successfully!`);
      handleRefresh();
    } catch (error) {
      alert(`❌ ${error.message}`);
    }
    setLoading(false);
  };
  

  const handleClose = () => {
    navigate(-1);
  };

  const handleSelectChange = (field, selectedOption) => {
    if (!selectedOption) return;
    setNewTransaction(prev => ({
      ...prev,
      [field]: selectedOption
    }));
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "txnAmount" ? parseFloat(value * -1) : value;
    setNewTransaction(prev => ({ ...prev, [name]: newValue }));
  };
  
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
    <div className=" mb-5">

    <Container className="flex-column justify-content-center align-items-center bg-light">
      <h2 className="page-title text-center"> Expenditure Journal<br></br> <small>( { accountName } )</small></h2>
      <p className="text-center"> ACC: {accountNumber} | Bank : {bankName} - { branchName}</p>
      <div className="d-flex position-relative">
      </div>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col md={6} className="mb-3">
            <Card className="h-100 mb-3 shadow">
              <Card.Header>Account Details</Card.Header>
              <Card.Body>
                <Form.Group className="mb-2">
                  <Form.Label>Account Code</Form.Label>
                  <Select
                    required
                    options={coaList}
                    getOptionLabel={(e) => `${e.coaCode} - ${e.coaName}`}
                    getOptionValue={(e) => e.coaCode}
                    onChange={(selectedOption) => handleSelectChange("coaId", selectedOption.coaId)}
                    placeholder="-- Select Account --"
                  />
                  <Form.Control.Feedback type="invalid">
                    Chart of accounts item is required.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Payee Name</Form.Label>
                  <Form.Control 
                    name="clientName" 
                    type="text" 
                    placeholder="Enter Payee Name" 
                    required 
                    onChange={handleChange} 
                    value={newTransaction.clientName}
                  />
                  <Form.Control.Feedback type="invalid">
                    Payee is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="h-100 shadow">
              <Card.Header>Payment Details</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Amount Paid</Form.Label>
                      <Form.Control 
                        name="txnAmount" 
                        type="number" 
                        placeholder="Enter Amout" 
                        required  
                        onChange={handleChange}
                        value={newTransaction.txnAmount}
                      />
                      <Form.Control.Feedback type="invalid">
                        Transaction amount is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Naration / Comment</Form.Label>
                      <Form.Control 
                        name="txnComment" 
                        type="text" 
                        placeholder="Enter payment details" 
                        required  
                        onChange={handleChange}
                        value={newTransaction.txnComment}
                      />
                      <Form.Control.Feedback type="invalid">
                        Transaction comment / naration is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Reference / Folio</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Enter Payment Reference" 
                        required
                        name="txnRef"
                        onChange={handleChange}
                        value={newTransaction.txnRef}
                      />
                      <Form.Control.Feedback type="invalid">
                        Transaction reference is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                  <Form.Group className="mb-2">
                    <Form.Label>Payment type</Form.Label>
                    <Select
                      required
                      options={options}
                      getOptionLabel={(e) => `${e.option}`}
                      getOptionValue={(e) => e.option}
                      onChange={(selectedOption) => handleSelectChange("txnPayType", selectedOption.option)}
                      placeholder="-- Select Option --"
                    />
                    <Form.Control.Feedback type="invalid">
                      Payment option is required.
                    </Form.Control.Feedback>
                  </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={{ span: 4}} className="mb-3">
            <Card className="h-100 hoverable shadow">
              <Card.Header className=" bg-primary">Actions</Card.Header>
              <Card.Body>
                <Row>
                  <Col xs={6} className="mb-2">
                    <Button type="submit" className="bg-primary hoverable w-100">Save </Button>
                  </Col>
                  <Col xs={6} className="mb-2">
                    <Button variant="secondary" onClick={handleClose} className="outline-primary me-2 w-100">Close</Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
    </div>
  );
};

export default ExpenseJournal;
