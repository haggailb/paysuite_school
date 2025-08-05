import { useState, useEffect } from "react";
import { Button, Table, Form, Row, Col, Card } from "react-bootstrap";
import { FaEye, FaEdit, FaHistory, FaPlusCircle, FaPrint, FaFileExcel, FaFileCsv, FaInfoCircle, FaInfo } from "react-icons/fa";
import * as XLSX from "xlsx";
import CurrentDate from "../../_utils/formatCurrentDate";
import formatMobileNumber from "../../_utils/formatMobileNumber";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { createBusiness } from '../../_services/businessServices';
import { getClients } from '../../_services/clientServices';
import GlassLoader from "../GlassLoader";
import { useMessageModal } from '../../components/ModalContext';
import { getLocations } from "../../_services/locationServices";
import { getMarkets } from "../../_services/marketServices";
import { getTypes } from "../../_services/businessTypeServices";
  
const NewBusiness = () => {
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const { showMessageModal } = useMessageModal();

const [inputValue, setInputValue] = useState('');
const [triggerSearch, setTriggerSearch] = useState(false);

const handleKeyPress = (e) => {
  if (e.key === ' ') {
    setTriggerSearch(true);
  }
};

const loadClientOptions = (inputText, callback) => {
  if (!triggerSearch || inputText.trim().length < 2) {
    callback([]);
    return;
  }

  const terms = inputText.toLowerCase().split(/\s+/);

  const filtered = clients.filter(client => {
    const haystack = `${client.firstName} ${client.lastName} ${client.nationalId} ${client.mobileNumber}`.toLowerCase();
    return terms.every(term => haystack.includes(term));
  });

  callback(filtered.slice(0, 50)); // limit results to prevent UI overload
  setTriggerSearch(false);
};

  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    regNumber: "",
    clientId: null,
    locationId: null,
    marketId: null,
    typeId: null,
    physicalAddress: "",
    mobileNumber: "",
    email: ""
  });
  
  const [locations, setLocations] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [clients, setClients] = useState([]);

  const fetchClients = async () => {
    try {
      const clientResults = await getClients(); 
      setClients(clientResults.rows);
    } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(err.message || 'Something went wrong.');
    }
  };

  const fetchLocations = async () => {
    try {
      const locationResults = await getLocations(); 
      setLocations(locationResults.rows);
    } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(err.message || 'Something went wrong.');
    }
  };

  const fetchTypes = async () => {
    try {
      const typeResults = await getTypes(); 
      setBusinessTypes(typeResults.rows);
    } catch (err) {
        showMessageModal({
          heading: 'Server Error!',
          message: `Error: ${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      setError(err.message || 'Something went wrong.');
    }
  };

  const fetchMarkets = async () => {
    try {
      const marketResults = await getMarkets(); 
      setMarkets(marketResults.rows);
    } catch (err) {
      showMessageModal({
        heading: 'Server Error!',
        message: `Error: ${err.message || 'Something went wrong.'}`,
        messageType: 'error',
      });
      setError(err.message || 'Something went wrong.');
    } 
  };

  useEffect(() => {
    setLoading(true);

    fetchMarkets();
    fetchTypes();
    fetchLocations();
    fetchClients();

    setLoading(false);
  }, []);

  const handleSelectChange = (field, selectedOption) => {
    setFormData({ ...formData, [field]: selectedOption });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
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
      const submissionData = {
        ...formData,
        clientId: formData.clientId?.clientId || 0,
        locationId: formData.locationId?.locationId || 0,
        marketId: formData.marketId?.marketId || 0,
        typeId: formData.typeId?.typeId || 0,
      };
      
      const result = await createBusiness(submissionData);
      if (result.status === 201){
        showMessageModal({
          heading: 'Success!',
          message: `Business profile saved successfully`,
          messageType: 'success',
        });
        setFormData({
          name: "",
          regNumber: "",
          clientId: null,
          locationId: null,
          marketId: null,
          typeId: null,
          physicalAddress: "",
          mobileNumber: "",
          email: ""
        });
      }else{
        showMessageModal({
          heading: 'Saving profile failed!',
          message: `Error: ${result.message}`,
          messageType: 'error',
        });
      }
    } catch (error) {
      showMessageModal({
        heading: 'Error saving business!',
        message: `${error.message}`,
        messageType: 'error',
      });
      // console.error("❌ Error submitting form:", error.message);
    }
    setLoading(false);
  };
   
  if (loading)  return (
    <div className="form-container mb-5 position-relative">
      <GlassLoader show={loading} />
    </div>
  );

  if (error) return <div className="text-danger text-center p-4">❌ Error: {error}</div>;

  return (
    <div >
      <Card>
        <Card.Header className="text-center">
          <FaInfoCircle/> <i>All fields marked <span className="text-danger">*</span> are mandatory</i>
        </Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
              
                  <Form.Group className="mb-3">
                    <Form.Label>Owner Name <span className="text-danger">*</span></Form.Label>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions={false}
                      loadOptions={loadClientOptions}
                      getOptionLabel={(e) => `${e.firstName} ${e.lastName} - ${e.nationalId} - ${e.mobileNumber}`}
                      getOptionValue={(e) => e.clientId}
                      onChange={(selectedOption) => handleSelectChange("clientId", selectedOption)}
                      value={formData.clientId}
                      placeholder="Type owner name, press Space"
                      onKeyDown={handleKeyPress}
                      inputValue={inputValue}
                      onInputChange={(value) => {
                        setInputValue(value);
                        setTriggerSearch(false);
                      }}
                    />
                  </Form.Group>
                {/* <Form.Group className="mb-3">
                  <Form.Label>Owner Name <span className="text-danger">*</span></Form.Label>
                  <Select
                    name="clientId"
                    required
                    options={clients}
                    getOptionLabel={(e) => `${e.firstName} ${e.lastName} -  ${e.nationalId} - ${e.mobileNumber}`}
                    getOptionValue={(e) => e.clientId}
                    onChange={(selectedOption) => handleSelectChange("clientId", selectedOption)}
                    value={formData.clientId}
                    placeholder="Select Owner"
                  />
                </Form.Group> */}
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Business Type <span className="text-danger">*</span></Form.Label>
                  <Select
                    name="typeId"
                    required
                    options={businessTypes}
                    getOptionLabel={(e) => e.typeName}
                    getOptionValue={(e) => e.typeId}
                    onChange={(selectedOption) => handleSelectChange("typeId", selectedOption)}
                    value={formData.typeId}
                    placeholder="Select Type"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                <Form.Label>Location <span className="text-danger">*</span></Form.Label>
                  <Select
                    name="locationId"
                    required
                    options={locations}
                    getOptionLabel={(e) => e.locationName}
                    getOptionValue={(e) => e.locationId}
                    onChange={(selectedOption) => handleSelectChange("locationId", selectedOption)}
                    value={formData.locationId}
                    placeholder="Select Location"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Market</Form.Label>
                  <Select
                    name="marketId"
                    required
                    options={markets}
                    getOptionLabel={(e) => e.marketName}
                    getOptionValue={(e) => e.marketId}
                    onChange={(selectedOption) => handleSelectChange("marketId", selectedOption)}
                    value={formData.marketId}
                    placeholder="-- Select Market --"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Business Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    name="name"
                    required 
                    type="text" 
                    placeholder="Enter business name" 
                    onChange={handleChange} 
                    value={formData.name}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Registration Number</Form.Label>
                  <Form.Control 
                    name="regNumber"
                    type="text" 
                    placeholder="Enter business registration number" 
                    onChange={handleChange} 
                    value={formData.regNumber}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number <i> ( starting with 260 )</i>  <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    name="mobileNumber"
                    required 
                    type="text" 
                    placeholder="Enter Mobile Number"
                    onChange={handleChange} 
                    value={formData.mobileNumber}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Business Address <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    name="physicalAddress" 
                    type="text"  
                    placeholder="Enter address" 
                    onChange={handleChange} 
                    value={formData.physicalAddress}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control 
                name="email"
                type="email" 
                placeholder="Enter email address"
                onChange={handleChange} 
                value={formData.email}
              />
            </Form.Group>
            <Button type="submit" className="bg-primary hoverable w-50">Register</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewBusiness;
