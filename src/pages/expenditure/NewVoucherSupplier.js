import { useState, useEffect } from "react";
import { Table, Container, Button, Card, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle, FaHistory, FaBuilding, FaAnchor, FaLink, FaAngleDoubleRight } from "react-icons/fa";
import Select from "react-select"
import CurleaseDate from "../../_utils/formatCurrentDate";
import formatCurrency from "../../_utils/formatCurrency";
import formatMobileNumber from "../../_utils/formatMobileNumber";
import { getCOA, getBankAccounts, getPaymentMethods, getSuppliers, getDepartments } from "../../_services/dataServices";
  
  const today = <CurleaseDate />;

const NewVoucherSupplier = () => {
  const [search, setSearch] = useState("");
  const [curleasePage, setCurleasePage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);
  const [newVoucher, setNewVoucher] = useState({
    locId: "",
    zoneId: "",
    code: "",
    name: "",
  });

  useEffect(() => {
    setCOA(getCOA());
    setSuppliers(getSuppliers());
    setBankAccounts(getBankAccounts());
    setPaymentMethods(getPaymentMethods());
    setDepartments(getDepartments());
  }, []);
    
  const [coAccounts, setCOA] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [accounts, setBankAccounts] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [departments, setDepartments] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newVoucher);
  };

  const handleRefresh = () => {
    setCOA(getCOA());
    setSuppliers(getSuppliers());
    setBankAccounts(getBankAccounts());
    setPaymentMethods(getPaymentMethods());
    setDepartments(getDepartments());
  };

  const handleSelectChange = (field, selectedOption) => {
    setNewVoucher({ ...newVoucher, [field]: selectedOption });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVoucher({ ...newVoucher, [name]: value });
  };
  
  return (
    <div className=" mb-5">

    <Container className="flex-column justify-content-center align-items-center bg-light">
      <h2 className="page-title text-center mb-4"> Payment Voucher  <br></br>( Suppliers )</h2>
      <div className="d-flex position-relative">
      </div>
        <Row>
          <Col md={6} className="mb-3">
            <Card className="h-100 mb-3 shadow">
              <Card.Header>Coart of Accounts Details</Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Item Code</Form.Label>
                      <Select
                        required
                        options={coAccounts}
                        getOptionLabel={(e) => `${e.code} - ${e.name}`}
                        getOptionValue={(e) => e.code}
                        onChange={(selectedOption) => handleSelectChange("coaCode", selectedOption)}
                        placeholder="-- Select Code --"
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Item Name</Form.Label>
                      <Form.Control type="text" placeholder="-- Auto --" required disabled />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="h-100 shadow">
              <Card.Header>Supplier Details</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Supplier Name</Form.Label>
                      <Select
                        required
                        options={suppliers}
                        getOptionLabel={(e) => `${e.clientId} - ${e.name}`}
                        getOptionValue={(e) => e.clientId}
                        onChange={(selectedOption) => handleSelectChange("clientId", selectedOption)}
                        placeholder="-- Select Code --"
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Departement</Form.Label>
                      <Select
                        required
                        options={departments}
                        getOptionLabel={(e) => `${e.name}`}
                        getOptionValue={(e) => e.id}
                        onChange={(selectedOption) => handleSelectChange("coaCode", selectedOption)}
                        placeholder="-- Select Code --"
                      />
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
                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Amount Due</Form.Label>
                      <Form.Control type="number" placeholder="Enter Amount" required />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Amount Paid</Form.Label>
                      <Form.Control type="number" placeholder="Enter Amount" required />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Closing Balance</Form.Label>
                      <Form.Control type="text" placeholder="-- Auto --" required disabled />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="">
                  <Form.Label>Naration</Form.Label>
                  <Form.Control type="text" placeholder="Enter naration"/>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow">
              <Card.Header>Banking Details</Card.Header>
              <Card.Body>
                <Form.Group className="mb-2">
                  <Form.Label>Payment Method</Form.Label>
                  <Select
                    required
                    options={paymentMethods}
                    getOptionLabel={(e) => e.name}
                    getOptionValue={(e) => e.id}
                    onChange={(selectedOption) => handleSelectChange("payMethId", selectedOption)}
                    placeholder="-- Select Method--"
                  />
                </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Account Number</Form.Label>
                    <Select
                      required
                      options={accounts}
                      getOptionLabel={(e) => e.name}
                      getOptionValue={(e) => e.id}
                      onChange={(selectedOption) => handleSelectChange("bAccountId", selectedOption)}
                      placeholder="-- Select Account--"
                    />
                  </Form.Group>
                <Form.Group className="">
                  <Form.Label>Payment Reference</Form.Label>
                  <Form.Control type="text" placeholder="Enter reference"/>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100 hoverable">
              <Card.Header className=" bg-primary">Actions</Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={6} className="mb-2">
                    <Button onClick={handleSubmit} type="submit" className="bg-primary hoverable">Save and Print</Button>
                  </Col>
                  <Col lg={6} className="mb-2">
                    <Button onClick={handleSubmit} type="submit" className="bg-primary hoverable">Save Only </Button>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6} className="mb-2">
                    <Button onClick={handleRefresh} className="outline-primaryme-2"><FaRecycle/> Refresh</Button>
                  </Col>
                  <Col lg={6} className="mb-2">
                    <Button variant="secondary" onClick={handleRefresh} className="outline-primaryme-2">Clear All</Button>
                  </Col>
                </Row>
                <Button onClick={handleRefresh} className="outline-primaryme-2"> Go to Receipts Ledger <FaAngleDoubleRight/></Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
    </Container>
    </div>
  );
};

export default NewVoucherSupplier;
