import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col} from "react-bootstrap";
import { getLocations, getZones, getClients, getPropertyTypes } from "../../_services/dataServices";
import Select from "react-select";

const NewValuationProperty = () => {
  const [validated, setValidated] = useState(false);
  const [newMarket, setNewMarket] = useState({
    name: "",
    locId: null,
    zoneId: null,
  });

  useEffect(() => {
    setLocations(getLocations());
    setClients(getClients());
    setPropertyTypes(getPropertyTypes());
  }, []);

  const [clients, setClients] = useState([]);
  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const trueFalse = {choice: "True", choice:'False'};

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
      <Card className=" p-4">
        <i className="text-danger">All fields are mandatory</i>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stand Number</Form.Label>
                <Form.Control type="text" placeholder="Enter Stand No." />
              </Form.Group>
            </Col> 
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
          </Row>
          <Row>
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
          </Row>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" placeholder="Enter new description" />
              </Form.Group>
            </Col> 
            <Col md={4}>
              <Form.Group className="mb-3">
              <Form.Label>Area (Ha)</Form.Label>
                <Form.Control type="number" placeholder="Enter value" />
              </Form.Group>
            </Col> 
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
              <Form.Label>Land Value</Form.Label>
                <Form.Control type="number" placeholder="Enter value" />
              </Form.Group>
            </Col> 
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Improvement Value</Form.Label>
                <Form.Control type="number" placeholder="Enter value" onChange={handleChange} />
              </Form.Group>
            </Col> 
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Total Ratable Value</Form.Label>
            <Form.Control type="number" placeholder="-- Computed --" disabled/>
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Comment</Form.Label>
                <Form.Control type="number" placeholder="Enter new comment" />
              </Form.Group>
            </Col>  
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Is Exempted</Form.Label>
                <Select
                  required
                  options={trueFalse}
                  getOptionLabel={(e) => e.name}
                  getOptionValue={(e) => e.name}
                  onChange={(selectedOption) => handleSelectChange("isExempted", selectedOption)}
                  placeholder="-- Select Status --"
                />
              </Form.Group>
            </Col> 
          </Row>
          <div md={6} className="">
            <Button onClick={handleSubmit} type="submit" className="bg-primary hoverable">Register</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default NewValuationProperty;
