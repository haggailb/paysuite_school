import { useState, useEffect } from "react";
import { Table, Container, Button, Card, Form, Row, Col, Modal } from "react-bootstrap";
import { FaEye, FaEdit, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaBan, FaRecycle, FaHistory, FaBuilding, FaAnchor, FaLink, FaAngleDoubleRight, FaTrash, FaTrashAlt, FaTrashRestoreAlt, FaRegTrashAlt } from "react-icons/fa";
import Select from "react-select"
import CurleaseDate from "../../_utils/formatCurrentDate";
import formatCurrency from "../../_utils/formatCurrency";
import formatMobileNumber from "../../_utils/formatMobileNumber";
import { getAllProperties, getBankAccounts, getPaymentMethods, getClients } from "../../_services/dataServices";
  
  const today = <CurleaseDate />;

const InvoiceBillable = () => {
  const [search, setSearch] = useState("");
  const [curleasePage, setCurleasePage] = useState(1);
  const recordsPerPage = 10;
  const [showNewModal, setShowNewModal] = useState(false);
  const [newReceipt, setNewReceipt] = useState({
    locId: "",
    zoneId: "",
    code: "",
    name: "",
  });

  useEffect(() => {
    setProperties(getAllProperties());
    setBankAccounts(getBankAccounts());
    setPaymentMethods(getPaymentMethods());
    setClients(getClients());
  }, []);

  const items = () => [
    { id: "F/1000", owner: "Client 1" },
    { id: "BLB/153002", owner: "Client 1" },
    { id: "RENT/153003", owner: "Client 1" }
  ];
  const [clients, setClients] = useState([]);
  const [properties, setProperties] = useState([]);
  const [accounts, setBankAccounts] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const itemList = items;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newReceipt);
  };

  const handleRefresh = () => {
    setProperties(getAllProperties());
    setBankAccounts(getBankAccounts());
    setPaymentMethods(getPaymentMethods());
    setClients(getClients());
  };

  const handleSelectChange = (field, selectedOption) => {
    setNewReceipt({ ...newReceipt, [field]: selectedOption });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReceipt({ ...newReceipt, [name]: value });
  };
   
  return (
    <div className=" mb-5">

    <Container className="flex-column justify-content-center align-items-center bg-light">
      <h2 className="page-title text-center mb-4"> Invoice <br></br>(Billable Items)</h2>
      <div className="d-flex position-relative">
      </div>
        <Row>
          <Col md={6} className="mb-3">
            <Card className="h-100 mb-3 shadow">
              <Card.Header>Property Details</Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Property Number</Form.Label>
                      <Select
                        required
                        options={properties}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => e.id}
                        onChange={(selectedOption) => handleSelectChange("catId", selectedOption)}
                        placeholder="-- Select Property --"
                      />
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Property Type</Form.Label>
                      <Form.Control type="text" placeholder="-- Auto --" required disabled />
                    </Form.Group>
                  </Col>
                </Row>
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
                      <Form.Label>Amount Due</Form.Label>
                      <Form.Control type="text" placeholder="-- Auto --" required disabled />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Col className="mb-3">
          <Card className="h-100">
            <Card.Header>Receipt Items</Card.Header>
            <Card.Body>
              <Table striped bordered hover className="data-table">
                <thead className="table-dark">
                  <tr>
                    <th>Property Number</th>
                    <th>Customer Name</th>
                    <th>Property Type</th>
                    <th>Amount Due</th>
                    <th>Amount Paid</th>
                    <th>Balance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td><Button variant="outline-danger" size="sm" className="me-2" onClick={() => {}}><FaTrash /></Button></td>
                  {/* {itemList.map((item, index) => (
                    <tr key={index}>
                      <td>{item.code}</td>
                      <td>{item.name}</td>
                      <td>{item.poundage}</td>
                      <td><Button variant="outline-danger" size="sm" className="me-2" onClick={() => {}}><FaBan /></Button></td>
                    </tr>
                  ))} */}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Row>
          <Col md={4} className="mb-3">
            <Card className="h-100 shadow">
              <Card.Header>Client Details</Card.Header>
              <Card.Body>
                <Form.Group className="mb-2">
                  <Form.Label>Client Code</Form.Label>
                  <Select
                    required
                    options={clients}
                    getOptionLabel={(e) => e.name}
                    getOptionValue={(e) => e.id}
                    onChange={(selectedOption) => handleSelectChange("clientId", selectedOption)}
                    placeholder="-- Select Client--"
                  />
                </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Client Name</Form.Label>
                    <Form.Control type="text" placeholder="-- Auto --" disabled/>
                  </Form.Group>
                <Form.Group className="">
                  <Form.Label>Reference</Form.Label>
                  <Form.Control type="text" placeholder="Enter reference"/>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="h-100 hoverable">
              <Card.Header  className=" bg-primary">Actions</Card.Header>
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
                <Button onClick={handleRefresh} className="outline-primaryme-2"> Go to Invoices <FaAngleDoubleRight/></Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
    </Container>
    </div>
  );
};

export default InvoiceBillable;
