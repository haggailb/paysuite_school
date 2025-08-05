import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col} from "react-bootstrap";
import { getCOA } from "../../_services/dataServices";
import Select from "react-select";

const NewCoaCategory = () => {
  const [validated, setValidated] = useState(false);
  const [newMarket, setNewMarket] = useState({
    name: "",
    locId: null,
    zoneId: null,
  });

    useEffect(() => {
      setCOA(getCOA());
    }, []);
  
  const [coAccounts, setCOA] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      console.log(newMarket);
    } else {
      setValidated(false);
  };
}

const handleSelectChange = (field, selectedOption) => {
  setNewMarket({ ...newMarket, [field]: selectedOption });
};
const handleChange = (e) => {
  const { name, value } = e.target;
  setNewMarket({ ...newMarket, [name]: value });
};
  return (
    <div >
      <Card>
        <Card.Header className="text-danger"><i>All fields are mandatory</i></Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Account Code</Form.Label>
            <Select
              required
              options={coAccounts}
              getOptionLabel={(e) => `${e.code} - ${e.name}`}
              getOptionValue={(e) => e.code}
              onChange={(selectedOption) => handleSelectChange("coaCode", selectedOption)}
              placeholder="-- Select Code --"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control type="text" placeholder="Enter new category" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control type="number" placeholder="Enter new amount" />
          </Form.Group>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewCoaCategory;
