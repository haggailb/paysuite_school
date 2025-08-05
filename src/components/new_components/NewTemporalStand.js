import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col} from "react-bootstrap";
import { getLocations, getMarkets, getZones, getClients, getPropertyTypes } from "../../_services/dataServices";
import Select from "react-select";

const NewTemporalStand = () => {
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
      setZones(getZones());
      setClients(getClients());
      setLocations(getLocations());
      setPropertyTypes(getPropertyTypes());
    }, []);
    
  const [zones, setZones] = useState([]);
  const [clients, setClients] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
    const [locations, setLocations] = useState([]);

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
                <Form.Label>Stand Number</Form.Label>
                <Form.Control name="stand" type="text" placeholder="Enter Stand No." required />
              </Form.Group>
            </Col> 
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Property Type</Form.Label>
                <Select
                    required
                    options={propertyTypes}
                    getOptionLabel={(e) => e.name}
                    getOptionValue={(e) => e.id}
                    onChange={(selectedOption) => handleSelectChange("typeId", selectedOption)}
                    placeholder="-- Select Type --"
                />
              </Form.Group>
            </Col>
            </Row>
            <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Select
                  required
                  options={locations}
                  getOptionLabel={(e) => e.name}
                  getOptionValue={(e) => e.id}
                  onChange={(selectedOption) => handleSelectChange("locId", selectedOption)}
                  placeholder="-- Select --"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Zone</Form.Label>
                <Select
                  required
                  options={zones}
                  getOptionLabel={(e) => e.name}
                  getOptionValue={(e) => e.id}
                  onChange={(selectedOption) => handleSelectChange("zoneId", selectedOption)}
                  placeholder="-- Select Zone--"
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control name="desc" type="text" placeholder="Enter new description" required />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
              <Form.Label>Lease Amount</Form.Label>
                <Form.Control name="rent" type="number" placeholder="Enter lease amount" required />
              </Form.Group>
            </Col> 
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Client</Form.Label>
            <Select
              required
              options={clients}
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => e.id}
              onChange={(selectedOption) => handleSelectChange("clientId", selectedOption)}
              placeholder="-- Select Client--"
            />
          </Form.Group>
          <div md={6} className="">
            <Button onClick={() => handleSubmit} type="submit" className="bg-primary hoverable">Register</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default NewTemporalStand;
