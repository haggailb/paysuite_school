import React, { useState } from "react";
import { Table, Card, Form, Row, Col, Button} from "react-bootstrap";
import formatMobileNumber from "../../_utils/formatMobileNumber";
import { FaEye } from "react-icons/fa";

const SupplierHistory = ({ supplier = {}  }) => {
  const [validated, setValidated] = useState(false);
  const [newSupplier, setSupplier] = useState({
    code: "",
    name: "",
  });

  const selectedSupplier = supplier;
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      console.log(newSupplier);
    } else {
      setValidated(false);
  };
}

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier({ ...newSupplier, [name]: value });
  };
  
  if (!supplier) return null;

  return (
    <Card>
      <Card.Header>Invoices and Payments</Card.Header>
      <Card.Body>
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>TXN</th>
                <th>Naration</th>
                <th>Amount</th>
                <th>CR / DR</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2"><FaEye size={16} /></button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SupplierHistory;
