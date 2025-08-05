import { useState, useEffect } from "react";
import { Table, Container, Button, Card, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle, FaHistory, FaBuilding, FaAnchor, FaLink, FaAngleDoubleRight } from "react-icons/fa";
import Select from "react-select"
import getCurrentDate from "../../_utils/formatCurrentDate";
import formatDate from "../../_utils/formatDate";
import formatCurrency from "../../_utils/formatCurrency";
import formatMobileNumber from "../../_utils/formatMobileNumber";
import AsyncSelect from 'react-select/async';
import { getProperties } from '../../_services/propertyServices';
import { useMessageModal } from '../../components/ModalContext';
import { getPaymentMethods } from "../../_services/dataServices";
import { getInstitution } from "../../_services/dataServices";
import GlassLoader from "../../components/GlassLoader";
import { getPropertyBalance } from '../../_services/propertyServices';
import { getBankAccounts } from "../../_services/bankAccountServices";
import { saveRatesReceipt, getReceipt } from "../../_services/receiptServices";
import { getProperty } from "../../_services/propertyServices";
import printBillableReceipt from "../../_documents_print/printBillableReceipt";
  
const PosPropertyRates = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showMessageModal } = useMessageModal();
  const [user, setUser] = useState(null);
  const [balanceBF, setBalanceBF] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyError, setPropertyError] = useState('');
  const [ammountError, setAmountError] = useState('');
  const [payError, setPayError] = useState('');
  const institution = getInstitution;
  const [accountError, setAccountError] = useState('');
  const [refError, setRefError] = useState('');
  const [receipt, setNewReceipt] = useState({
    property:null,
    accountId:0,
    amountDue:balanceBF,
    txnAmount:amountPaid,
    balance:closingBalance,
    txnPayType: '',
    txnRef:''
  });
    
  const [properties, setProperties] = useState([]);
  const [accounts, setBankAccounts] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const [inputValue, setInputValue] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);

  const fetchBankAccounts = async () => {
    try {
      const result = await getBankAccounts(); 
      setBankAccounts(result);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchProperties = async () => {
    try {
      const result = await getProperties('rates'); 
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

  const fetchPropertyBalance = async (propertyId) => {
    try {
      const result = await getPropertyBalance(propertyId); 
      setBalanceBF(result.balance);
      // setNewReceipt({ ...receipt, ['amountDue']: result.balance });
    } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(err.message || 'Something went wrong.');
    } 
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchBankAccounts();
    setPaymentMethods(getPaymentMethods());
    fetchProperties();
    setSelectedProperty(null);
    setBalanceBF(0);
    setAmountPaid(0);
    setClosingBalance(0);
    setNewReceipt({
      property:null,
      accountId:0,
      amountDue:balanceBF,
      txnAmount:amountPaid,
      balance:closingBalance,
      txnPayType: '',
      txnRef:''
    });
    setLoading(false);
  };

  const handleSelectChange = (field, value) => {
    setNewReceipt((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePropertySelect = (field, selectedOption) => {
    setSelectedProperty(selectedOption);
    setNewReceipt({ ...receipt, 'property': selectedOption });
    fetchPropertyBalance(selectedOption.propertyId);
    setAmountPaid(0);
    setClosingBalance(0);
    setNewReceipt((prev) => ({
      ...prev,
      [field]: selectedOption.propertyId,
      'txnRef': `Payment for ${selectedOption.propertyNo}`
    }));
    
  };

  const calculateBalance = (e) => {
    const { name, value } = e.target;
    setAmountPaid(value)
    const cb = new Number(balanceBF) - Number(value);
    setClosingBalance(cb);
    setNewReceipt({ ...receipt, [name]: value, 'amountDue': balanceBF, 'balance': cb });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReceipt({ ...receipt, [name]: value });
  };
  
  const handleKeyPress = (e) => {
    if (e.key === ' ') {
      setTriggerSearch(true);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchBankAccounts();
    setPaymentMethods(getPaymentMethods());
    fetchProperties();
    const user = JSON.parse(sessionStorage.getItem("PaySuiteUserData") || "null");
    if (user) {
      setUser(user);
    }
    setLoading(false);
  }, []); 

  const loadPropertyOptions = (inputText, callback) => {
    if (!triggerSearch || inputText.trim().length < 2) {
      callback([
        {
          propertyId: 0,
          propertyNo: "Search",
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
          propertyNo: "Search",
          firstName: "Properties",
          lastName: "",
        },
      ...filtered.slice(0, 50)
    ];

    callback(result);
    setTriggerSearch(false);
  };
  
  const handleSaveReceipt = async (isPrint) => {
    if (!receipt.property){setPropertyError('You must select a property'); return null}else{setPropertyError('')}
    if (!receipt.txnAmount || receipt.txnAmount === 0){setAmountError('You must enter a valid amount'); return null}else{setAmountError('')}
    if (!receipt.txnPayType || receipt.txnPayType === ''){setPayError('You must select a valid payment method'); return null}else{setPayError('')}
    if (!receipt.accountId || receipt.accountId === 0){setAccountError('You must select a valid account'); return null}else{setAccountError('')}
    if (!receipt.txnRef || receipt.txnRef === ''){setRefError('You must enter a valid reference'); return null}else{setRefError('')}

    setLoading(true);
    try {
      const result = await saveRatesReceipt(receipt);
      if (result.status === 201){
        if(!isPrint){
          showMessageModal({
            heading: 'Success!',
            message: result.receipt.message,
            messageType: 'success',
          });
        } else {
          handlePrintReceipt(result.receipt.receiptNo)
          showMessageModal({
            heading: 'Success!',
            message: result.receipt.message,
            messageType: 'success',
          });
        }
        handleRefresh();
      }else{
        showMessageModal({
          heading: 'Saving receipt failed!',
          message: `Error: ${result.message}`,
          messageType: 'error',
        });
      }
    } catch (error) {
      showMessageModal({
        heading: 'Error saving receipt!',
        message: `${error.message}`,
        messageType: 'error',
      });
    }
    setLoading(false);
  };
 
  const handlePrintReceipt = async (receiptNo) => {
    try {
      const result = await getReceipt(receiptNo); 
      if (!result.success)
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${result.message || 'Something went wrong.'}`,
          messageType: 'error',
        });

      const property = await getProperty(result.receipt.propertyId); 
      printBillableReceipt(result.receipt, property, institution)
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

  // if (error) return <div className="text-danger text-center p-4">❌ Error: {error}</div>;

  return (
    <div>

    <Container className="flex-column justify-content-center align-items-center bg-light">
      <h2 className="page-title text-center mb-4"> Property Rates Receipt</h2>
        <Row>
          <Col md={6} className="mb-3">
            <Card className="h-100 mb-3 shadow">
              <Card.Header>Property Details</Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Search Property <i className="text-danger">*</i></Form.Label>
                        <AsyncSelect
                          id="propertyId"
                          name="propertyId"
                          cacheOptions
                          defaultOptions
                          loadOptions={loadPropertyOptions}
                          getOptionLabel={(e) => `${e.propertyNo} - ${e.firstName} ${e.lastName}`}
                          getOptionValue={(e) => e.propertyId}
                          onChange={(selectedOption) =>  handlePropertySelect("propertyId", selectedOption)}
                          value={properties.find((property) => property.propertyId === receipt.propertyId) || {
                            propertyId: 0,
                            propertyNo: "Search",
                            firstName: "Properties",
                            lastName: "",
                          }}
                          
                          placeholder="Search Properties..."
                          onKeyDown={handleKeyPress}
                          inputValue={inputValue}
                          onInputChange={(value) => {
                            setInputValue(value);
                            setTriggerSearch(false);
                          }}
                        />
                        <Form.Text className="text-danger">{propertyError}</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Stand Number</Form.Label>
                      <Form.Control type="text" value={selectedProperty?.propertyNo || '' } placeholder="-- Auto --" required disabled />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col sm={8} md={12} xl={8}>
                    <Form.Group className="mb-2">
                      <Form.Label>Description</Form.Label>
                      <Form.Control type="text" value={selectedProperty?.description || '' } placeholder="-- Auto --" required disabled />
                    </Form.Group>
                  </Col>
                  <Col sm={4} md={12} xl={4}>
                    <Form.Group className="">
                      <Form.Label>Situation</Form.Label>
                      <Form.Control type="text" value={selectedProperty?.locationName || '' } placeholder="-- Auto --" required disabled />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="h-100 shadow">
              <Card.Header>Customer Details</Card.Header>
              <Card.Body>
                <Row>
                  <Col sm={6} md={12} xl={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Customer ID</Form.Label>
                      <Form.Control type="text" value={selectedProperty?.clientId || '' } placeholder="-- Auto --" required disabled />
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={12} xl={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>National ID</Form.Label>
                      <Form.Control type="text" value={selectedProperty?.nationalId || '' } placeholder="-- Auto --" required disabled />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col sm={6} md={12} xl={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Customer Name</Form.Label>
                      <Form.Control type="text" value={ `${selectedProperty?.firstName || ' '} ${selectedProperty?.lastName || ' '}`} placeholder="-- Auto --" required disabled />
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={12} xl={6}>
                    <Form.Group className="">
                      <Form.Label>Mobile</Form.Label>
                      <Form.Control type="text" value={formatMobileNumber(selectedProperty?.mobileNumber || '') } placeholder="-- Auto --" required disabled />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow">
              <Card.Header>Payment Details</Card.Header>
              <Card.Body>
                <Form.Group className="mb-2">
                  <Form.Label>Balance B/F</Form.Label>
                  <Form.Control type="text" value={formatCurrency(balanceBF)} placeholder="-- Auto --" required disabled />
                </Form.Group>
                <Row>
                  <Col xs={6} md={12} xl={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Amount Paid <i className="text-danger">*</i></Form.Label>
                      <Form.Control 
                        type="number"
                        min={0}
                        value={amountPaid}
                        onChange={calculateBalance} 
                        placeholder="Enter Amount" 
                        required 
                        name="txnAmount"
                      />
                        <Form.Text className="text-danger">{ammountError}</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col xs={6} md={12} xl={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Closing BalanceBF</Form.Label>
                      <Form.Control type="text" value={formatCurrency(closingBalance)} placeholder="-- Auto --" required disabled />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow">
              <Card.Header>Banking Details</Card.Header>
              <Card.Body>
                <Row>
                  <Col sm={6} md={12} xl={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Payment Method <i className="text-danger">*</i></Form.Label>
                      <Select
                        required
                        options={paymentMethods}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => e.name}
                        onChange={(selectedOption) => handleSelectChange("txnPayType", selectedOption.name)}
                        placeholder="Select Method"
                        name="txnPayType"
                      />
                        <Form.Text className="text-danger">{payError}</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col sm={6} md={12} xl={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Account Number <i className="text-danger">*</i></Form.Label>
                      <Select
                        required
                        options={accounts}
                        getOptionLabel={(e) => `${e.bankCodeName} - ${e.accountName}`}
                        getOptionValue={(e) => e.accountId}
                        onChange={(selectedOption) => handleSelectChange("accountId", selectedOption.accountId)}
                        placeholder="Select Account"
                        name="accountId"
                      />
                        <Form.Text className="text-danger">{accountError}</Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="">
                  <Form.Label>Payment Reference <i className="text-danger">*</i></Form.Label>
                  <Form.Control 
                    type="text" 
                    value={receipt.txnRef} 
                    placeholder="Enter reference" 
                    name="txnRef"
                    onChange={handleChange}
                  />
                        <Form.Text className="text-danger">{refError}</Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100 hoverable">
              <Card.Header  className=" bg-primary text-center">
                ACTIONS <br></br> 
                <i> Before saving, ensure all fields marked <span className="text-danger">*</span> are filled</i>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col xs={6} md={12} xl={6} className="mb-2">
                    <Button onClick={() => handleSaveReceipt(true)} type="submit" className="bg-primary hoverable w-100">Save / Print</Button>
                  </Col>
                  <Col xs={6} md={12} xl={6} className="mb-2 text-end">
                    <Button onClick={() => handleSaveReceipt(false)} type="submit" className="bg-primary hoverable w-100">Save Only </Button>
                  </Col>
                </Row>
                <Row>
                  <Col xs={6} md={12} xl={6} className="mb-2 mb-xl-0">
                    <Button onClick={handleRefresh} className="outline-primary hoverable me-2 w-100">Refresh</Button>
                  </Col>
                  <Col xs={6} md={12} xl={6} className="mb-2 mb-xl-0 text-end">
                    <Button onClick={handleRefresh} className="outline-primary hoverable me-2 w-100"> Open Ledger</Button>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="text-center">
                <p className="m-0">User Name: {user ? user.userName : ''}</p>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
    </Container>
    </div>
  );
};

export default PosPropertyRates;
