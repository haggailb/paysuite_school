import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col} from "react-bootstrap";
import Select from "react-select";
import AsyncSelect from 'react-select/async';
import { getClients } from "../../_services/clientServices";
import GlassLoader from "../GlassLoader";
import { useMessageModal } from '../ModalContext';
import { saveLease } from "../../_services/leaseServices";
import { getProperties } from "../../_services/propertyServices";

const NewLease = () => {
  const [loading, setLoading] = useState(true);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const { showMessageModal } = useMessageModal();
  const [inputValue, setInputValue] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [clientInputValue, setClientInputValue] = useState('');
  const [triggerClientSearch, setTriggerClientSearch] = useState(false);

  const [formData, setFormData] = useState({
    propertyId: 0,
    clientId: 0,
    billing: "",
    lease_amount: 0,
    lease_date: null,
    expiry_date: null,
    conditions: ""
  });
  const billingOptions = [
    {name:'Weekly'},
    {name:'Monthly'}
  ];
 
  const [clients, setClients] = useState([]);
  const [properties, setProperties] = useState([]);

  const fetchClients = async () => {
    try {
      const result = await getClients(); 
      setClients(result.rows);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  const fetchProperties = async () => {
    try {
      const result = await getProperties('rentals'); 
      setProperties(result.rows);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } 
  };

  const loadPropertyOptions = (inputText, callback) => {
    if (!triggerSearch || inputText.trim().length < 2) {
      callback([{
        propertyId: 0,
        propertyNo: "Search Properties",
        locationName: ""
      }]);
      return;
    }

    const terms = inputText.toLowerCase().split(/\s+/);
    const filtered = properties.filter(property => {
      const haystack = `${property.propertyNo} ${property.locationName} ${property.description}`.toLowerCase();
      return terms.every(term => haystack.includes(term));
    });

    const result = [{
        propertyId: 0,
        propertyNo: "Search Properties",
        locationName: ""
      },
      ...filtered.slice(0, 50)
    ];

    callback(result);
    setTriggerSearch(false);
  };
  
  const loadClientOptions = (inputText, callback) => {
    if (!triggerClientSearch || inputText.trim().length < 2) {
      callback([{
        clientId: 0,
        firstName: "Search ",
        lastName: "Clients",
        nationalId: ""
      }]);
      return;
    }

    const terms = inputText.toLowerCase().split(/\s+/);

    const filtered = clients.filter(client => {
      const haystack = `${client.firstName} ${client.lastName} ${client.nationalId} ${client.mobileNumber}`.toLowerCase();
      return terms.every(term => haystack.includes(term));
    });

    const result = [{
        clientId: 0,
        firstName: "Search ",
        lastName: "Clients",
        nationalId: ""
      },
      ...filtered.slice(0, 50)
    ];

    callback(result);
    setTriggerClientSearch(false);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === ' ') {
      setTriggerSearch(true);
    }
  };

  const handleClientKeyPress = (e) => {
    if (e.key === ' ') {
      setTriggerClientSearch(true);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchClients();
    fetchProperties();
    setLoading(false);
  }, []);

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

    try {       
      const result = await saveLease(formData);
      if (result.status === 201){
        showMessageModal({
          heading: 'Success!',
          message: `${result.message}`,
          messageType: 'success',
        });
        setFormData({
          propertyId: 0,
          clientId: 0,
          billing: "",
          lease_amount: 0,
          lease_date: null,
          expiry_date: null,
          conditions: ""
        });
      }else{
        showMessageModal({
          heading: 'Saving lease failed!',
          message: `${result.message}`,
          messageType: 'error',
        });
      }
    } catch (error) {
      showMessageModal({
        heading: 'Error saving lease!',
        message: `${error.message}`,
        messageType: 'error',
      });
    }
    setLoading(false);
  };

  const handleSelectChange = (field, selectedOption) => {
    setFormData({ ...formData, [field]: selectedOption });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading)  return (
    <div className="form-container mb-5 position-relative">
      <GlassLoader show={loading} />
    </div>
  );

  return (
    <div >
      <Card>
        <Card.Header><i>All fields marked <span className="text-danger">*</span> are mandatory</i></Card.Header>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Card.Body>
            <Form.Group className="mb-2">
              <Form.Label>Search Clients <i className="text-danger">*</i></Form.Label>
                <AsyncSelect
                  id="clientId"
                  name="clientId"
                  cacheOptions
                  defaultOptions
                  loadOptions={loadClientOptions}
                  getOptionLabel={(e) => `${e.firstName} ${e.lastName} - ${e.nationalId}`}
                  getOptionValue={(e) => e.clientId}
                  onChange={(selectedOption) =>  handleSelectChange("clientId", selectedOption.clientId)}
                  value={clients.find((client) => client.clientId === formData.clientId) || {
                    clientId: 0,
                    firstName: "Search ",
                    lastName: "Clients",
                    nationalId: ""
                  }}
                  placeholder="Search Clients..."
                  onKeyDown={handleClientKeyPress}
                  inputValue={clientInputValue}
                  onInputChange={(value) => {
                    setClientInputValue(value);
                    setTriggerClientSearch(false);
                  }}
                />
                <Form.Text className="text-danger"></Form.Text>
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Search Property <i className="text-danger">*</i></Form.Label>
                    <AsyncSelect
                      id="propertyId"
                      name="propertyId"
                      cacheOptions
                      defaultOptions
                      loadOptions={loadPropertyOptions}
                      getOptionLabel={(e) => `${e.propertyNo} - ${e.locationName}`}
                      getOptionValue={(e) => e.propertyId}
                      onChange={(selectedOption) =>  handleSelectChange("propertyId", selectedOption.propertyId)}
                      value={properties.find((property) => property.propertyId === formData.propertyId) || {
                        propertyId: 0,
                        propertyNo: "Search Properties",
                        locationName: ""
                      }}
                      placeholder="Search Properties..."
                      onKeyDown={handleKeyPress}
                      inputValue={inputValue}
                      onInputChange={(value) => {
                        setInputValue(value);
                        setTriggerSearch(false);
                      }}
                    />
                    <Form.Text className="text-danger"></Form.Text>
                </Form.Group>
              </Col> 
              <Col md={6}>
                <Form.Group className="mb-2">
                  <Form.Label>Billing Method <i className="text-danger">*</i></Form.Label>
                  <Select
                    required
                    options={billingOptions}
                    getOptionLabel={(e) => e.name}
                    getOptionValue={(e) => e.name}
                    onChange={(selectedOption) => handleSelectChange("billing", selectedOption.name)}
                    placeholder="Select Method"
                    name="billing"
                  />
                    {/* <Form.Text className="text-danger">{payError}</Form.Text> */}
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lease Date<i className="text-danger">*</i></Form.Label>
                  <Form.Control 
                    name="lease_date" 
                    type="date" 
                    required 
                    value={formData.lease_date}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date<i className="text-danger">*</i></Form.Label>
                  <Form.Control 
                    name="expiry_date" 
                    type="date" 
                    required 
                    value={formData.expiry_date}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Other Conditions</Form.Label>
              <Form.Control as={'textArea'} 
                name="conditions" 
                type="text" 
                placeholder="Enter new conditions" 
                value={formData.conditions}
                onChange={handleChange}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lease Amount<i className="text-danger ml-3">*</i></Form.Label>
                  <Form.Control 
                    name="lease_amount" 
                    type="number" 
                    min={0}
                    placeholder="Enter new amount" 
                    required 
                    value={formData.lease_amount}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Button type="submit" className="bg-primary hoverable w-100">Save Lease</Button>
          </Card.Footer>
        </Form>
      </Card>
    </div>
  );
};

export default NewLease;
