import React, { useState } from "react";
import { Card, Form, Button} from "react-bootstrap";
import { createZone } from "../../_services/zoneServices";
import GlassLoader from "../GlassLoader";
import { useMessageModal } from '../../components/ModalContext';

const NewZone = () => {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showMessageModal } = useMessageModal();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    zoneCode: "",
    zoneName: "",
  });

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
    const result = await createZone(formData.zoneCode, formData.zoneName);
    if (result.status === 201){
      showMessageModal({
        heading: 'Success!',
        message: `Zone saved successfully`,
        messageType: 'success',
      });
      setFormData({
        zoneCode: "",
        zoneName: "",
      });
    }else{
      showMessageModal({
        heading: 'Saving zone failed!',
        message: `Error: ${result.message}`,
        messageType: 'error',
      });
    }
  } catch (error) {
    showMessageModal({
      heading: 'Error saving zone!',
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
      <Card>
        <Card.Header className="text-center">
          <i>All fields are mandatory</i>
        </Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="my-3">
              <Form.Label>Zone Code</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter code" 
                name="zoneCode"
                value={formData.zoneCode}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Zone Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter name" 
                name="zoneName"
                value={formData.zoneName}
                onChange={handleChange}
                required
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

export default NewZone;
