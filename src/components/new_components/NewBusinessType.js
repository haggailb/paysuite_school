import React, { useState } from "react";
import { Card, Form, Button} from "react-bootstrap";
import { createType } from "../../_services/businessTypeServices";
import GlassLoader from "../GlassLoader";
import { useMessageModal } from '../../components/ModalContext';

const NewBusinessType = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showMessageModal } = useMessageModal();
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    typeCode: "",
    typeName: "",
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
      const result = await createType(formData.typeCode, formData.typeName);
      if (result.status === 201){
        showMessageModal({
          heading: 'Success!',
          message: `Business type saved successfully`,
          messageType: 'success',
        });
        setFormData({
          typeCode: "",
          typeName: "",
        });
      }else{
        showMessageModal({
          heading: 'Saving business type failed!',
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
              <Form.Label>Business Type Code</Form.Label>
              <Form.Control 
                name="typeCode"
                type="text" 
                placeholder="Enter type code" 
                value={formData.typeCode}
                onChange={handleChange} 
                required  
              />
            </Form.Group>
            <Form.Group className="my-3">
              <Form.Label>Business Type Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter name" 
                name="typeName"
                value={formData.typeName}
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

export default NewBusinessType;
