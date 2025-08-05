import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col} from "react-bootstrap";
import { getClients, getLocations, getBillboardCats } from "../../_services/dataServices";
import Select from "react-select";

const NewBillboard = () => {
  const [validated, setValidated] = useState(false);
  const [newProperty, setNewProperty] = useState({
    locId: null,
    zoneId: null,
    marketId: null,
    typeId: null,
    stand: "",
    desc: "",
    area: "",
    red: "",
    isVacant:true
  });

  useEffect(() => {
    setClients(getClients());
    setLocations(getLocations());
    setCategories(getBillboardCats());
  }, []);
    
  const billboardTypes = {choice:"Billboard", choice:"Banner"};
  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      console.log(newProperty);
    } else {
      setValidated(false);
  };
}

const handleSelectChange = (field, selectedOption) => {
  setNewProperty({ ...newProperty, [field]: selectedOption });
};
const handleChange = (e) => {
  const { name, value } = e.target;
  setNewProperty({ ...newProperty, [name]: value });
};
  return (
    <div >
      <Card className=" p-4">
        <i className="text-danger">All fields are mandatory</i>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Billboard No.</Form.Label>
                <Form.Control type="text" placeholder="-- Auto Generated --" disabled/>
              </Form.Group>
            </Col> 
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Size Category</Form.Label>
                <Select
                    required
                    options={categories}
                    getOptionLabel={(e) => e.category}
                    getOptionValue={(e) => e.id}
                    onChange={(selectedOption) => handleSelectChange("catId", selectedOption)}
                    placeholder="-- Category --"
                />
              </Form.Group>
              </Col>
            </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
              <Form.Label>Sides</Form.Label>
                <Form.Control type="number" placeholder="Enter sides" />
              </Form.Group>
            </Col> 
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Situation</Form.Label>
                <Select
                  required
                  options={locations}
                  getOptionLabel={(e) => e.name}
                  getOptionValue={(e) => e.id}
                  onChange={(selectedOption) => handleSelectChange("locId", selectedOption)}
                  placeholder="-- Location --"
                />
              </Form.Group>
            </Col> 
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" placeholder="Enter new description" />
          </Form.Group>
          <Form.Group className="mb-3">
          <Form.Label>Physical Location</Form.Label>
            <Form.Control type="text" placeholder="Enter address" />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Owner</Form.Label>
                <Select
                    required
                    options={clients}
                    getOptionLabel={(e) => e.name}
                    getOptionValue={(e) => e.id}
                    onChange={(selectedOption) => handleSelectChange("clientId", selectedOption)}
                    placeholder="-- Select Owner --"
                />
              </Form.Group>
            </Col> 
            <Col md={6}>
              <Form.Group className="mb-3">
              <Form.Label>Occupier</Form.Label>
                <Form.Control type="text" placeholder="Enter new occupier" />
              </Form.Group>
            </Col> 
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Anual Lease</Form.Label>
                <Form.Control type="text" placeholder="-- Auto Calculated --" disabled/>
              </Form.Group>
            </Col> 
          </Row>
          <div md={6} className="">
            <Button onClick={() => handleSubmit} type="submit" className="bg-primary hoverable">Register</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default NewBillboard;
