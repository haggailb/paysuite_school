import React, { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col} from "react-bootstrap";
import Select from "react-select";
import { getLocations } from "../../_services/locationServices";
import { getTypes } from "../../_services/propertyTypeServices";
import GlassLoader from "../GlassLoader";
import { useMessageModal } from '../../components/ModalContext';
import { saveRentalProperty } from "../../_services/propertyServices";

const NewRentalProperty = () => {
  const [loading, setLoading] = useState(true);
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const { showMessageModal } = useMessageModal();
  const [formData, setFormData] = useState({
    propertyTypeId: 0,
    locationId: 0,
    standNo: "",
    description: "",
    floorArea: 0,
  });
   
  const [locations, setLocations] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  const fetchLocations = async () => {
    try {
      const result = await getLocations(); 
      setLocations(result.rows);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  const fetchPropertyTypes = async () => {
    try {
      const result = await getTypes(); 
      setPropertyTypes(result.rows);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } 
  };

  useEffect(() => {
    setLoading(true);
    fetchLocations();
    fetchPropertyTypes();
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
      const result = await saveRentalProperty(formData);
      if (result.status === 201){
        showMessageModal({
          heading: 'Success!',
          message: `Propert Saved Successfully`,
          messageType: 'success',
        });
        setFormData({
          propertyTypeId: 0,
          locationId: 0,
          standNo: "",
          description: "",
          floorArea: 0 
        });
      }else{
        showMessageModal({
          heading: 'Saving property failed!',
          message: `${result.message}`,
          messageType: 'error',
        });
      }
    } catch (error) {
      showMessageModal({
        heading: 'Error saving property!',
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
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stand Number <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    name="standNo" 
                    type="text" 
                    placeholder="Enter Stand No." 
                    required 
                    value={formData.standNo}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col> 
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Property Type <span className="text-danger">*</span></Form.Label>
                  <Select
                    required
                    options={propertyTypes}
                    getOptionLabel={(e) => e.propertyTypeName}
                    getOptionValue={(e) => e.propertyTypeId}
                    onChange={(selectedOption) => handleSelectChange("propertyTypeId", selectedOption.propertyTypeId)}
                    placeholder="-- Select Type --"
                  />
                </Form.Group>
              </Col> 
            </Row>
            <Row>
              <Form.Group className="mb-3">
                <Form.Label>Location <span className="text-danger">*</span></Form.Label>
                <Select
                  required
                  options={locations}
                  getOptionLabel={(e) => e.locationName}
                  getOptionValue={(e) => e.locationId}
                  onChange={(selectedOption) => handleSelectChange("locationId", selectedOption.locationId)}
                  placeholder="-- Select Location --"
                />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                name="description" 
                type="text" 
                placeholder="Enter new description" 
                required 
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group>
                <Form.Label>Floor Space (SqM)</Form.Label>
                  <Form.Control 
                    name="floorArea" 
                    type="number" 
                    placeholder="Enter value"
                    value={formData.floorArea}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col> 
            </Row>
          </Card.Body>
          <Card.Footer>
            <Button type="submit" className="bg-primary hoverable w-100">Save Property</Button>
          </Card.Footer>
        </Form>
      </Card>
    </div>
  );
};

export default NewRentalProperty;
