import React, { useState, useEffect } from "react";
import { Card, Form, Button} from "react-bootstrap";
import Select from "react-select";
import { getLocations } from '../../_services/locationServices';
import { createMarket } from '../../_services/marketServices';
import GlassLoader from "../GlassLoader";
import { useMessageModal } from '../../components/ModalContext';

const NewMarket = () => {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showMessageModal } = useMessageModal();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    marketName: "",
    locationId: null,
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const result = await getLocations(); 
        setLocations(result.rows);
      } catch (err) {
        showMessageModal({
          heading: 'failed to retrieve locations!',
          message: `Error: ${err.message || 'Something went wrong.'}`,
          messageType: 'error',
        });
      }
    };
  
    fetchLocations();
  }, []);
   
  const [locations, setLocations] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (field, selectedOption) => {
    if (!selectedOption) return;
    setFormData(prev => ({
      ...prev,
      [field]: selectedOption.locationId
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
    const result = await createMarket(formData.locationId, formData.marketName);
    if (result.status === 201){
      showMessageModal({
        heading: 'Success!',
        message: `Market saved successfully`,
        messageType: 'success',
      });
      setFormData({
        locationId: null,
        marketName: "",
      });
    }else{
      showMessageModal({
        heading: 'Saving market failed!',
        message: `Error: ${result.message}`,
        messageType: 'error',
      });
    }
  } catch (error) {
    showMessageModal({
      heading: 'Error saving market!',
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
            <Form.Label>Market Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter maarket name" 
              name="marketName"
              value={formData.marketName}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="my-3">
            <Form.Label>Location</Form.Label>
              <Select
                required
                options={locations}
                getOptionLabel={(e) => e.locationName}
                getOptionValue={(e) => e.locationId}
                onChange={(selectedOption) => handleSelectChange("locationId", selectedOption)}
                placeholder="-- Select Location --"
              />
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

export default NewMarket;
