import React, { useState, useEffect } from "react";
import { Card, Form, Button} from "react-bootstrap";
import { createType } from "../../_services/propertyTypeServices";
import GlassLoader from "../GlassLoader";
import { useMessageModal } from '../../components/ModalContext';

const NewPropertyType = () => {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    propertyTypeCode: "",
    propertyTypeName: "",
    propertyTypePoundage: "",
  });
  const [loading, setLoading] = useState(false);
  const { showMessageModal } = useMessageModal();
  const [error, setError] = useState('');

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
      const result = await createType(formData.propertyTypeCode, formData.propertyTypeName, formData.propertyTypePoundage);
      if (result.status === 201){
        showMessageModal({
          heading: 'Success!',
          message: `Property type saved successfully`,
          messageType: 'success',
        });
        setFormData({
          propertyTypeCode: "",
          propertyTypeName: "",
          propertyTypePoundage: "",
        });
      }else{
        showMessageModal({
          heading: 'Saving property type failed!',
          message: `Error: ${result.message}`,
          messageType: 'error',
        });
      }
    } catch (error) {
      showMessageModal({
        heading: 'Error saving property type!',
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
              <Form.Label>Property Type Code</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter code" 
                name="propertyTypeCode"
                value={formData.propertyTypeCode}
                onChange={handleChange}
                required
                isInvalid={validated && !formData.propertyTypeCode}
                isValid={formData.propertyTypeCode && !validated}
              />
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Property Type Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter name" 
                name="propertyTypeName"
                value={formData.propertyTypeName}
                onChange={handleChange}
                required
                isInvalid={validated && !formData.propertyTypeName}
              />
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Poundage ( <i> for property rates calculation </i> )</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Enter poundage" 
                name="propertyTypePoundage"
                value={formData.propertyTypePoundage}
                onChange={handleChange}
                required
                isInvalid={validated && !formData.propertyTypePoundage}
                isValid={formData.propertyTypePoundage && !validated}
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

export default NewPropertyType;
