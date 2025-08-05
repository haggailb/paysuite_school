import React, { useState, useEffect } from "react";
import { Card, Form, Button} from "react-bootstrap";
import Select from "react-select";
import { getZones } from '../../_services/zoneServices';
import { createLocation } from '../../_services/locationServices';
import GlassLoader from "../GlassLoader";
import { useMessageModal } from '../../components/ModalContext';

const NewLocation = () => {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showMessageModal } = useMessageModal();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    zoneId:null,
    locationCode: "",
    locationName: "",
  });

  const [zones, setZones] = useState([]);

  const fetchZones = async () => {
    try {
      const result = await getZones(); 
      setZones(result.rows);
    } catch (err) {
      showMessageModal({
        heading: 'failed to retrieve zones!',
        message: `Error: ${err.message || 'Something went wrong.'}`,
        messageType: 'error',
      });
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);
   
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (field, selectedOption) => {
    if (!selectedOption) return;
    setFormData(prev => ({
      ...prev,
      [field]: selectedOption.zoneId
    }));
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
    const result = await createLocation(formData.zoneId, formData.locationCode, formData.locationName);
    if (result.status === 201){
      showMessageModal({
        heading: 'Success!',
        message: `Location saved successfully`,
        messageType: 'success',
      });
      setFormData({
        zoneId: null,
        locationCode: "",
        locationName: "",
      });
    }else{
      showMessageModal({
        heading: 'Saving location failed!',
        message: `Error: ${result.message}`,
        messageType: 'error',
      });
    }
  } catch (error) {
    showMessageModal({
      heading: 'Error saving location!',
      message: `${error.message}`,
      messageType: 'error',
    });
  }
  setLoading(false);
};
 
if (loading)  return (
  <div className="form-container mb-5 position-relative">
    <GlassLoader show={loading} />
  </div>
);

  return (
    <div >
      <Card >
        <Card.Header className="text-center">
          <Card.Subtitle className="text-muted">All fields are mandatory</Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Zone Name</Form.Label>
              <Select
                required
                name="zoneId"
                options={zones}
                getOptionLabel={(e) => e.zoneName}
                getOptionValue={(e) => e.zoneId}
                onChange={(selectedOption) => handleSelectChange("zoneId", selectedOption)}
                placeholder="-- Select Zone --"
              />
              <Form.Control.Feedback type="invalid">
                Zone is required.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Location Code</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter code" 
                name="locationCode"
                value={formData.locationCode}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Location code is required.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Location Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter name" 
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                required
              />
              <Form.Control.Feedback type="invalid">
                Location name is required.
              </Form.Control.Feedback>
            </Form.Group>
            <div md={6} className="">
              <Button type="submit" className="bg-primary hoverable w-50">Register</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewLocation;
